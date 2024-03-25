from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pandas as pd
import io

app = FastAPI()
print("fast-api")

def score_fun(weight_list, df_raw):
    orig_total = [20, 30, 20, 30, 35, 40, 15, 10, 40, 15, 25, 20, 30, 30, 20, 20, 100]
    weight_list_norm = [weight / orig_total[i] for i, weight in enumerate(weight_list)]
    list_of_columns = ["SS", "FSR", "FQE", "FRU", "PU", "QP", "IPR", "FPPP", "GPH", "GUE", "GMS", "GPHD", "RD", "WD", "ESCS", "PCS", "PR"]
    df_columns = df_raw[list_of_columns]
    weight = pd.DataFrame(pd.Series(weight_list_norm, index=list_of_columns, name=0))
    df_columns['weighted_sum'] = df_columns.dot(weight)
    df_columns['College'] = df_raw['College']
    df_columns['Original Rank'] = df_raw['Original Rank']
    df_sorted = df_columns.sort_values('weighted_sum', ascending=False)
    return df_sorted

@app.post("/calculate-scores")
async def calculate_scores(weight_list: list, csv_data: str):
    print("calculate-score")
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        print(df)
        calculated_rankings = score_fun(weight_list, df)
        return JSONResponse(content=calculated_rankings.to_dict(orient='records'))
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
