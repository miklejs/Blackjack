import React, { Component } from 'react';
import axios from 'axios';
import '../custom.css';
import Alert from "./alert";
import auth from './auth' 
import Cookies from 'js-cookie';
import CookieConsent from "react-cookie-consent";



class Home extends Component {
 constructor(props){
   super(props);
   this.state = {
     email: "",
     password: "",
     showWarning: false,
     username: "",
     typeOfWarning: ""


   };
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleInput = this.handleInput.bind(this);
   this.handleRegister = this.handleRegister.bind(this);
   this.warnswitcher = this.warnswitcher.bind(this);
 }

  
  handleSubmit(event){
    event.preventDefault();
    //console.log('submitted');
    //console.log("Email: " + this.state.email, "Password: " + this.state.password);
    const email = this.state.email;
    const password = this.state.password;
    axios.post('/users/login', {email, password})
    .then(res => {   
        //console.log (res.data)
      if (res.data.success === true && res.data.err === false){
        this.setState({
          username: res.data.username
        })
        //console.log("username: ", this.state.username)
        //this.props.history.push('gametable') changed
        Cookies.set('username', this.state.username);        
        Cookies.set('auth', true);
        auth.login(() => {
          this.props.history.push('/startpage');
        });
      } else {
        if (res.data.success === false) {
            this.setState({
              showWarning: true,
              typeOfWarning: "Wrong email or password"
            });        
          }
                  
      } 
      
        //console.log(res.data)
        //console.log(this.state.typeOfWarning)
  });  
    

  }

  handleInput() {    
    //console.log('handleEmailChange');
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    this.setState({email:email, password:password}); 
    
     
      
  }

  handleRegister(){
    this.props.history.push('register')
  }

  warnswitcher(){
    this.setState({
      showWarning: false
    })
  }

 

  render() {
    
    
   
    
      
    
    
    return (
    
      
        <div className= "backgroundimage">      
          <div className="container" >           
            <div >
              <form onSubmit={(e)=> {this.handleSubmit(e); }} className="text-white">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"  ref="email" onChange={this.handleInput} required></input>
                  <small id="emailHelp" className="form-text">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"  ref="password" onChange={this.handleInput} required></input>
                </div>
                <div className = "buttonsOnLoginPage">
                  <button className="btn btn-primary buttonOnLogin1">Log in</button>
                  <button className="btn btn-success" onClick={() => {this.handleRegister();}}>Register</button> 
                </div>
                
                <div>{<Alert show = {this.state.showWarning} typeOfWarning = {this.state.typeOfWarning} warnswitcher = {this.warnswitcher}/>}</div>
                
              </form> 
              <CookieConsent >This website uses cookies to enhance the user experience.</CookieConsent> 
                             
            </div>          
          </div> 

          
        </div>





      
      
    );
  }
}

export default Home;