import React from 'react'

import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';

export default class Loading extends React.Component{
    render() {
        return (
            <>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </>
        )
      }
}