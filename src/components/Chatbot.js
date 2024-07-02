import React, { useState } from 'react';
import Select from 'react-select';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css'; 

const Chatbot = ({ rankings }) => {
  const [userQuery, setUserQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);

  const handleQueryChange = (event) => {
    setUserQuery(event.target.value);
  };

  const handleSendQuery = async () => {
    if (selectedColleges.length < 2) {
      setChatResponse('Please select at least two colleges to compare.');
      return;
    }

    const apiKey = 'AIzaSyCGNPSILWN2lWLZ_lr-ZTua4V4kRIUDgo4'; // Hardcoded API Key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const selectedCollegesData = selectedColleges.map(college => {
      const collegeData = rankings.find(c => c.college === college.value);
      return {
        name: college.value,
        Faculty_Student_Ratio: collegeData['Faculty Student Ratio'],
        Faculty_Quality: collegeData['Faculty Quality'],
        Region_Diversity: collegeData['Region Diversity'],
        Woman_diversity: collegeData['Woman diversity'],
        Peer_reputation: collegeData['Peer reputation'],
        Rank: collegeData.Rank,
        Score: collegeData.Score,
        City: collegeData.City,
        State: collegeData.State
      };
    });

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Compare the following colleges based on Faculty Student Ratio, Faculty Quality, Region Diversity, Woman diversity, Peer reputation, Rank, Score, City, State:\n${selectedCollegesData.map(college => `${college.name}, Faculty Student Ratio: ${college.Faculty_Student_Ratio}, Faculty Quality: ${college.Faculty_Quality}, Region Diversity: ${college.Region_Diversity}, Woman diversity: ${college.Woman_diversity}, Peer reputation: ${college.Peer_reputation}, Rank: ${college.Rank}, Score: ${college.Score}, City: ${college.City}, State: ${college.State}`).join('\n')}`
            }
          ]
        }
      ]
    };

    console.log('API Key:', apiKey);
    console.log('API URL:', apiUrl);
    console.log('Request Data:', JSON.stringify(requestData));

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (
        data &&
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const responseText = data.candidates[0].content.parts[0].text || 'No response text available';
        setChatResponse(responseText);
      } else {
        throw new Error('Response format is incorrect');
      }
    } catch (error) {
      console.error('Error querying API:', error);
      setChatResponse(`Sorry, something went wrong: ${error.message}`);
    }
  };

  const handleCollegeSelect = (selectedOptions) => {
    setSelectedColleges(selectedOptions);
  };

  const collegeOptions = rankings.map(ranking => ({
    value: ranking.college,
    label: ranking.college
  }));

  return (
    <>
      <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
        <svg className="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
          <g>
            <g>
              <path fill="#fff" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"/>
            </g>
          </g>
        </svg>
      </div>
      {isOpen && (
        <div className="container">
          <div className="nav-bar">
            <a>Chat</a>
            <div className="close" onClick={() => setIsOpen(false)}>
              <div className="line one"></div>
              <div className="line two"></div>
            </div>
          </div>
          <div className="messages-area">
            <div className="message">
              <ReactMarkdown>{chatResponse}</ReactMarkdown>
            </div>
          </div>
          <div className="sender-area">
            <div className="input-place">
              <input
                placeholder="Send a message."
                className="send-input"
                type="text"
                value={userQuery}
                onChange={handleQueryChange}
              />
              <div className="send" onClick={handleSendQuery}>
                <svg className="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
                  <g>
                    <g>
                      <path fill="#fff" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"/>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div className="college-selection">
              <label>Select colleges to compare:</label>
              <Select
                isMulti
                name="colleges"
                options={collegeOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleCollegeSelect}
                value={selectedColleges}
                styles={{
                  menu: provided => ({ ...provided, zIndex: 9999, maxHeight: 150 }),
                  menuList: provided => ({ ...provided, maxHeight: 150 })
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
