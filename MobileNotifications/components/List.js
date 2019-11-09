import React from 'react'
import { 
    StyleSheet, Platform, Image, Text, View, Button, ScrollView, FlatList, Item 
} from 'react-native';
import ListItem from './ListItem';

export default class List extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            items: this.props.items
        }
    }


    render(){
        return (
                <FlatList
                    data={this.state.items}
                    renderItem={({ item }) => (<ListItem item={item} onPress={this.props.onPress}/>)}
                    keyExtractor={item => item.channel}
                />
        )
    }

    
}