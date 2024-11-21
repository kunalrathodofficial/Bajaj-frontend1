import React, { useState } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle JSON input change
  const handleJsonInput = (event) => {
    setJsonInput(event.target.value);
  };

  // Function to validate the JSON input
  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateJson(jsonInput)) {
      setError("Invalid JSON input. Please check your data.");
      return;
    }

    setError(null);
    setIsLoading(true);
    
    // Make the POST request
    try {
      const result = await axios.post("http://localhost:5000/bfhl", JSON.parse(jsonInput), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(result.data);
    } catch (error) {
      setError("Network Error: Unable to reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle multi-select dropdown change
  const handleDropdownChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  // Function to render selected data based on dropdown choices
  const renderResponse = () => {
    if (!response) return null;
    
    const { numbers, alphabets, highest_lowercase_alphabet, is_prime_found } = response;
    
    return (
      <div>
        {selectedOptions.includes("Numbers") && (
          <div><strong>Numbers:</strong> {numbers.join(", ")}</div>
        )}
        {selectedOptions.includes("Alphabets") && (
          <div><strong>Alphabets:</strong> {alphabets.join(", ")}</div>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") && (
          <div><strong>Highest Lowercase Alphabet:</strong> {highest_lowercase_alphabet.join(", ")}</div>
        )}
        <div><strong>Prime Found:</strong> {is_prime_found ? "Yes" : "No"}</div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>{`Roll Number: 0827CS211131`}</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter JSON here"
          value={jsonInput}
          onChange={handleJsonInput}
          rows="6"
          cols="50"
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}

      <div>
        <label>Select the data to display:</label>
        <select multiple onChange={handleDropdownChange}>
          <option value="Numbers">Numbers</option>
          <option value="Alphabets">Alphabets</option>
          <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
        </select>
      </div>

      <div className="response">
        {renderResponse()}
      </div>
    </div>
  );
};

export default App;
