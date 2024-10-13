const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Token = require('../models/token.js');
const uuid = require("uuid");
const crypto = require('crypto');
require('dotenv').config();

app.get("/friends/api/public/friends/*", async (req, res) => {
    res.status(200).send([]);
});

app.get("/friends/api/public/blocklist/*", async (req, res) => {
    res.status(200).send([]);
});

module.exports = app;
