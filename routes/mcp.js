const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Profile = require('../models/profile.js');
const uuid = require("uuid");
const crypto = require('crypto');
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
require('dotenv').config();
const common_public = require('../responses/DefaultProfiles/common_public.json');
const common_core = require('../responses/DefaultProfiles/common_core.json');
const keychain = require('../responses/keychain.json');


app.post("/fortnite/api/game/v2/profile/:accountId/client/QueryProfile", (req, res) => {
    const { accountId } = req.params;
    const { profileId, rvn } = req.query;

    if (profileId == "common_public") {
        return res.status(200).send(common_public)
    } else {
        if (profileId == "common_core") {
            return res.status(200).send(common_core)
        }
    }
});

app.get("/fortnite/api/calendar/v1/timeline", (req, res) => {
    return res.status(200).json({
        channels: {
            "client-matchmaking": {
                states: [],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            },
            "client-events": {
                states: [{
                    validFrom: "0001-01-01T00:00:00.000Z",
                    activeEvents: [],
                    state: {
                        activeStorefronts: [],
                        eventNamedWeights: {},
                        seasonNumber: 3.5,
                        matchXpBonusPoints: 0,
                        seasonBegin: "2020-01-01T00:00:00Z",
                        seasonEnd: "9999-01-01T00:00:00Z",
                        seasonDisplayedEnd: "9999-01-01T00:00:00Z",
                        weeklyStoreEnd: "9999-01-01T00:00:00Z",
                        stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                        stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                        sectionStoreEnds: {
                            Featured: "9999-01-01T00:00:00.000Z"
                        },
                        dailyStoreEnd: "9999-01-01T00:00:00Z"
                    }
                }],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString()
    });
});

app.get('/fortnite/api/storefront/v2/keychain', (req, res) => {
    return res.status(200).send(keychain);
});

app.get('/fortnite/api/storefront/v2/catalog', (req, res) => {
    return res.status(200).send([]);
});

app.get('/fortnite/api/receipts/v1/account/:accountId/receipts', (req, res) => {
    return res.status(200).send("Ok");
});

app.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (req, res) => {
    if (req.query.profileId == "common_core") {
        return res.status(200).send(common_core);
    } else {
        return res.status(200).send({
            status: "OK",
            code: 200
        })
    }
});

module.exports = app;
