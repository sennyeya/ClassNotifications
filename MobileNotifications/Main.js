import React from 'react'
import { 
    StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, Item 
} from 'react-native';
import firebase from './services/firebase';
import {Subscriber} from './services/subscribe';

export default class Main extends React.Component {
  state = { currentUser: null, channels:[] }
    render() {
        const { currentUser } = this.state
        return (
            <View style={styles.container}>
                <Text>
                Hi {currentUser && currentUser.email}!
                </Text>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={DATA}
                        renderItem={({ item }) => (<ListItem/>)}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
                <Button title="Logout" onPress={() => {firebase.auth().signOut(); this.props.navigation.pop()}}/>
            </View>
            )
        }

        componentWillMount(){
            var sub = new Subscriber();
            sub.getChannels().then(e=>{
                var channels = [];
                e.forEach(val=>{
                    channels.push(val.data().channel)
                })
                this.setState({channels:channels})
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