import { io } from '../http';
import ConnectionsService from '../services/ConnectionsService';
import UsersService from '../services/UsersService';
import MessagesService from '../services/MessagesService';

interface Params {
  text: string;
  email: string;
}

io.on('connection', socket => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on('client_first_access', async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as Params;

    let user_id = null;
    const userAlreadyExists = await usersService.findByEmail(email);

    if (!userAlreadyExists) {
      const user = await usersService.create(email);

      await connectionsService.create({ socket_id, user_id: user.id });

      user_id = user.id;
    }
    else {
      user_id = userAlreadyExists.id;

      const connection = await connectionsService.findByUserId(userAlreadyExists.id);

      if (!connection) {
        await connectionsService.create({ socket_id, user_id: userAlreadyExists.id });
      }
      else {
        connection.socket_id = socket_id;
        await connectionsService.create(connection);
      }

      await connectionsService.create({ socket_id, user_id: userAlreadyExists.id });
    }

    await messagesService.create({ text, user_id });

    const allMessages = await messagesService.showByUser(user_id);

    socket.emit('client_show_all_messages', allMessages);
  });

  socket.on('client_send_to_admin', async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const connection = await connectionsService.findBySocketID(socket_id);

    const user_id = connection?.user_id as string;

    const message = await messagesService.create({ text, user_id });

    io.to(socket_admin_id).emit('admin_receive_message', { message, socket_id });
  });
});
