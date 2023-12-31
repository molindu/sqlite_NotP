import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const NotFound = () => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <Icon name="frowno" size={90} color='black' />
            {/* <Icon name="close" size={90} color='black' /> */}
            <Text style={{ marginTop: 20, fontSize: 20 }}>Result Not Found</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
        zIndex: -1,
    },
});
export default NotFound;