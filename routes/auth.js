const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const uuid = require("uuid");
require('dotenv').config();

app.post("/account/api/oauth/token", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ errorCode: "com.axis.backend.oauth.invalid_request", errorMessage: "Email and Password are required.", numericErrorCode: "1013" });
    }
    const user = User.findOne({ email: username });
    if (!user) {
        return res.status(400).json({ errorCode: "com.axis.backend.incorrect-credentials", errorMessage: "No account was found with that email.", numericErrorCode: "18031" });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ errorCode: "com.axis.backend.incorrect-credentials", errorMessage: "You have provided the incorrect password.", numericErrorCode: "18031" });
    }

    if (user.banned) {
        return res.status(400).json({ errorCode: "com.axis.backend.banned", errorMessage: "You are permanently banned from Axis.", numericErrorCode: "-1" });
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
    const expiresIn = "8";
    const accessToken = jwt.sign({
        "app": "fortnite",
        "sub": user.accountId,
        "dvid": deviceId,
        "mver": false,
        "clid": clientId,
        "dn": user.username,
        "am": "password",
        "p": Buffer.from(functions.MakeID()).toString("base64"),
        "iai": user.accountId,
        "sec": 1,
        "clsvc": "fortnite",
        "t": "s",
        "ic": true,
        "jti": functions.MakeID().replace(/-/ig, ""),
        "creation_date": new Date(),
        "hours_expire": expiresIn
    }, process.env.JWT_SECRET, { expiresIn: `${expiresIn}h` });

    res.json({
        access_token: `axisaccesswhen?`,
        expires_in: expiresIn,
        expires_at: "",
        token_type: "bearer",
        refresh_token: `axisrefreshwhen?`,
        refresh_expires: "",
        refresh_expires_at: "",
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
