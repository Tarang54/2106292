const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 9876;

let numbers = [];

app.get('/numbers/:numberid', async (req, res) => {
  const numberid = req.params.numberid;
  let url;

  switch (numberid) {
    case 'p':
      url = '';
      break;
    case 'f':
      url = 'http://20.244.56.144/test/fibo';
      break;
    case 'e':
      url = 'http://20.244.56.144/test/even';
      break;
    case 'r':
      url = 'http://20.244.56.144/test/rand';
      break;
    default:
      return res.status(400).send('Invalid numberid');
  }

  const response = await fetch(url);
  const data = await response.json();

  const fetchedNumbers = data.numbers;
  let uniqueNumbers = [];
  if (Array.isArray(fetchedNumbers)) {
    uniqueNumbers = fetchedNumbers.filter(num => !numbers.includes(num));
  }

  const prevState = [...numbers];

  numbers.push(...uniqueNumbers);
  if (numbers.length > 10) {
    numbers = numbers.slice(numbers.length - 10);
  }

  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;

  const result = {
    windowPrevState: prevState,
    windowCurrState: numbers,
    numbers: uniqueNumbers,
    avg: avg.toFixed(2),
  };

  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});