const multer = require('multer');

// Set up Multer storage
const storage = multer.memoryStorage();

// Set up Multer upload middleware
const upload = multer({ storage });

module.exports = upload;