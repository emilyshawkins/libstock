import React, { useState } from "react";
import axios from "axios";

const TestCors = () => {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const testPing = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await axios.get("http://localhost:8080/api/test/ping");
      setResult(response.data);
    } catch (error) {
      console.error("Error testing CORS:", error);

      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>CORS Test</h2>
      <p>Click the button below to test if CORS is working correctly:</p>

      <button
        onClick={testPing}
        disabled={loading}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Testing..." : "Test CORS"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          <h3>Success!</h3>
          <p>
            Response from server: <strong>{result}</strong>
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            color: "#d32f2f",
          }}
        >
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestCors;
