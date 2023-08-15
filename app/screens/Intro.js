import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import colors from '../misc/colors';
import RoundIconBtn from '../components/RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Intro = ({ onFinish }) => {
    const [name, setName] = useState('');
    const handleOnChangeText = (text) => {
        setName(text);
    }
    const handleSubmit = async () => {
        const user = { name: name };
        await AsyncStorage.setItem('user', JSON.stringify(user));
        if (onFinish) onFinish();
    }
    return (
        <>
            <StatusBar hidden />
            <View style={styles.container}>
                <Text style={styles.inputTitle}>Enter Your Name to continue</Text>
                <TextInput
                    value={name}
                    onChangeText={handleOnChangeText}
                    placeholder='Enter Name'
                    style={styles.textInput}
                />
                {name.trim().length >= 3 ?
                    (<RoundIconBtn antIconName='arrowright' onPress={handleSubmit} />)
                    : null}
            </View>
        </>
    );
};
const width = Dimensions.get('window').width - 50;
// console.log(width)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        borderWidth: 2,
        borderColor: colors.PRIMARY,
        color: colors.PRIMARY,
        width,
        height: 50,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 20,
        fontFamily: 'Poppins-Light',
        marginBottom: 5,
    },
    inputTitle: {
        alignSelf: 'flex-start',
        paddingLeft: 25,
        fontFamily: 'Poppins-Light',
        marginBottom: 5,
        opacity: 0.5,
    },
});

export default Intro;