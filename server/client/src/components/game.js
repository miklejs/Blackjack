import React, { Component } from 'react';
import axios from 'axios';
import '../gameTable.css';
import auth from './auth' 
import Cookies from 'js-cookie';
import UserCards from "./cards";
import Chips from "./chips";
import Alert from "./alert";
import CroupierCards from "./croupierCards"




class Game extends Component {
    constructor(props) {
       super(props);
        this.state = {
            
            username: Cookies.get('username'),
            password: Cookies.get('password'),
            loginned: Cookies.get('auth'),
            showWarning: false,
            typeOfWarning: "",
            betSize: 0,
            moneyAmount: 0,
            userScore: 0,
            currentGame: {},
            isLive: false,            
            showNewGameBtn: true,
            currentScore: 0,
            croupierScore: 0,
            possibleScore: {value:0, active: false},
            croupierCards: [],
            userCards: [],
            lastGame: false,
            isLoginned: false,

        } 
        
        
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleHomePage = this.handleHomePage.bind(this);        
        this.handleNewGame = this.handleNewGame.bind(this);
        this.handleHitBtn = this.handleHitBtn.bind(this);
        this.handlePlaceBetBtn = this.handlePlaceBetBtn.bind(this);
        this.handleClearBetBtn = this.handleClearBetBtn.bind(this);
        this.handleStandBtn = this.handleStandBtn.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.warnswitcher = this.warnswitcher.bind(this);
        this.updateUserData = this.updateUserData.bind(this);
        this.getActiveGame = this.getActiveGame.bind(this);
        this.handleBet = this.handleBet.bind(this);


       

        
    }


    async componentDidMount () {
     if (!this.state.username || !this.state.password || !this.state.loginned){
         await this.setState({
            isLoginned: false
         })
     } else {
        await this.updateUserData();
     }
    
    }

 
    async handleNewGame(e){
        if(this.state.isLive === true){
            await this.setState({
                showWarning: true,
                typeOfWarning: "You must finish this game before start another!"
            }, async function(){
                
                    this.setState({
                        showWarning: true
                    })
                
            });
        } else {
            
            if (this.state.betSize > 0 ){
                let username = this.state.username;
                let moneyAmount = this.state.betSize;

                
                axios.post('/users/newgame', {username, moneyAmount})
                .then(res => {

                    //console.log("resdata",res.data.game);
                    //console.log("card",res.data.game.croupierCards);
                    //console.log("usercard",res.data.game.userCards);
                
                    
                    this.setState({
                        userScore: 0,
                        croupierScore: 0,
                        currentGame: res.data.game,                
                        showNewGameBtn: false,          
                    }, async function(e) {                
                        await this.updateTable(res.data)
                            
                        });          
                    });
        
            } else {            
                await this.setState({
                    showWarning: true,
                    typeOfWarning: "You must make bet to start game."
                });
            }
        }        
    }

    

    async updateTable (gameData, handler) {
        if (!gameData) {
            if(gameData.msg === "Lack of money") {
                await this.setState({
                    showWarning: true,
                    typeOfWarning: "You have no money."
                });
            }
            
        }
        if (!handler){
            let backCard = {
                name: "back"
            }
           
            await this.setState({
                isLive: true,
                possibleScore: {...this.state.possibleScore, value:0,},            
                currentScore:0,
                croupierCards: gameData.game.croupierCards,
                betSize: gameData.game.bet,
                userCards: gameData.game.userCards,
    
            }, await async function() {
                
                 gameData.game.userCards.map((card)=>{
                    let psbl = this.state.possibleScore.value += card.value;
                    let crnt = this.state.currentScore +=card.value;
                   
                    this.setState({
                        possibleScore: {...this.state.possibleScore, value:psbl},
                        currentScore: crnt,
                        croupierCards: [...this.state.croupierCards, backCard],
                    });
                    if(card.name.indexOf("_a") !== -1){
                        let psbl = this.state.possibleScore.value -= 10;
                        let psblActive = true;
                        this.setState({
                            possibleScore:{...this.state.possibleScore, value:psbl, active:psblActive}
                            
                        });
                    }
                    return null;
                });
                    if(this.state.currentScore === 21 || this.state.possibleScore === 21) {
                        //console.log("BLACKJACK!")                        
                        await this.setState({
                            showWarning: true,
                            typeOfWarning: "BLACKJACK"
                        });
                    }             
            });           
            
            //console.log("possibleScore", this.state.possibleScore)
            //console.log("currentScore", this.state.currentScore) 
            //console.log("croupierCards", this.state.croupierCards)
        } else{            
            this.setState({
                betSize: 0,
                croupierCards: gameData.game.croupierCards,
                croupierScore: gameData.game.croupierScore,
                showWarning: true,
                typeOfWarning: gameData.game.winner,
                userScore: gameData.game.userScore,
                
            })
        }        
       
    }

   
   

    handleLogOut() {
        auth.logout(() => {
            this.props.history.push('/');
          });
    }

    handleHomePage() {
        auth.login(() => {
            this.props.history.push('/startpage');
          });
    }

    async handleBet(e){
       let input = parseInt(e.target.value);      

       await this.setState({
           betSize:this.state.betSize + input
       })
       //console.log(input)
       //console.log(this.state.betSize)
    }


    async updateUserData (){
        let data = {
            username: this.state.username
        };
        
        //console.log("data in updateUserData", data)
        try {
            let res = await axios.post("/users/getUserData", data);
            
                //console.log("response in updateUserData: ",res.data)
                if(res.data.user === null){
                    this.setState({
                        isLoginned: false
                    });
                } else {
                    await this.setState({
                        isLoginned: true,
                        moneyAmount: res.data.user.moneyAmount
                        
                    }, async function(){
                        await this.getActiveGame();
                    })
                }
                
            
        } catch (error) {
            console.log("Error in updateUserData ", error)
        }        
    }

