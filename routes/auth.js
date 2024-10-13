const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Token = require('../models/token.js');
const uuid = require("uuid");
const mongoose = require('mongoose');
require('dotenv').config();

app.post("/account/api/oauth/token", async (req, res) => {
    const { username, password, grant_type } = req.body;
    if (!username || !password) {
        return res.status(400).json({ errorCode: "com.axis.backend.oauth.invalid_request", errorMessage: "Email and Password are required." });
    }
    const user = User.findOne({ email: username });
    if (!user) {
        return res.status(400).json({ errorCode: "com.axis.backend.incorrect-credentials", errorMessage: "No account was found with that email." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ errorCode: "com.axis.backend.incorrect-credentials", errorMessage: "You have provided the incorrect password." });
    }

    if (user.banned) {
        return res.status(400).json({ errorCode: "com.axis.backend.banned", errorMessage: "You are permanently banned from Axis." });
    }

    const authHeader = req.headers["authorization"];
    let clientId;

    if (authHeader) {
        try {
            const base64Credentials = authHeader.split(" ")[1];
            const credentials = Buffer.from(base64Credentials, "base64").toString();
            [clientId] = credentials.split(":");
        } catch (err) {
            console.error("Invalid Authorization Header Format", err);
        }
    }

    if (!clientId) {
        throw new Error("ClientId could not be extracted");
    }
    const deviceId = uuid.v4().replace(/-/ig, "");

    let current_token = await Token.findOne({ accountId: user.accountId });

    if (!current_token || new Date() > current_token.expiresAt) {
        const newAccessToken = crypto.randomBytes(32).toString('hex');
        const newRefreshToken = crypto.randomBytes(32).toString('hex');

        if (current_token) {
            current_token.token = newAccessToken;
            current_token.expiresAt = new Date(Date.now() + 28800 * 1000);
            current_token.refreshToken = newRefreshToken;
            current_token.refreshExpiresAt = new Date(Date.now() + 86400 * 1000);
        } else {
            current_token = new Token({
                token: newAccessToken,
                accountId: user.accountId,
                expiresAt: new Date(Date.now() + 28800 * 1000),
                refreshToken: newRefreshToken,
                refreshExpiresAt: new Date(Date.now() + 86400 * 1000)
            });
        }

        await current_token.save();
    }

    res.json({
        access_token: current_token.token,
        expires_in: Math.round((new Date(current_token.expiresAt).getTime() - Date.now()) / 1000),
        expires_at: current_token.expiresAt.toISOString(),
        token_type: 'bearer',
        refresh_token: current_token.refreshToken,
        refresh_expires: Math.round((new Date(current_token.refreshExpiresAt).getTime() - Date.now()) / 1000),
        refresh_expires_at: current_token.refreshExpiresAt.toISOString(),
        account_id: user.accountId,
        client_id: clientId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user.username,
        app: "fortnite",
        in_app_id: user.accountId,
        device_id: deviceId
    });
});

module.exports = app;