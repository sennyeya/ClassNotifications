import React from 'react';
import {TouchableOpacity, Text} from 'react-native';


export default class ListItem extends React.Component{
    // Add each pressed item to a master list on the main page that will be sent in a post request to the server to update channel bindings.
    state = {
        opacity:1
    }
    shouldComponentUpdate(){
        return true;
    }

    render(){
        return (
            <TouchableOpacity onPress={()=>{this.state.opacity==1?this.setState({opacity:.1}):this.setState({opacity:1});this.props.onPress(this.props.item)}}>
                <Text style={[{opacity:this.state.opacity}]}>{this.props.item.channel}</Text>
            </TouchableOpacity>
        )
    }
}