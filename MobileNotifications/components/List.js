import React from 'react'
import { 
    StyleSheet, Platform, Image, Text, View, Button, ScrollView, FlatList, Item, TouchableOpacity 
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
            <ScrollView style={{height:"30%"}}>
                {this.state.items.map((item,i)=>{
                    return <ListItem item={item} onPress={this.props.onPress} index={i}/>
                })}
            </ScrollView>
        )
    }    
}