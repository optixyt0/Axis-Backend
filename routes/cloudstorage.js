const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Token = require('../models/token.js');
const uuid = require("uuid");
const crypto = require('crypto');
require('dotenv').config();

app.get("/fortnite/api/cloudstorage/system", async (req, res) => {
    return res.status(200).json({ status: "OK", code: 200 })
});


app.get("/fortnite/api/cloudstorage/user/*", async (req, res) => {
        return res.status(200).json({ status: "OK", code: 200 })
});

app.get("/fortnite/api/cloudstorage/user/*/*", async (req, res) => {
    return res.status(200).json({ status: "OK", code: 200 })
});


module.exports = app;
