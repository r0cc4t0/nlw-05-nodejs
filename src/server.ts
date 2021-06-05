import express from 'express';
import './database';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
  return response.json({ message: 'Hello, World!' });
});

app.post('/', (request, response) => {
  return response.json({ message: 'Data has been saved successfully!' });
});

app.listen(3333, () => console.log('Server is running on port 3333...'));
