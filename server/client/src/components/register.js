import React, { Component } from 'react';
import axios from 'axios';
import Alert from "./alert";


class Register extends Component {
 constructor(props){
   super(props);
   this.state = {
     email: "",
     password: "",
     confirmedPass: "",
     username:"",
     showWarning: false,
     typeOfWarning: ""
   };
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleInput = this.handleInput.bind(this);
   this.handleRegister = this.handleRegister.bind(this);
   this.warnswitcher = this.warnswitcher.bind(this);
 }

  

 handleSubmit(event){
  event.preventDefault();
  console.log('submitted');
  console.log("Email: " + this.state.email, "Password: " + this.state.password);
  const email = this.state.email;
  const password = this.state.password;
  const username = this.state.username;
  const confirmedPass = this.state.confirmedPass;
  if (password !== confirmedPass){
    this.setState({
      showWarning: true,
      typeOfWarning: "Passwords do not match"});
  } else {
    axios.post('/users/register', {email, password, username})
  .then(res => {    
    //console.log(res.data)    
      if(res.data.msg === 'user already exist') {
        this.setState({
          showWarning: true,
          typeOfWarning: "User already exist!"});
      } else {
        if(res.data.msg === 'email already exist'){
          this.setState({
            showWarning: true,
            typeOfWarning: "Email already exist!"});
        } else {
          if(res.data.msg === 'invalid email') {
            this.setState({
              showWarning: true,
              typeOfWarning: "Email not valid! Please use another one"});
          } else {
            if (res.data.success === true && res.data.err === false) {
              this.props.history.push('/')
            }
          }
          
        }        
      }
    });
  }
}


warnswitcher(){
  this.setState({
      showWarning: false,
      typeOfWarning: ""
  })
}

  handleRegister(){
    this.setState({
      showWarning: false
    })
  }

  handleInput() {        
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const username = this.refs.username.value; 
    const confirmedPass = this.refs.confirmedPass.value; 
    this.setState({email:email, password:password, username:username, confirmedPass:confirmedPass});
    
    
  }
  

  render() {    
    return (      
        <div className="backgroundimage">
          <div className="container">
            <div>
              <form onSubmit={this.handleSubmit} className="text-white">
                <div className="form-group">
                  <label htmlFor="exampleInputName1">Name</label>
                  <input type="text" className="form-control" id="exampleInputName1" minLength = "5" maxLength = "12" placeholder="Name" ref="username" onChange={this.handleInput} required></input>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.handleInput} required></input>
                  <small id="emailHelp" className="form-text">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref="password" onChange={this.handleInput} required></input>
                  
                </div> 
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Confirm Password</label>
                  <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Confirm Password" ref="confirmedPass" onChange={this.handleInput} required></input>
                  
                </div> 
                <button  className="btn btn-primary">Register</button>                 
              </form>
              <div>
              <Alert show = {this.state.showWarning} typeOfWarning = {this.state.typeOfWarning} warnswitcher={this.warnswitcher} />
              </div>
            </div>        
          </div>
          
        </div>        
      
      
    );
  }
}

export default Register;