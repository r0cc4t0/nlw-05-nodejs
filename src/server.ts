import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import 'reflect-metadata';
import './database';
import routes from './routes';

const app = express();

app.use(express.json());

app.use(routes);

const http = createServer(app);

const io = new Server(http);

io.on('connection', (socket: Socket) => {
  console.log('Successfully connected!', socket.id);
});

http.listen(3333, () => console.log('Server is running on port 3333...'));
