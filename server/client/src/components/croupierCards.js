import React, { Component } from 'react';
import '../gameTable.css';

class CroupierCards extends Component {
    constructor(props){
        super(props);
        this.state={
            cpCard: ""

        }
    }

    

    render() {      
        let croupier = this.props.croupierCards.map(function(el, id){
            return <img alt={id}key={id}src={require(`../images/cards/${el.name}.png`)}></img>
        })

        
        
        
       
       
        return(
            <div>
                <div>
                    <div>
                        {croupier}                        
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default CroupierCards;