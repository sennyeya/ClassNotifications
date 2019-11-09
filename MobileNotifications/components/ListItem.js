import React from 'react';
import {TouchableOpacity, Text} from 'react-native';


export default class ListItem extends React.Component{
    // Add each pressed item to a master list on the main page that will be sent in a post request to the server to update channel bindings.

    shouldComponentUpdate(){
        return false;
    }

    render(){
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <Text>{this.props.item.channel}</Text>
            </TouchableOpacity>
        )
    }
}