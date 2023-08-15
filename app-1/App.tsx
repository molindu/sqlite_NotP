import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from './NoteListScreen';
import NoteDetailScreen from './NoteDetailScreen';
import { library } from '@fortawesome/fontawesome-svg-core';
// import { faPlusCircle, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import SplashScreen from 'react-native-splash-screen';
// Add icons to the library
// library.add(faPlusCircle, faSearch, faTimesCircle);

const Stack = createStackNavigator();

const App = () => {
    // useEffect(() => {
    //     SplashScreen.hide();
    // }, [])
    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator initialRouteName="NoteList">
                <Stack.Screen
                    name="NoteList"
                    component={NoteListScreen}
                    options={{ title: '', headerTitleStyle: { display: 'none' } }}
                />
                <Stack.Screen
                    name="NoteDetail"
                    component={NoteDetailScreen}
                    options={{ title: '', headerTitleStyle: { display: 'none' } }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
