import { getCustomRepository } from 'typeorm';
import SettingsRepository from '../repositories/SettingsRepository';

interface Settings {
  username: string;
  chat: boolean;
}

class SettingsService {

  async create({ username, chat }: Settings) {
    const settingsRepository = getCustomRepository(SettingsRepository);

    const userAlreadyExists = await settingsRepository.findOne({ username });

    if (userAlreadyExists) {
      throw new Error('The user already exists!');
    }

    const settings = settingsRepository.create({ username, chat });

    await settingsRepository.save(settings);

    return settings;
  }

}

export default SettingsService;
