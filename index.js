const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const bp = require('body-parser');



const PORT = process.env.PORT || 3551;

const DB_URI = process.env.DB_URI || "mongodb://localhost/Axis";

app.listen(PORT, async() => {
    console.log("Axis Backend listening on port " + PORT);
    console.log("Made with effort from @optixyt <3");
    await connectDB();
    require('./api/api.js');

});

app.use(express.json());
app.use(bp.urlencoded({ extended: true }));
fs.readdirSync("./routes").forEach(fileName => {
    app.use(require(`./routes/${fileName}`));
});

async function connectDB() {
    try {
        await mongoose.connect(DB_URI)
        console.log("Connected to MongoDB!")
    } catch(err) {
        console.log("Failed to connect to MongoDB: " + err)
    }
    
}


app.get('/', (req, res) => {
    res.json({ name: "Axis Backend", creator: "OptiX YT" });
});

app.use((req, res, next) => {
    res.status(404).json({ errorCode: "com.axis.backend.route-undefined", errorMessage: "No route was found." });
    console.log("Unknown route hit: [" + req.method + "] " + req.url);
});
