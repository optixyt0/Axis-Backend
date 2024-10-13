const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

app.listen(5555, () => {
    console.log('API listening on port 5555.');
});

app.use(express.json());

app.get('/launcher/version', (req, res) => {
    res.json({
        name: "Axis Launcher",
        version: "v0.1.0"
    });
});

app.get('/launcher/download', (req, res) => {
    res.json({
        name: "Axis Launcher",
        version: "v0.1.0",
        url: "coming soon"
    });
});

app.get('/launcher/game/version', (req, res) => {
    res.json({
        season: "Chapter 2 Season 1",
        build: "11.31"
    });
});

app.post('/launcher/login', (req, res) => {
    const { email, password } = req.body;
    const user = User.findOne({ email: email });

    if (!user) {
        res.json({ message: "No account was found for that email.", succeeded: "false" });
    }

    const passwordCheck = bcrypt.compare(password, user.password);

    if (!passwordCheck) {
        res.json({ message: "Incorrect password.", succeeded: "false" });
    }

    if (user.banned) {
        res.json({ message: "You are currently banned from Axis.", succeeded: "false" });
    }

    res.json({ message: "Welcome to Axis!", succeeded: "true" });
});

function generateAccountId() {
    const uuid = uuidv4();
    const accountId = uuid.replace(/-/g, '').substring(0, 32);
    return accountId.toUpperCase();
}

async function hashPassword(password) {
    try {
      if (!password) {
        throw new Error('Password is required');
      }
  

      const salt = await bcrypt.genSalt(15);

      if (!salt) {
        throw new Error('Salt generation failed');
      }
  

      const hashedPassword = await bcrypt.hash(password, salt);
  
      return hashedPassword;
    } catch (err) {
      console.error('Error hashing password:', err.message);
    }
  }

app.post('/backend/register', async(req, res) => {
    const { email, username, password } = req.body;
    const user = User.findOne({ email: email });

    if (user) {
        res.json({ message: "You already have an account!", succeeded: "false" });
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
        created: new Date(),
        banned: false,
        accountId: generateAccountId(),
        username: username,
        username_lower: username?.toLowerCase(),
        email: email,
        password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "Welcome to Axis " + username + "!", email: email, accountId: newUser.accountId, password: hashedPassword, succeeded: "true" });
});