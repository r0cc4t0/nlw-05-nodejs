import { io } from '../http';
import ConnectionsService from '../services/ConnectionsService';

io.on('connection', async (socket) => {
  const connectionsService = new ConnectionsService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

  io.emit('admin_show_all_users', allConnectionsWithoutAdmin);
});
