import React, { Component } from 'react';
import '../gameTable.css';

class Chips extends Component {
    constructor(props){
        super(props);
        this.state={
           

        }
        this.f = this.f.bind(this);
    }

    f(e){
        //console.log(e.target.value)
        this.props.check()
    }

    render() {         
        
       
       
        return(
            <div>
                <div className = "container">
                    <div>
                    <button className = "chip5" value="5" onClick={(e)=>{this.props.check(e)}}></button>
                    <button className = "chip10" value="10" onClick={(e)=>{this.props.check(e)}}></button>
                    <button className = "chip15" value="15" onClick={(e)=>{this.props.check(e)}}></button>
                    <button className = "chip25" value="25" onClick={(e)=>{this.props.check(e)}}></button>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Chips;