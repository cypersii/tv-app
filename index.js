const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');
const PORT = process.env.port || 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// Static credentials 
const users = [
  { id: 1, email: 'manish@gmail.com', password: '12345678m1' },
  { id: 2, email: 'rohit@gmail.com', password: '12345678m2' },
  { id: 3, email: 'goku@gmail.com', password: '12345678m3' },
];

// Secret key for JWT token
const secretKey = 'bad-key';

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with matching credentials
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  //  JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: '1h', // Token expiration time
  });

  res.json({ token });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q: title } = req.query;
  const token = req.headers.authorization;

  try {
    // Verify JWT token
    jwt.verify(token, secretKey);

    // Fetch search results from TV Maze API
    const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${title}`);

    const shows = response.data.map((result) => result.show);
    res.json(shows);
  } catch (error) {
    console.error('Search failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
