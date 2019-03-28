import React, { Component } from 'react';




class Alert extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        let typeOfWarning;
        //console.log("Aller", loginWarning)
        //let gameWarning = this.props.show;
        if(this.props.typeOfWarning === 'user'){
            typeOfWarning = "You Win!";
        } else {
            if(this.props.typeOfWarning === 'casino'){
                typeOfWarning = "Casino Win!";
            } else {
                typeOfWarning = this.props.typeOfWarning;
            }
        }
       
        //console.log("typeOfWarning", typeOfWarning)
        let isShow = this.props.show;
             
        //console.log("gameWarning", gameWarning)
        return (
            <div>
                
                <div className = "Warning">
                    {isShow ? 
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>{typeOfWarning}</strong> 
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick = {this.props.warnswitcher}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div> 
                    : null}
                </div>

                
                
            </div>
            
        )
    }
}

export default Alert;