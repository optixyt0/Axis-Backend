const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3551;

const DB_URI = process.env.DB_URI || "mongodb://localhost/Axis";

app.listen(PORT, () => {
    console.log("Axis Backend listening on port " + PORT);
    console.log("Made with effort from @optixyt <3");
    connectDB();
});

function connectDB() {
    const conn = mongoose.createConnection(DB_URI);

    conn.on('connected', () => console.log('Connected to MongoDB!'));
    conn.on('disconnected', () => console.log('Disconnected from MongoDB.'));
}

app.use((req, res, next) => {
    res.status(404).json({ errorCode: "com.axis.backend.route-undefined", errorMessage: "No route was found.", numericErrorCode: "1004" });
});
