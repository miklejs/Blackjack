const mongoose = require('mongoose');
const userModel = require('../../server/models/user');
const gameModel = require('../../server/models/game');
const bcrypt = require('bcrypt');
const gameSettings = require('../gamelogic/settings');
const gameController = require('../gamelogic/gamecontroller');
const dbConnection = require('../config');

const dbURI = dbConnection.URI;


const saltRounds = 10;

mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(){
    console.log('Mongoose connection error: ' + dbURI);
  });
  
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
  });
  
 
const user = mongoose.model('users', userModel);
const game = mongoose.model('games', gameModel);

/* let newUser = new user ({username: "mikle"});
newUser.save(function(err){
  if(err) console.log(err);
  console.log ("success");
}); */


let createNewUser = async function (userData) {
  let userSpec = {};
  let returnObj = {};

  try {    
    userSpec.username = userData.username;
    userSpec.email = userData.email;   
    userSpec.password = userData.password;
    console.log("createNewUser.password: ", userSpec.password)
    let newUser = new user(userSpec);
    let saveUser = await newUser.save();
      if(saveUser) {
        returnObj.err = false;
        returnObj.msg = "Creating new user successful";  
      }   
    
  } catch (err) {
    returnObj.err = true;
    returnObj.msg = "Error during saving user to database";
    console.log(err);    
  };  
 
  return returnObj

};

let findByUsername = async function (userData) {
  let returnObj = {}; 
  try {    
    if(userData) {
      console.log('username', userData.username)
      let findBy = {};
      findBy.username = userData.username;
      //password 
      await user.findOne(findBy, {_id:0 ,username:1, moneyAmount:1, email:1}, async function (err, user){
        console.log("!!!!!!!!! ",user);
        if (err) {
          console.log(err);
          returnObj.err = true;
          //console.log('1: ',returnObj);
          
        } else {
          if (user) {
            returnObj.err = false;
            returnObj.user = user;
            returnObj.findBy = userData.username;
            //console.log('2: ',returnObj);
            
          } else {
            returnObj.err = false;
            returnObj.user = null;
            //console.log('3: ',returnObj);
            
          }
        }
      })
    }
  } catch (error) {
    console.log(error);
    returnObj.err = true;
    console.log('returnObj in catch of findByUsername', returnObj)

    return returnObj;
  }  
  console.log('returnObj in return of findByUsername', returnObj)

  return returnObj;
  
}




let findByEmail = async function (userData) { 
  let returnObj = {}; 
  try {    
    if(userData) {
      let findBy = {};
      findBy.email = userData.email;
      console.log("Email in findByEmail search ",findBy)
      await user.findOne(findBy, {_id:0 ,username:1, moneyAmount:1, email:1, password:1}, function (err, user){
        if (err) {
          console.log(err);
          returnObj.err = true;
          //console.log('1: ',returnObj);
          
        } else {
          if (user) {
            returnObj.err = false;
            returnObj.user = user;
            returnObj.findBy = userData.email;
            //console.log('2: ',returnObj);
            
          } else {
            returnObj.err = false;
            returnObj.user = null;
            //console.log('3: ',returnObj);
            
          }
        }
      })
    }
  } catch (error) {
    console.log(error);
    returnObj.err = true;
    console.log('returnObj in catch of FindByEmail', returnObj)

    return returnObj;
  }  
  console.log('returnObj in return of FindByEmail')

  return returnObj;
}


let checkLogin = async function (userData) {
  let returnObj = {};
  try {
    console.log('Checking login in progress... ');    
    returnObj.success = false;
    returnObj.err = false;
    let userObj = await findByEmail(userData);
    console.log('findByEmail ', userObj);
    if (userObj.user === null || userObj.err) {      
      returnObj.msg = "no such email in our database";
        if (userModel.err) {
          returnObj.msg = "internal server error";
          returnObj.err = true;
        }
    } else {      
      const match = await bcrypt.compare(userData.password, userObj.user.password);
        if (match) {          
          returnObj.success = true;
          returnObj.err = false;
          returnObj.username = userObj.user.username;          
        } else {
          returnObj.msg = 'wrong password';
        }
    }
  } catch (error) {
    console.log("Error in checkLogin(db.js): ",error);
    returnObj.err = true;
    return returnObj;
  }
  console.log('checkLogin: ', returnObj);
  return returnObj;
}

