const express = require('express');
const path = require('path');
const router = express.Router();
const Isemail = require('isemail');
const dbController = require('../models/db');






router.post('/', async function(req, res, next) {
  console.log(req.body.email, req.body.password, req.body.name )
  console.log('fetching user');
  

  

  
});


router.post('/login', async function (req, res) {
  
  try {
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.checkLogin(req.body).then(function(data) {
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during login proccess')
  }

 
});


router.post('/register', async function (req, res) {  
  try {
    if(Isemail.validate(req.body.email)){
        console.log("Email OK !")
        dbController.checkRegister(req.body).then(function(data) {
          console.log('data in post /register', data)
          res.json(data);
        }).catch (function (data) {
          res.json(data);
        })
    } else {
      let returnData = {
        success: false,
        msg: "invalid email"
      }
      res.json(returnData)
    }
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    
  } catch (error) {
    console.log(error);
    console.log('Error during login proccess')
  } 
});

router.post('/newgame', async function (req, res) {  
  console.log('newgame req; ',req.body)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.createNewGame(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during creating new game')
  } 
});


router.post('/getcard', async function (req, res) {  
  console.log('getcard req; ',req.body._id)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.getCard(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during getCard')
  } 
});

router.post('/stand', async function (req, res) {  
  console.log('getcard req; ',req.body._id)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.stand(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during getCard')
  } 
});

router.post('/getUserData', async function (req, res) {  
  console.log('getUserData req; ',req.body)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.findByUsername(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during findByUsername')
  } 
});

router.post('/getCurrentGame', async function (req, res) {  
  console.log('getCurrentGame req; ',req.body)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.getCurrentGame(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during getCurrentGame')
  } 
});


router.post('/getTopUsers', async function (req, res) {  
  console.log('getTopUsers req; ',req.body)
  try {
    
    //console.log('Email: '+ req.body.email, 'Password: '+req.body.password)
    dbController.getTopUsers(req.body).then(function(data) {
      //console.log('data in post /newgame', data)
      res.json(data);
    }).catch (function (data) {
      res.json(data);
    })
  } catch (error) {
    console.log(error);
    console.log('Error during getTopUsers')
  } 
});






module.exports = router;

