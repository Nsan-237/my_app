import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

export default function LoginScreen() {
    return (
      <View>
        <View>
            <Image 
                source={require('../../assets/images/login.png')} 
                style={styles.image}
            />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 210,
        height: 450,
        borderRadius: 23
    },
});