let checkRegister = async function(userData){
  console.log('Checking registration...');
  console.log('USER_DATA: ', userData);
  let returnObj = {};  
  try {
    returnObj.success = false;
    returnObj.err = false;
    returnObj.msg = '';
    let userObj = await findByUsername(userData);
    //console.log("userObj in findByUsername function ", userObj);    
    if (userObj.user != null || userObj.err) {     
      if (userObj.err) {
        returnObj.msg = "internal server error";
        returnObj.err = true;        
      } else {        
        returnObj.success = false;
        returnObj.msg = 'user already exist';  
        console.log("user already exist", returnObj)      
      }
    }    
     
       if (returnObj.msg === 'user already exist') {
        console.log("user already exist")
       } else {
         let userObjEmail = await findByEmail(userData);         
         if (userObjEmail.user === null || userObjEmail.err) 
         {
            if (userObjEmail.err) {
              returnObj.err = true;
              returnObj.msg = 'internal error'
            } else {
              const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(userData.password, saltRounds, function(err, hash) {
                  if (err) reject(err)
                  resolve(hash)
                });
              });  
              userData.password = hashedPassword;
              let reg = await createNewUser(userData);              
              if (reg.msg === 'Creating new user successful'){
                returnObj.success = true;
                returnObj.msg = 'register done';
                returnObj.username = userData.username;
              }                                             
            }            
         } else {
          returnObj.success = false;
          returnObj.msg = 'email already exist';
          return returnObj;
         }  
       }     
  } catch (error) {
    console.log("Error in checkRegister (db.js): ",error);
    returnObj.err = true;
    returnObj.msg = 'internal error';
    return returnObj;
  }
  console.log("in the end of register check  ",returnObj);
  return returnObj;
}


let getUser = async function(username) {
  let findBy = {};
  let find;
  try {
    if (username) {
      findBy.username = username;
    }
    find = await user.find(findBy, 'username password moneyAmount moneyGained winrate gamesPlayed win', function (err, user){
      if(err){
        console.log(err)
      }
      return user
    })
  } catch (error) {
    console.log("Error in getUser (db.js): ",error);
    
  }
  //console.log("User in getUser function ", find);
  return find
}

let getCurrentGame = async function(userData){
  console.log("getCurrentGame ", userData.username)
  let returnObj = {};
  try {
    if(!user) {
      returnObj.err = 'no user parameter';
    }
    await game.findOne({gameState: gameSettings.gameStates.created, username: userData.username}, 'title gameState userCards date croupierCards bet', function (err, game){
      if(err){
        console.log(err);
        returnObj.err = true
      } else {
        if(game) {
          returnObj.err = false;
          returnObj.game = game;
          if(returnObj.game.croupierCards) {
            //console.log("returnObj.game.croupierCards in getCurrentGame: ", returnObj.game.croupierCards)
            returnObj.game.croupierCards = returnObj.game.croupierCards.slice(0, (returnObj.game.croupierCards.length -1));

          }
        } else {
          returnObj.err = false;
          returnObj.game = null;
        }
      }
    })
  } catch (error) {
    console.log("Error in getCurrentGame (db.js): ",error);
    returnObj.err == true;
  }
  console.log("getCurrentGame in db ", returnObj)
  return returnObj;
}

let createNewGame = async function(userData){  
  let returnObj = {};
  let createGameObj = {};
  
  try {
    returnObj.err = false;
    let currentGame = await getCurrentGame(userData);
    console.log("AAAAAAAAAAAAAAAAAAAAAA ",userData);
    if (currentGame.game) {
      console.log("currentGame! ")
      return currentGame;
    } else {
      let gtUser = await getUser(userData.username);
      //console.log("gtUser  ", gtUser[0].moneyAmount)
      if (gtUser[0].moneyAmount < userData.moneyAmount) {
        returnObj.msg = "Lack of money"
        returnObj.err = true;
      }
      
      createGameObj.username = userData.username;
      createGameObj.cardsInPull = gameSettings.cards.slice(0);
      createGameObj.gameState = gameSettings.gameStates.created;
      console.log('createGameObj.gameState', createGameObj.gameState)
      createGameObj.userCards = [];
      createGameObj.croupierCards = [];
      createGameObj.bet = userData.moneyAmount;
      createGameObj = await gameController.startGame(createGameObj);
      let newGame = new game(createGameObj);
      let newSavedGame = await newGame.save();
      //console.log('newSavedGame ', newSavedGame)
        if(!newSavedGame) {
          returnObj.err = true;
        } else {
          returnObj.game = newSavedGame;
              if (returnObj.game.croupierCards) {
                returnObj.game.croupierCards = returnObj.game.croupierCards.slice(0, (returnObj.game.croupierCards.length - 1))[0];
              }
            let filter = { username: userData.username },
            update = { $inc: { moneyAmount: -returnObj.game.bet }};            
            //console.log(filter);
            //console.log("game.bet:   ",returnObj.game.bet); 
            let upd = await user.updateMany(filter, update);
            if (upd){
              let user = await getUser(userData.username);
              console.log("User in the end of createNewGame",user[0]);
              //console.log("jjjjjjjjjjjj",user);
            }
        }     
    }
  } catch (error) {
    console.log("Error in createNewGame (db.js): ",error);
    returnObj.err = true;

  }
  //console.log('returnObj',returnObj);
  return returnObj;
}

let getGame = async function(id){  
  let returnObj;
  try {
    let findBy = {};
    if (id) {
      findBy._id = id;
    }
    let findGame = await game.find(findBy);
    if(!findGame) {
      console.log("Error during getGame")
    } else {
      returnObj = findGame
    }
    
  } catch (error) {
    console.log("Error in getGame (db.js): ",error);
  }
  return returnObj
}



