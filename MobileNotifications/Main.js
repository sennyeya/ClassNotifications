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
    state = { currentUser: null, availableChannels:[], subscribedChannels:[], addChannels:[] }
    render() {
        const { currentUser } = this.state
        return (
            <View style={styles.container}>
                <Text>
                Hi {currentUser && currentUser.email}!
                </Text>
                {!this.state.subscribedChannels.length&&!this.state.availableChannels.length?<Loading/>:(
                    <>
                        <List onPress={this._onPress.bind(this)} items={this.state.subscribedChannels}/>
                        <List onPress={this._onPress.bind(this)} items={this.state.availableChannels}/>
                    </>
                )}
                {this.state.addChannels.length>0?<Button title="Add" onPress={async ()=>{fetch(await settings.get("MOBILEENDPOINT")+"/addChannel",{
                    method:'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({channels: this.state.addChannels, user:this.state.currentUser.email})
                }).then(e=>e.json()).then(e=>this.setState(this.state))}}/>
                :<></>}
                <Button title="Logout" onPress={() => {firebase.auth().signOut(); this.props.navigation.pop()}}/>
            </View>
            )
        }

        _onPress(item){
            if(!this.state.addChannels.some(e=>e===item)){
                this.state.addChannels.push(item);
            }else{
                this.setState({addChannels:this.state.addChannels.filter(e=>e!==item)});
            }
        }

        componentWillMount(){
            var sub = new Subscriber();
            sub.getChannels().then(e=>{
                this.setState({subscribedChannels:e.data, addChannels:subscribedChannels})
            }).catch(e=>this.setState({errorMessage:e}));
            sub.getNewChannels().then(e=>{
                this.setState({availableChannels:e.data})
            }).catch(e=>{
                this.setState({errorMessage:e})
            });
        }

        componentDidMount(){
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