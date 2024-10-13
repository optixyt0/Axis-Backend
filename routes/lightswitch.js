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

app.get("/lightswitch/api/service/bulk/status", async (req, res) => {
        return res.json([{
          "serviceInstanceId": "fortnite",
          "status": "UP",
          "message": "fortnite is up.",
          "maintenanceUri": null,
          "overrideCatalogIds": [
            "a7f138b2e51945ffbfdacc1af0541053"
          ],
          "allowedActions": [
            "PLAY",
            "DOWNLOAD"
          ],
          "banned": false,
          "launcherInfoDTO": {
            "appName": "Fortnite",
            "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
            "namespace": "fn"
          }
        }]);
      });

module.exports = app;
