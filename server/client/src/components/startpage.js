import React, { Component } from 'react';
import axios from 'axios';
import '../custom.css';
import auth from './auth' 




class StartPage extends Component {
 constructor(props){
   super(props);
   this.state = {
    topMoneyUsers: [],
    topGamesPlayedUsers: [],
    topInWinrateUsers: [],

    


   };
   this.handleStartGame = this.handleStartGame.bind(this);
   this.handleLogOut = this.handleLogOut.bind(this);
 }

 componentDidMount() {  
   let money = "-moneyGained";
   let winrate = "-winrate";
   let gamesPlayed = "-gamesPlayed"

    axios.post("/users/getTopUsers", money)
      .then(res => {        
        this.setState({
          topMoneyUsers: res.data.users              
        });        
      });

      axios.post("/users/getTopUsers", winrate)
      .then(res => {        
        this.setState({
          topInWinrateUsers: res.data.users              
        });        
      });

      axios.post("/users/getTopUsers", gamesPlayed)
      .then(res => {        
        this.setState({
          topGamesPlayedUsers: res.data.users              
        });        
      });

  };
 


 handleStartGame(){

     auth.login(() => {
        this.props.history.push('/gametable');
      }); 
 }

 handleLogOut() {
    auth.logout(() => {
        this.props.history.push('/');
      });
}
  


  render() {
    let topMoney = this.state.topMoneyUsers.map((user, id)=>{
      return <tr key={id}>
      <th scope="row">{id+1}</th>
      <td>{user.username}</td>
      <td>{user.moneyGained || 0}</td>
      </tr>      
    }); 

    let games = this.state.topGamesPlayedUsers.map((user, id)=>{
      return <tr key={id}>
      <th scope="row">{id+1}</th>
      <td>{user.username}</td>
      <td>{user.gamesPlayed || 0}</td>
      </tr>      
    }); 

    let winrate = this.state.topInWinrateUsers.map((user, id)=>{
      return <tr key={id}>
      <th scope="row">{id+1}</th>
      <td>{user.username}</td>
      <td>{user.winrate || 0}%</td>
      </tr>      
    }); 
    
   
    
      
    
    
    return (
      
    
      
        <div className= "backgroundimage">      
          <div className="container-fluid" >           
            <div className = "btnOnStartPage row">

            <button className=" start1 btn btn-danger" onClick={this.handleStartGame}>Go to gametable</button>
            <button className=" start2 btn btn-primary" onClick={this.handleLogOut}>Log out</button>
             
                             
            </div >  
            <div className="row">
            <h1 className='col head  justify-content-center'>TOP PLAYERS:</h1>
            
            
            </div>
            
            <div className = "tables row">            
            <table className="table1 table-sm table-dark col table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Money Gained</th>                 
                </tr>
              </thead>
              <tbody>                
                {topMoney}                
              </tbody>
            </table>

            <table className="col table2 table-sm table-dark table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Games played</th>                 
                </tr>
              </thead>
              <tbody>
                {games}                
              </tbody>
            </table>

            <table className="table3 table-sm table-dark col table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Winrate</th>                 
                </tr>
              </thead>
              <tbody>
                {winrate}                
              </tbody>
            </table>
            </div>
            
                      
          </div>           
        </div>    
      
    );
  }
}

export default StartPage;