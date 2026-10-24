const settingRepository = require('../repositories/SettingRepository');

class SettingService {
  async getSettings() {
    return await settingRepository.getAll();
  }

  async updateSettings(settingsMap) {
    if (!settingsMap || typeof settingsMap !== 'object') {
      const err = new Error('Data pengaturan tidak valid');
      err.status = 400;
      throw err;
    }
    return await settingRepository.upsertMany(settingsMap);
  }
}

module.exports = new SettingService();
