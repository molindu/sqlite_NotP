import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions, StyleSheet, Alert, StatusBar } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Icons from './Icons';
import colors from './colors';

const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

const { width, height } = Dimensions.get('window');
const NoteDetailScreen = ({ route, navigation }) => {
    const [hidden, setHidden] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { note, onUpdate } = route.params || {};
    const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
    const [statusBarTransition, setStatusBarTransition] = useState(
        TRANSITIONS[0],
    );
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note]);

    const saveNote = () => {
        const db = SQLite.openDatabase({ name: 'notesDB', location: 'default' });
        {
            title.trim() === '' && content.trim() === '' ?

                navigation.navigate('NoteList')

                :
                db.transaction(tx => {
                    if (note) {
                        tx.executeSql(
                            'UPDATE notes SET title = ?, content = ? WHERE id = ?',
                            [title, content, note.id],
                            () => {
                                onUpdate();
                                navigation.goBack();
                            },
                            error => {
                                console.error('Error updating note: ', error);
                            }
                        );
                    } else {
                        tx.executeSql(
                            'INSERT INTO notes (title, content) VALUES (?, ?)',
                            [title, content],
                            () => {
                                onUpdate();
                                navigation.goBack();
                            },
                            error => {
                                console.error('Error inserting note: ', error);
                            }
                        );
                    }
                });
        }
    };
    const displayDeleteAlert = () => {
        Alert.alert('Are You Sure!', 'This action will delete your note permanently', [{
            text: 'Delete',
            onPress: deleteNote
        },
        {
            text: 'No Thanks',
            onPress: () => console.log('no thanks')
        }
        ], {
            cancelable: true,
        });
    }
    const deleteNote = () => {

        if (note) {
            const db = SQLite.openDatabase({ name: 'notesDB', location: 'default' });

            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM notes WHERE id = ?',
                    [note.id],
                    () => {
                        onUpdate();
                        navigation.goBack();
                    },
                    error => {
                        console.error('Error deleting note: ', error);
                    }
                );
            });
        }
    };
    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <View style={styles.headerButtonContainer}>
    //                 <TouchableOpacity
    //                     style={styles.button}
    //                     onPress={saveNote}
    //                 >
    //                     <Icons name='check' />
    //                 </TouchableOpacity>
    //             </View>
    //         ),
    //     });
    // }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.PRIMARY}
                barStyle={statusBarStyle}
                showHideTransition={statusBarTransition}
                hidden={hidden}
            />
            {React.useLayoutEffect(() => {
                navigation.setOptions({
                    headerRight: () => (
                        <View style={styles.headerButtonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={saveNote}
                            >
                                <Icons name='check' />
                            </TouchableOpacity>
                        </View>
                    ),
                });
            }, [navigation, saveNote])}
            <View style={{ flex: 1, marginTop: 20, zIndex: 2 }}>
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    style={styles.title}
                />
                <TextInput
                    placeholder="Content"
                    value={content}
                    onChangeText={text => setContent(text)}
                    multiline
                    style={styles.desc}
                />
            </View>

            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={saveNote}
                >
                    <Icons name='check' />
                </TouchableOpacity> */}
                {note && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={displayDeleteAlert}
                    >
                        <Icons name='delete' />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 15,
    },
    container: {
        flex: 1,
        backgroundColor: colors.LIGHT,
    },
    statusBarButton: {
        position: 'absolute',
        top: StatusBar.currentHeight || 0,
        top: 5,
        left: 0,
        right: 0,
        alignItems: 'flex-end',
        padding: 15,
        backgroundColor: colors.LIGHT,
        zIndex: 1,
    },
    contentContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 20,
    },
    buttonContainer: {
        flexDirection: 'row', // Adjust this to align buttons side by side
        justifyContent: 'center', // Adjust this to evenly space buttons
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.LIGHT,
        borderTopWidth: 0.5,
        borderTopColor: colors.PRIMARY,
    },
    button: {
        padding: 5,
        borderRadius: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        backgroundColor: colors.LIGHT,
        width: width / 7,
        height: width / 7,
    },
    title: {
        fontFamily: 'Poppins-Black',
        fontSize: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.PRIMARY,
    },
    desc: {
        fontFamily: 'Poppins-Black',
        fontSize: 20,
        // borderBottomWidth: 0.5,
        // borderBottomColor: colors.PRIMARY,
    },
});

export default NoteDetailScreen;