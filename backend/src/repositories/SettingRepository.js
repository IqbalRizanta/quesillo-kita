const prisma = require('../lib/prisma');
const { mem, DEFAULT_SETTINGS } = require('../lib/store');

class SettingRepository {
  async getAll() {
    if (prisma) {
      try {
        const rows = await prisma.siteSetting.findMany();
        const obj = {};
        rows.forEach(r => { obj[r.key] = r.value; });
        return { ...DEFAULT_SETTINGS, ...mem.settings, ...obj };
      } catch (err) {
        console.warn('[SettingRepository.getAll] DB fallback to mem:', err.message);
      }
    }
    return { ...DEFAULT_SETTINGS, ...mem.settings };
  }

  async upsertMany(settingsMap) {
    if (prisma) {
      try {
        for (const [key, value] of Object.entries(settingsMap)) {
          await prisma.siteSetting.upsert({
            where: { key },
            update: { value: String(value ?? '') },
            create: { key, value: String(value ?? '') }
          });
        }
        return true;
      } catch (err) {
        console.warn('[SettingRepository.upsertMany] DB fallback to mem:', err.message);
      }
    }
    Object.assign(mem.settings, settingsMap);
    return true;
  }
}

module.exports = new SettingRepository();
