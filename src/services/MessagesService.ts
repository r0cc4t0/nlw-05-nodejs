import { getCustomRepository } from 'typeorm';
import MessagesRepository from '../repositories/MessagesRepository';

interface Messages {
  admin_id?: string;
  user_id: string;
  text: string;
}

class MessagesService {

  async create({ admin_id, user_id, text }: Messages) {
    const messagesRepository = getCustomRepository(MessagesRepository);

    const message = messagesRepository.create({ admin_id, user_id, text });

    await messagesRepository.save(message);

    return message;
  }

}

export default MessagesService;
