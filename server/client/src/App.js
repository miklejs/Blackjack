import React, { Component } from 'react';
import './custom.css';
import '../gameTable.css';


class App extends Component {
 constructor(props){
   super(props);
   this.state = {
     email: "",
     password: ""
   };
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleInput = this.handleInput.bind(this);
   this.handleRegister = this.handleRegister.bind(this);
 }

  
  handleSubmit(event){
    event.preventDefault();
    console.log('submitted');
    console.log("Email: " + this.state.email, "Password: " + this.state.password);

  }

  handleInput() {    
    console.log('handleEmailChange');
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    this.setState({email:email, password:password});    
  }

  handleRegister(){
    this.props.history.push('register')
  }

  render() {
    return (
      <body className="homescreen">
        <div className= "backgroundimage">      
          <div className="container" >           
            <div >
              <form onSubmit={this.handleSubmit} className="text-white">
                <div className="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.handleInput}></input>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref="password" onChange={this.handleInput}></input>
                </div>
                <button className="btn btn-primary">Log in</button>
                <button className="btn btn-secondary" onClick={this.handleRegister}>Register</button>    
              </form>  
                             
            </div>          
          </div>       
        </div>

      </body>
      
    );
  }
}

export default App;