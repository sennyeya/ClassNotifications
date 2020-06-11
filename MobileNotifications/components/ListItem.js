import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';


export default class ListItem extends React.Component{
    // Add each pressed item to a master list on the main page that will be sent in a post request to the server to update channel bindings.
    state = {
        opacity:1,
        backgroundColor:"#d2f7f1"
    }
    shouldComponentUpdate(){
        return true;
    }

    render(){
        return (
            <View key={this.props.index} style={{...styles.item, backgroundColor:this.state.backgroundColor}}>
                <TouchableOpacity onPress={()=>{this.state.backgroundColor=="#d2f7f1"?this.setState({backgroundColor:"#d2f7d2"}):this.setState({backgroundColor:"#d2f7f1"});this.props.onPress(this.props.item)}} style={styles.opacity}>
                    <Text style={[{opacity:this.state.opacity}]}>{this.props.item.channel}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    item: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: 10,
       margin: 2,
       borderColor: '#2a4944',
       borderWidth: 1,
       backgroundColor: '#d2f7f1'
    },
    opacity: {
        alignSelf: 'stretch'
     }
 })