import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../misc/colors';
import SearchBar from '../components/SearchBar';
import RoundIconBtn from '../components/RoundIconBtn';
import NoteInputModel from '../components/NoteInputModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from '../components/Note';
import { useNotes } from '../contexts/NoteProvider';
import NotFound from '../components/NotFound';

const NoteScreen = ({ user, navigation }) => {
    const [greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { notes, setNotes } = useNotes();
    const [searchQuery, setSearchQuery] = useState();
    const [resultNotFound, setResultNotFound] = useState(false);

    const findGreet = () => {
        const hrs = new Date().getHours();
        // console.log(hrs);
        if (hrs == 0 || hrs < 12) {
            return setGreet('Morning');
        }
        if (hrs == 1 || hrs < 17) {
            return setGreet('Afternoon');
        }
        setGreet('Evening');
    }
    const findNotes = async () => {
        // const result = await AsyncStorage.getItem('notes');
        const result = await AsyncStorage.getItem('notes');
        // console.log(result);
        if (result !== null) setNotes(JSON.parse(result));
    }

    useEffect(() => {
        findNotes();
        // AsyncStorage.clear();
        findGreet();
    }, []);

    const handleOnSubmit = (title, desc) => {
        // console.log(title, desc);
        // const time = new Date().getTime();
        const note = { id: Date.now(), title, desc, time: Date.now() }
        // console.log(note);
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
    }
    const openNote = (note) => {
        navigation.navigate('NoteDetail', { note })
    }
    const handleOnSearchInput = async (text) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setSearchQuery('');
            setResultNotFound(false);
            return await findNotes();
        }
        const filteredNotes = notes.filter(note => {
            if (note.title.toLowerCase().includes(text.toLowerCase())) {
                return note;
            }
        });
        if (filteredNotes.length) {
            setNotes([...filteredNotes]);
        } else {
            setResultNotFound(true);
        }
    }
    const handleOnClear = () => {
        setSearchQuery('');
        setResultNotFound(false);
        findNotes();
    }
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={styles.container}>
                    <Text style={styles.header}>{`Good ${greet} ${user.name}`}</Text>
                    {notes.length ? (
                        <SearchBar
                            value={searchQuery}
                            onChangeText={handleOnSearchInput}
                            containerStyle={{ marginVertical: 15 }}
                            onClear={handleOnClear}
                        />
                    ) : null}
                    {resultNotFound ? (
                        <NotFound />)
                        :
                        (<FlatList
                            data={notes}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => <Note onPress={() => openNote(item)} item={item} />}
                        />)
                    }
                    {!notes.length ?
                        (<View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                            <Text style={styles.emptyHeader}>Add Notes</Text>
                        </View>)
                        : null
                    }
                </View>
            </TouchableWithoutFeedback>
            <RoundIconBtn
                // onPress={() => console.log('opening modal')}
                onPress={() => setModalVisible(true)}
                antIconName='plus'
                style={styles.addBtn}
            />
            <NoteInputModel
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleOnSubmit}
            />
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
    },
    emptyHeader: {
        fontSize: 30,
        textTransform: 'uppercase',
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        opacity: 0.2,
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        zIndex: -1,

    },
    addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 50,
        zIndex: 1,
    }
})


export default NoteScreen;