const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return cb(new Error('Hanya diperbolehkan format jpg, jpeg, png, atau webp'));
    }
    cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
  }
});

function fileFilter(_, file, cb) {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya diperbolehkan format jpg, jpeg, png, atau webp'), false);
  }
}

// Asynchronous Magic Bytes validation
async function validateMagicBytes(req, res, next) {
  if (!req.file) return next();
  const filePath = req.file.path;
  let fileHandle = null;

  try {
    fileHandle = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(12);
    await fileHandle.read(buffer, 0, 12, 0);
    await fileHandle.close();
    fileHandle = null;

    const mime = req.file.mimetype;
    let isValid = false;

    if (mime === 'image/jpeg') {
      isValid = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    } else if (mime === 'image/png') {
      isValid = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    } else if (mime === 'image/webp') {
      // Byte 0-3 harus 'RIFF' dan Byte 8-11 harus 'WEBP'
      const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
      const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
      isValid = isRiff && isWebp;
    }

    if (!isValid) {
      await fs.promises.unlink(filePath).catch(() => {});
      return res.status(400).json({ error: 'File bukan gambar valid' });
    }

    next();
  } catch (error) {
    if (fileHandle) await fileHandle.close().catch(() => {});
    await fs.promises.unlink(filePath).catch(() => {});
    return res.status(400).json({ error: 'Gagal memvalidasi file gambar' });
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;
module.exports.validateMagicBytes = validateMagicBytes;
