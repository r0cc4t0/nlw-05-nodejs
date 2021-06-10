import { getCustomRepository, Repository } from 'typeorm';
import Message from '../entities/Message';
import MessagesRepository from '../repositories/MessagesRepository';

interface Messages {
  admin_id?: string;
  user_id: string;
  text: string;
}

class MessagesService {

  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ admin_id, user_id, text }: Messages) {
    const message = this.messagesRepository.create({ admin_id, user_id, text });

    await this.messagesRepository.save(message);

    return message;
  }

  async showByUser(user_id: string) {
    const messages = await this.messagesRepository.find({
      where: { user_id },
      relations: ['user']
    });

    return messages;
  }

}

export default MessagesService;
