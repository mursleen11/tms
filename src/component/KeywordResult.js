import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from "antd";

function KeywordResult() {
  const { word } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "AIzaSyBH5CfCNXpXPT30HsKoD4ZEwJ4ZMnZrCAg"; 
  const searchEngineId = "23ce578a3ff674f33"; 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${word}`);
        setSearchResults(response.data.items || []);
      } catch (error) {
        console.error("Error fetching data from Google:", error);
      }
    };

    fetchResults();
  }, [word]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Search Results for: {word}</h1>
      <div style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}><Button type="primary" onClick={() => window.history.back()} style={{marginLeft: '10px', float: 'right'}}>back</Button>
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <div key={item.link} style={{ marginBottom: '20px' }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#007bff', textDecoration: 'none' }}>{item.title}</a>
              <p>{item.snippet}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default KeywordResult;
