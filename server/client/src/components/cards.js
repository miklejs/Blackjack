import React, { Component } from 'react';
import '../gameTable.css';


class UserCards extends Component {
    constructor(props){
        super(props);
        this.state={
            cpCard: ""

        }
    }

    

    render() {      
        
        let user = this.props.userCards.map(function(el, id){
            return <img alt={id} key={id} src={require(`../images/cards/${el.name}.png`)}></img>
        })
        
        
       
       
        return(
            <div>
                <div>                    
                    <div>
                        {user}
                    </div>
                </div>
            </div>
        )
    }
}

export default UserCards;