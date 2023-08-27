const express = require('express');
const app = express();
const port = 3001;

app.get('/api/data', (req, res) => {
  // Simulate random success or error response
  const randomSuccess = Math.random() >= 0.5;
  if (randomSuccess) {
    const jsonData = { message: 'Success from the server!' };
    res.status(200).json(jsonData);
  } else {
    // res.status(500).json({ message: 'Error from the server.' });
    // Simulate a 504 Gateway Timeout after a delay of 8 seconds
    setTimeout(() => {
      res.status(504).json({ message: 'Gateway Timeout' });
    }, 8000);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