let getCard = async function(data){
  let id = {_id: data._id}
  console.log("data._id", id)
  let returnObj = {};
  try {
    let findGame = await getGame(id);
    
    
      if (findGame[0].gameState != gameSettings.gameStates.created){
        console.log("getGame: ", findGame[0].gameState != gameSettings.gameStates.created);
        returnObj.err = true;
      }
      //console.log("findGame[0]", findGame[0])
      console.log("hitCard 3")
      let updGame = await gameController.hitCard(findGame[0]);
      
      //console.log("updGame  ",updGame)
      let updUser = game.updateOne(id, updGame, function(err, user){
        console.log("upd",user)
      });
      console.log("hitCard 4")
      console.log("upd",updUser[0])
      console.log("sdfsdfsdfdsff")
      
        if(!updUser) {
          console.log(updUser)
        }
        let updated = await getGame(id);
        //console.log("updated", updated[0])
        returnObj.game = updated[0];        
        if (returnObj.game.croupierCards){
          returnObj.game.croupierCards = returnObj.game.croupierCards.slice(0, (returnObj.game.croupierCards.length - 1))[0];
        }
  } catch (error) {
    console.log("Error in getCard (db.js): ",error);
    returnObj.err = true;
  }
  //console.log("QQQQQQQQQQQQ",returnObj.game[0])
  return returnObj;
}

let updateUser = async function(gameData){
  let username = gameData.username;
  let moneyAmount = gameData.moneyAmount;
  let bet = gameData.bet;
  let winner = gameData.winner;
  console.log("winner ", winner)
  try {
    let getFromDb = await getUser(username);
    let newUser = getFromDb[0];
    if(!newUser.gamesPlayed){
      newUser.gamesPlayed = 1;
      newUser.moneyGained = 0;
      newUser.winrate = 0;
      newUser.win = 0;
    } else {
      newUser.gamesPlayed++;
    }
    if (winner == "user"){
     
      newUser.win++;
      newUser.moneyAmount += moneyAmount;
      newUser.moneyGained += moneyAmount;
    }
    if(winner == "draw"){
      newUser.moneyAmount += bet;
    }
    newUser.winrate = Math.floor(newUser.win/newUser.gamesPlayed * 100);
    let update = newUser;    
    
    let updater = await user.updateOne({username: newUser.username}, update, function(err, user){
      if (err){
        console.log(err);
      }
    });
    let updatedUser = await getUser(username);
    console.log("updatedUser", updatedUser[0])
    
  } catch (error) {
    console.log("Error in updateUser in (db.js): ",error)
  }

}

let stand = async function(data){
  let returnObj = {};
  let id = {_id: data._id}
  try {
    let findGame = await getGame(id, function(err){
      console.log(err)
    });
  

    if(findGame[0].gameState != gameSettings.gameStates.created) {
      returnObj.game = null;
    }
    let closeGame = await gameController.closeGame(findGame[0]);
   
    let updUser = game.updateOne(id, closeGame, function(err, user){
      if(err){
        console.log(err);
      }
    });
    let updated = await getGame(id);
    
    returnObj.game = updated[0]; 
    //console.log("SUPER", returnObj.game)
    await updateUser(returnObj.game)
    
  } catch (error) {
    console.log("Error in stand function in (db.js): ",error);
    returnObj.game = null;
  }
  return returnObj
}

let getLastGame = async function(user){
  let returnObj = {};
  try {
    if(!user){
      returnObj.err="No user data"
    }
    await game.find({gameState: gameSettings.gameStates.closed, username: user.username}, function(err, game){
      if(err) {
        console.log("Error in game.find in getLastGame", err)
        returnObj.err = true;        
      } else {
        if (game){
          returnObj.err = false;
          returnObj.game = game;          
        } else {
          returnObj.err = false;
          returnObj.game = null;
        }
      }
    });
    
    
  } catch (error) {
    console.log("Error in getLastGame in (db.js): ", error)
  }
  console.log("returnObj", returnObj)
  return returnObj;
}


let getAllUsers = async function(sortObj){
  let returnObj={};
  let find={};
  try {
    let allUsers = await user.find(find, 'username moneyAmount moneyGained winrate gamesPlayed', {sort: sortObj});
    console.log("allUsers: ", allUsers)
    if(!allUsers){
      returnObj.err = true;
    } else {
      if(allUsers){
        returnObj.err = false;
        returnObj.users = allUsers;
      } else {
        returnObj.err = false;
        returnObj.users = null
      }
    }
    
  } catch (error) {
    console.log("Error in getTopUsers in DB ", error)
  }
  console.log("returnObj in getTopUsers in DB ", returnObj)
  return returnObj;
}

let getTopUsers = async function(conditions){
  let returnObj={};
  try {
    let topUsers = await getAllUsers(conditions);
    if(!topUsers) {
      returnObj.err = true
    } else {
      if(topUsers) {
        returnObj.err = false;
        returnObj.users = topUsers.users.slice(0, 10)
      } else {
        returnObj.err = false
        returnObj.users = null
      }
    }
    
  } catch (error) {
    console.log("Error in getAllUsers in (db.js): ", error)
  }
  return returnObj
}





module.exports = {checkLogin, checkRegister, createNewGame, getCard, stand, getLastGame, findByUsername, getCurrentGame, getTopUsers};



