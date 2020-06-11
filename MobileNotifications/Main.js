import React from 'react'
import { 
    StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, Item 
} from 'react-native';
import firebase from './services/firebase';
import {Subscriber} from './services/subscribe';
import List from './components/List';
import Loading from './components/Loading';
import settings from './settings';

export default class Main extends React.Component {
    state = { currentUser: null, availableChannels:[], subscribedChannels:[], addChannels:[], deleteChannels:[] }
    render() {
        const { currentUser } = this.state;
        console.log(this.state)
        return (
        <View>
            <Text>
            Hi {currentUser && currentUser.email}!
            </Text>
            {(!this.state.subscribedChannels.length||!this.state.availableChannels.length)?<Loading/>:(
                <>
                    <Text>Subscribed Channels</Text>
                    <List onPress={this._onPressDelete.bind(this)} items={this.state.subscribedChannels}/>
                    <Text>Available Channels</Text>
                    <List onPress={this._onPress.bind(this)} items={this.state.availableChannels}/>
                </>
            )}
            {this.state.addChannels.length>0?<Button title="Add" onPress={async ()=>{
                this.setState({subscribedChannels:[],availableChannels:[]});
                var channels = this.state.addChannels;
                //this.setState({addChannels:[]})
                fetch(await settings.get("MOBILEENDPOINT")+"/addChannel",{
                    method:'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({channels: channels, user:this.state.currentUser.email})
            }).then(()=>this._loadLists.bind(this)())}}/>
            :<></>}
            <Button title="Logout" onPress={() => {firebase.auth().signOut(); this.props.navigation.pop()}}/>
        </View>
        )
    }

    _onPressDelete(item){
        if(!this.state.deleteChannels.some(e=>e===item)){
            this.state.deleteChannels.push(item);
            this.setState({deleteChannels:this.state.deleteChannels});
        }else{
            this.setState({deleteChannels:this.state.deleteChannels.filter(e=>e!==item)});
        }
    }

    _onPress(item){
        if(!this.state.addChannels.some(e=>e===item)){
            this.state.addChannels.push(item);
            this.setState({addChannels:this.state.addChannels});
        }else{
            this.setState({addChannels:this.state.addChannels.filter(e=>e!==item)});
        }
    }

    _loadLists(){
        var sub = new Subscriber();
        sub.getChannels().then(e=>{
            this.setState({subscribedChannels:e.data, addChannels:[]})
        }).catch(e=>this.setState({errorMessage:e}));
        sub.getNewChannels().then(e=>{
            this.setState({availableChannels:e.data})
        }).catch(e=>{
            this.setState({errorMessage:e})
        });
    }

    componentDidMount(){
        this._loadLists.bind(this)();
        const {currentUser} = firebase.auth();
        this.setState({currentUser});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})