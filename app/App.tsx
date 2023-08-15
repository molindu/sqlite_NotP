import AsyncStorage from '@react-native-async-storage/async-storage';
import Intro from './screens/Intro';
import React, { useEffect, useState } from 'react'
import NoteScreen from './screens/NoteScreen';
import { createStackNavigator } from '@react-navigation/stack';
import NoteDetail from './components/NoteDetail';
import { NavigationContainer } from '@react-navigation/native';
import NoteProvider from './contexts/NoteProvider';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState({});
  const [isAppFirstTimeOpen, setIsAppFirstTimeOpen] = useState(false);
  const findUser = async () => {
    const result = await AsyncStorage.getItem('user');
    if (result === null) return setIsAppFirstTimeOpen(true);
    // console.log(result);
    // if (result !== null) {
    setUser(JSON.parse(result));
    // }
    setIsAppFirstTimeOpen(false);
  };
  useEffect(() => {
    findUser();
    // AsyncStorage.clear();//clear memory storage
  }, []);
  if (isAppFirstTimeOpen) return <Intro onFinish={findUser} />

  const RenderNoteScreen = (props) => (
    < NoteScreen {...props} user={user} />
  );
  return (
    // <Intro />
    // <NoteScreen user={user} />
    <NavigationContainer>

      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      <NoteProvider>

        <Stack.Navigator screenOptions={{ headerTitle: '', headerTransparent: true }}>
          <Stack.Screen component={RenderNoteScreen} name='NoteScreen' />
          <Stack.Screen component={NoteDetail} name='NoteDetail' />
        </Stack.Navigator>

      </NoteProvider>
    </NavigationContainer>
  );
};

export default App;