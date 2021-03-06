import { io } from '../http';
import ConnectionsService from '../services/ConnectionsService';
import MessagesService from '../services/MessagesService';

io.on('connection', async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

  io.emit('admin_show_all_users', allConnectionsWithoutAdmin);

  socket.on('admin_show_messages_by_user', async (params, callback) => {
    const { user_id } = params;
    const allMessages = await messagesService.showByUser(user_id);
    callback(allMessages);
  });

  socket.on('admin_send_message', async (params) => {
    const { user_id, text } = params;

    await messagesService.create({ text, user_id, admin_id: socket.id });

    const connection = await connectionsService.findByUserId(user_id);

    const socket_id = connection?.socket_id as string;

    io.to(socket_id).emit('admin_send_to_client', { text, socket_id: socket.id });
  });

  socket.on('admin_user_in_support', async (params) => {
    const { user_id } = params;

    await connectionsService.updateAdminID(user_id, socket.id);

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit('admin_show_all_users', allConnectionsWithoutAdmin);
  });
});
