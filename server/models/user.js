let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    gamesPlayed: Number,
    winrate: Number,
    moneyGained: Number,
    moneyAmount: {type: Number, default:300},
    win: {type: Number, default: 0}
});

module.exports = userSchema;