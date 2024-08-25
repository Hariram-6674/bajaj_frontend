import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    numbers: false,
    alphabets: false,
    highestLowercase: false,
  });
  const [getResponse, setGetResponse] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSelectChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(input);
      } catch (err) {
        throw new Error('Invalid JSON format.');
      }

      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid data format. Expected an array.');
      }

      const result = await axios.post('https://bajaj-backend-9ldl.onrender.com/bfhl', {
        data: parsedData.data,
      });

      setResponse(result.data);
      setError(null);
    } catch (err) {
      setResponse(null);
      setError(err.message);
    }
  };

  const handleGetRequest = async () => {
    try {
      const result = await axios.get('https://bajaj-backend-9ldl.onrender.com/bfhl');
      setGetResponse(result.data);
      setError(null);
    } catch (err) {
      setGetResponse(null);
      setError(err.message);
    }
  };

  const renderResponse = () => {
    if (!response) return null;
    let displayText = '';
    if (selectedOptions.numbers) {
      if (response.numbers.length > 0) {
        displayText += `Numbers: ${response.numbers.join(', ')}\n`;
      }
    }

    if (selectedOptions.alphabets) {
      if (response.alphabets.length > 0) {
        displayText += `Alphabets: ${response.alphabets.join(', ')}\n`;
      }
    }

    if (selectedOptions.highestLowercase) {
      if (response.highest_lowercase_alphabet.length > 0) {
        displayText += `Highest Lowercase Alphabet: ${response.highest_lowercase_alphabet.join(', ')}\n`;
      }
    }

    if (!selectedOptions.numbers && !selectedOptions.alphabets && !selectedOptions.highestLowercase) {
      displayText = `User ID: ${response.user_id}\nEmail: ${response.email}\nRoll Number: ${response.roll_number}`;
    } else if (displayText === '') {
      displayText = 'No data available for the selected filters.';
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{displayText || 'No data available.'}</pre>
      </div>
    );
  };

  const renderGetResponse = () => {
    if (!getResponse) return null;

    return (
      <div>
        <h3>GET Response:</h3>
        <pre>{`Operation Code: ${getResponse.operation_code}`}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>21BPS1623 Hariram Pasupathy</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={input}
          onChange={handleInputChange}
          placeholder='Enter JSON (e.g., {"data": ["M", "1", "334", "4", "B", "Z", "a"]})'
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderResponse()}
      <div>
        <label>
          <input
            type="checkbox"
            name="numbers"
            checked={selectedOptions.numbers}
            onChange={handleSelectChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            name="alphabets"
            checked={selectedOptions.alphabets}
            onChange={handleSelectChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            name="highestLowercase"
            checked={selectedOptions.highestLowercase}
            onChange={handleSelectChange}
          />
          Highest Lowercase Alphabet
        </label>
      </div>
      <button onClick={handleGetRequest}>Get Operation Code</button>
      {renderGetResponse()}
    </div>
  );
}

export default App;
