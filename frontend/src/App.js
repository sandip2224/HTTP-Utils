import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios'

function App() {
  const [data, setData] = useState([
    { name: 'John Doe', age: 25, status: '' },
    { name: 'Jane Smith', age: 32, status: '' },
    { name: 'Alice Johnson', age: 28, status: '' },
    { name: 'Bob Brown', age: 22, status: '' },
    { name: 'Eva Williams', age: 29, status: '' },
  ]);

  const handleFetchStatus = async () => {
    const updatedData = [...data];

    for (let i = 0; i < updatedData.length; i++) {
      try {
        await fetchDataWithRetries(updatedData, i);
      } catch (error) {
        console.error('Error fetching status:', error.message);
      }
    }

    setData(updatedData);
  };

  const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    return response;
  }

  const fetchDataWithRetries = async (data, index) => {
    let retryCount = 0;

    while (retryCount < 3) {
      try {
        // const jsonData = await axios.get('/api/data', {
        //   timeout: 3000,
        // });

        const response = await fetchWithTimeout('/api/data', {
          timeout: 3000
        });

        const jsonData = await response.json();

        if (response.status !== 200) {
          throw new Error(jsonData.message || 'Network response was not ok');
        }

        data[index].status = "Fetched data!";
        return;
      }
      catch (error) {
        console.log('Error fetching data:', error.message);

        retryCount += 1;
        console.log(`Retrying fetch, attempt: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Retry after 1 second
      }
    }

    data[index].status = 'Max retries reached, stopping retry attempts.';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Table with Retry</h1>
        <Button variant="contained" color="primary" onClick={handleFetchStatus}>
          Fetch Status
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div>
  );
}

export default App;
