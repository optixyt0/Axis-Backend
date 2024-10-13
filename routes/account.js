const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Token = require('../models/token.js');
const uuid = require("uuid");
const crypto = require('crypto');
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
require('dotenv').config();

app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", (req, res) => {
    return res.send("true");
})

app.get('/fortnite/api/game/v2/enabled_features', (req, res) => {
    return res.status(200).send([]);
})

module.exports = app;
