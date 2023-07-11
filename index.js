const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// MongoDB 
const mongoURI = 'mongodb+srv://prince:Prince@cluster0.60sw3hp.mongodb.net/TASK1?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Failed to connect:', error);
  });

// Encrypt 
const encryptPassword = (password) => {
  const encryptedPassword = CryptoJS.AES.encrypt(password, 'encryption_secret_key').toString();
  return encryptedPassword;
};

// Decrypt encryptedss 
const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'encryption_secret_key');
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPassword;
};

// Create user
const createUser = async () => {
  try {
    const encryptedPassword = encryptPassword('Exrgo@12345');
    const newUser = new User({ email: 'hdfc@abcd.com', password: encryptedPassword });
    await newUser.save();
    console.log('User created successfully');
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};

// Login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const decryptedPassword = decryptPassword(user.password);
    if (password === decryptedPassword) {
      res.json({ success: true, message: 'Authentication successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Dashboard 
app.get('/dashboard', (req, res) => {

  const data = { message: 'Dashboard data' };
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'encryption_secret_key').toString();
  res.json(encryptedData);
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});