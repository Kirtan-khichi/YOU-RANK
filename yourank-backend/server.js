require('dotenv').config();

// console.log(process.env.MONGODB_URL);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://golusinghmazedar:3zZ9oIHrYC5UJHHH@cluster0.my6pqth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Engdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define schema for engineering parameters
const EngineeringParameter = mongoose.model('EngineeringParameter', new mongoose.Schema({
  parameter: String,
  weight: Number,
}));

app.post(`/api/engineering/parameters`, async (req, res) => {
  try {
    const engineeringParameters = req.body;
    
    // Iterate over the received parameters
    for (const paramName in engineeringParameters) {
      const weight = engineeringParameters[paramName].weight;
      
      // Create a new EngineeringParameter document for each parameter and weight
      const engineeringParameter = new EngineeringParameter({
        parameter: paramName,
        weight: weight,
      });
      
      // Save the document to the database
      await engineeringParameter.save();
    }

    console.log('Received parameters:', req.body);


    // console.log(engineeringParameters);
    
    res.status(201).json({ message: 'Parameters submitted successfully for Engineering' });
  } catch (error) {
    console.error('Error submitting engineering parameters:', error);
    res.status(500).json({ error: 'An error occurred while submitting the engineering parameters' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
