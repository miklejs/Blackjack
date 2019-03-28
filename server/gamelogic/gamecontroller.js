const gameSettings = require('../gamelogic/settings');

let startGame = async function(gameData){
    let tempGame = gameData;
    try {
        tempGame.cardsInPull =  await cardsShuffle(tempGame.cardsInPull);
        console.log("game.userCards: ", typeof tempGame.userCards)
        tempGame.userCards.push(tempGame.cardsInPull.splice(0,1)[0]);
        tempGame.croupierCards.push(tempGame.cardsInPull.splice(0,1)[0]);
        tempGame.userCards.push(tempGame.cardsInPull.splice(0,1)[0]);
        tempGame.croupierCards.push(tempGame.cardsInPull.splice(0,1)[0]);
        //console.log('startGame game: ', tempGame);        
    } catch (error) {
        console.log(error);
    } 
    console.log("tempGame",tempGame.croupierCards)
    return tempGame   
}



let cardsShuffle = async function (array) {
    try {
        let currentIndex = array.length, temporaryValue, randomIndex;
        console.log("cardsShuffle currentIndex:  ", currentIndex)
        while(0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    } catch (error) {
        console.log(error);
    }
    //console.log("ggggggggggggggggggggggggggggggggggggggggggggggg   ",array);
    return array
   
}

let hitCard = async function(gameData){
    console.log("hitCard 1")
    let tempGame = gameData;
    try {
       
        if(!tempGame.cardsInPull){
            console.log("No cards in pull")
        } else {
            
            tempGame.userCards.push(tempGame.cardsInPull.splice(0,1)[0]);
        }
    } catch (error) {
        console.log(error);
        console.log("err in hitcard, location gamecontroller")
    }
    console.log("hitCard 2")
    return tempGame
}


let closeGame = async function(gameData) {
    let tempGame = gameData;
    try {
        tempGame.gameState = gameSettings.gameStates.closed;
        let croupierScore = await getScore(tempGame.croupierCards);
        console.log("croupierScore", croupierScore)        
        let userScore = await getScore(tempGame.userCards);
        console.log("userScore", userScore)
        while (croupierScore < 18) {
            tempGame.croupierCards.push(tempGame.cardsInPull.splice(0,1)[0]);
            croupierScore = await getScore(tempGame.croupierCards, false);
        }
        if(userScore === 21){
            tempGame.moneyAmount = tempGame.bet * 2.5;
        } else {
            tempGame.moneyAmount = tempGame.bet * 2;
        }
        let finishScore = await calculatedScore(croupierScore, userScore);
            if (finishScore === userScore) {
                tempGame.winner = 'user';
            } else {
                tempGame.winner = "casino";
            } if (finishScore === userScore && finishScore === croupierScore) {
                tempGame.winner = "draw"
            }
            tempGame.userScore = userScore;
            tempGame.croupierScore = croupierScore;
            
    } catch (error) {
        console.log(error)
    }
    return tempGame;
}


let getScore = async function(cards){
    //console.log("CARDS: ", cards)
    let score = 0;
    let calc = false;
    let count = 0;    
    cards.map((card)=>{        
        if (card.name.indexOf("_a") != -1){            
            count++;
            calc = true;          
        }      
        score += card.value;      
    }); 
    if(calc) {           
        return calculatedScore(score, score-(10*count));
    } else {
        return score;
    }
}


let calculatedScore = async function(possibleScore, score){
    if (possibleScore > 21 && score > 21){
        return Math.min(possibleScore, score);
    }
    if (possibleScore <=21 && score > 21){
        return possibleScore;
    }
    if (possibleScore <= 21 && score <=21){
        return Math.max(possibleScore, score);
    }
    if (possibleScore > 21 && score <=21){
        return score;
    }
}



module.exports = {startGame, hitCard, closeGame};