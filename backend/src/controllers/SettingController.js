const settingService = require('../services/SettingService');

class SettingController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingService.getSettings();
      return res.json(settings);
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      await settingService.updateSettings(req.body);
      const updated = await settingService.getSettings();
      return res.json({ ok: true, settings: updated });
    } catch (err) {
      next(err);
    }
  }

  async uploadImage(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'File foto wajib disertakan (jpg, png, webp, max 2MB)' });
    }
    return res.json({ ok: true, url: `/uploads/${req.file.filename}` });
  }
}

module.exports = new SettingController();