    async getActiveGame() {
        let data = {
            username: this.state.username
        };
        try {
            let res = await axios.post("/users/getCurrentGame", data);
                
                    //console.log("response in getActiveGame: ",res.data)
                    if(res.data.game === null) {
                        this.setState({
                            showNewGameBtn: true
                        });
                    } else {
                        await this.setState({
                            currentGame: res.data.game,
                            isLive: true,
                            showNewGameBtn: false,
                            betSize: res.data.game.moneyAmount                            
                        }, async function(){
                            await this.updateTable(res.data, false)
                        })
                    }
                
        } catch (error) {
            console.log("Error in getActiveGame: ",error)            
        }
    }


    async handleHitBtn(){        
        let userId = {...this.state.currentGame}
        //console.log("userId", userId);
        try {
            if(!this.state.isLive || !this.state.currentGame) {
                await this.setState({
                    showWarning: true,
                    typeOfWarning: "Press Start New Game"
                });
            }
            if(this.state.currentScore >= 21 && this.state.possibleScore.value >=21) {
                //console.log("Over")                
               await this.setState({
                    showWarning: true,
                    typeOfWarning: "Bust"
                });
               // console.log("showWarning",this.state.showWarning, this.state.typeOfWarning)
            } else {
                let res = await axios.post("/users/getcard", userId);          
                //console.log("response in getcard: ", res.data)
                if (res.data.game == null) {
                    await this.setState({
                        showNewGameBtn: true
                    })
                } else {
                    await this.setState({
                        currentGame: res.data.game,
                    }, await async function(){
                        this.updateTable(res.data, false)
                    })
                }};             
        } catch (error) {
            console.log("Error in Hit Button (handleHitBtn)", error)
        }                 
        //console.log("currentGame", this.state.currentGame);          
    }

    async handlePlaceBetBtn(){
        try {
            if(this.state.betSize > this.state.moneyAmount){
                await this.setState({
                    showWarning: true,
                    typeOfWarning: "The bet is more than yours Amount, please change bet size."
                });
            } else {
                await this.handleNewGame();
            } 
        } catch (error) {
            console.log("error in Place Bet button (handlePlaceBetBtn)", error)
        }
        
       
       
        

    }

    async handleClearBetBtn(){
        if(this.state.isLive === false) {
        await this.setState({
            betSize: 0
        });
    }
    }

    async handleStandBtn(){
        try {
            if(!this.state.isLive || !this.state.currentGame) {
                await this.setState({
                    showWarning: true,
                    typeOfWarning: "Press Start New Game"
                })
            } else {
                let userId = {...this.state.currentGame}
                let res = await axios.post("users/stand", userId);
                await this.updateUserData();
                //console.log("response in stand: ", res.data)
                 await this.setState({
                     isLive:false,                                          
                 }, async function() {
                    await this.updateTable(res.data, true)
                 });
            }
        } catch (error) {
            console.log("Error in Stand button (handleStandBtn)", error)
        }
    }

    warnswitcher(){
        this.setState({
            showWarning: false,
            typeOfWarning: ""
        })
    }



    

    render () {
        

        return (
            <div>
                <div className = "gametable ">
                <div className = "container-fluid">
                <div className = "mainButtons row">
                    <div className = "col-sm">
                        <button className=" LogOut btn btn-danger" onClick={this.handleLogOut}>Log out</button>
                        <button className="HomePage btn btn-light" onClick={this.handleHomePage}>Back to Homepage</button>
                        
                    </div>
                    
                    <h1 className = "userName col">Hello {this.state.username}</h1>
                    </div>                    
                    <div className = "cards text-center">
                        <div className="row croupierCards .flex-column">
                            <CroupierCards croupierCards = {this.state.croupierCards}/>
                        </div>
                        <div>
                        <button className=" gameBtn btn" onClick={(e)=>{this.handleNewGame(e);}}>Start new game</button>
                        </div>
                        <div className="row userCards .flex-column">
                            <UserCards userCards = {this.state.userCards}/>
                        </div>                       
                        
                    </div>
                    <div className = " gamebuttons  text-center">
                        <button className="Placebet btn btn-success " onClick={this.handlePlaceBetBtn}>Place bet</button>
                        <button className="Clearbet btn btn-info " onClick={this.handleClearBetBtn}>Clear bet</button>
                        <button className="Hit btn btn-danger " onClick={this.handleHitBtn}>Hit</button>
                        <button className="Stand btn btn-warning " onClick={this.handleStandBtn}>Stand</button>
                    </div>
                    <div className = "chips text-center row">
                        <Chips check={this.handleBet}/>
                        <div >
                    <table className="gameStat table table-sm table-dark table-bordered .flex-column">
                        <thead>
                            <tr>                            
                            <th scope="col">Username</th>
                            <th scope="col">Money Amount</th>
                            <th scope="col">Bet</th>
                            <th scope="col">Player Score</th>
                            <th scope="col">Player Possible Score</th>
                            <th scope="col">Croupier Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>                            
                            <td>{this.state.username}</td>
                            <td>{this.state.moneyAmount}</td>
                            <td>{this.state.betSize}</td>
                            <td>{this.state.userScore}</td>
                            <td>{this.state.possibleScore.value}</td>
                            <td>{this.state.croupierScore}</td>
                            
                            </tr>                            
                        </tbody>
                        </table>
                    </div>
                    </div>
                    
                    <div>
                        <Alert show = {this.state.showWarning} typeOfWarning = {this.state.typeOfWarning} warnswitcher={this.warnswitcher} />
                    </div>
                </div>
                    
               

                    
                </div>
            </div>
        )        
    }
}


export default Game;