const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'upload_images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload_images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: 'left blank for security reasons',      
  database: 'clickfit_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
    createTables();
  }
});

function createTables() {
  const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    active TINYINT DEFAULT 1
  );`;

  const createStoredProcedureSQL = `
  CREATE PROCEDURE IF NOT EXISTS addUser(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type VARCHAR(255)
  )
  BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (p_email, p_password, p_type, 1);
  END;`;

  db.query(createUserTableSQL, (err, result) => {
    if (err) {
      console.error('Error creating users table: ', err);
    } else {
      console.log('Users table checked/created successfully');
      
      db.query(createStoredProcedureSQL, (err, result) => {
        if (err) {
          console.error('Error creating stored procedure: ', err);
        } else {
          console.log('Stored procedure checked/created successfully');
          
                        insertTestUser();
        }
      });
    }
  });
}

function insertTestUser() {
  const callProcedureSQL = `CALL addUser('admin@clickfit.com', 'password123', 'admin');`;
  
  db.query(callProcedureSQL, (err, result) => {
    if (err) {
      console.error('Error inserting test user: ', err);
    } else {
      console.log('Test user inserted or already exists');
    }
  });
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/upload_images', express.static(path.join(__dirname, 'upload_images')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading file: ', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

app.post('/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    const fileNames = req.files.map(file => file.filename);
    
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: fileNames
    });
  } catch (error) {
    console.error('Error uploading files: ', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

app.get('/images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error reading images directory'
      });
    }
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    return res.status(200).json({
      success: true,
      images: imageFiles.map(file => `/upload_images/${file}`)
    });
  });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the website at http://localhost:${PORT}`);
});