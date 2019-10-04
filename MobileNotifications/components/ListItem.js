import React from 'react';
import {Button} from 'react-native';


export default class ListItem extends React.Component{
    shouldComponentUpdate(){
        return false;
    }

    render(){
        return (
            <Button/>
        )
    }
}