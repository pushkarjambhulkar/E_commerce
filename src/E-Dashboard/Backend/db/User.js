const express = require("express");
// Importing mongoose from config file
const mongoose = require("mongoose")

const app = express();


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Create a model for the users collection
const User= mongoose.model("users", userSchema);
module.exports = User;