import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [retrievalName, setRetrievalName] = useState('');
  
  // Handle adding data
  const handleAddData = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Send POST request to backend
    try {
      const response = await fetch('http://localhost:8080/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Data added successfully');
      } else {
        alert(`Error: ${result.message || 'Something went wrong'}`);
      }
    } catch (error) {
      alert('Error connecting to the backend');
    }
  };

  const handleRetrieveData = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!retrievalName) {
      alert('Name is required for retrieval!');
      return;
    }

    // Send GET request to backend
    try {
      const response = await fetch(`http://localhost:8080/user/find?name=${retrievalName}`);
      const result = await response.json();

      if (response.ok) {
        alert(`Retrieved Data: ${JSON.stringify(result)}`);
      } else {
        alert(`Error: ${result.message || 'No data found'}`);
      }
    } catch (error) {
      alert('Error connecting to the backend');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Add Data Form */}
        <form onSubmit={handleAddData}>
          <p>Add Data</p>
          <input 
            type="text" 
            placeholder="Input name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Input email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input id="send" type="submit" value="Submit"/>
        </form>

        {/* Retrieve Data Form */}
        <form onSubmit={handleRetrieveData}>
          <p>Retrieve Data</p>
          <input 
            type="text" 
            placeholder="Input name" 
            value={retrievalName}
            onChange={(e) => setRetrievalName(e.target.value)}
          />
          <input id="retrieve" type="submit" value="Submit"/>
        </form>
      </header>
    </div>
  );
}

export default App;
