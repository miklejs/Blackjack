let mongoose = require('mongoose');
let gameSchema = new mongoose.Schema({
    title:  {type: String, default: 'default game'},
    username: String,
    moneyAmount: Number,
    cardsInPull: [{ name: String, value: Number}],
    gameState: Number,
    userCards: [{ name: String, value: Number}],
    croupierCards: [{ name: String, value: Number}],
    date: { type: Date, default: Date.now },
    winner: String,
    bet: Number,
    userScore: Number,
    croupierScore: Number

});

module.exports = gameSchema;