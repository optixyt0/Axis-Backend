const contentpages = require("../responses/contentpages.json");
const express = require("express");
const app = express.Router();

app.get("/content/api/pages/fortnite-game", (req, res) => {
    res.status(200).send(contentpages);
});

module.exports = app;