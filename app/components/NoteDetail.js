import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Alert } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';
// import { AlertFilled } from '@ant-design/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModel from './NoteInputModel';
import { getNotes, updateNotes } from '../database/DatabaseHelper';

const foramtDate = (ms) => {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};
const NoteDetail = (props) => {
    // console.log(props.route);
    // const { note } = props.route.params;
    const [note, setNote] = useState(props.route.params.note);
    const headerHeight = useHeaderHeight();
    const { setNotes } = useNotes();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    console.log(note);

    const deleteNote = async () => {
        const result = await AsyncStorage.getItem('notes');
        let notes = []
        if (result !== null) notes = JSON.parse(result);

        const newNotes = notes.filter(n => n.id !== note.id);
        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        props.navigation.goBack();
    }

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
    const handleUpdate = async (title, desc, time) => {
        const result = () => {
            getNotes((results) => {
                setNotes(results);
            });
        }
        let notes = [];
        if (result !== null) notes = JSON.parse(result);

        // // Find the index of the note in the notes array
        const noteIndex = notes.findIndex((n) => n.id === note.id);

        if (noteIndex !== -1) {
            // Update the note with the new values
            notes[noteIndex].title = title;
            notes[noteIndex].desc = desc;
            notes[noteIndex].isUpdated = true;
            notes[noteIndex].time = time;

            // Update the notes array
            setNotes([...notes]);

            //     // Update the note state with the new values
            //     setNote({
            //         ...note,
            //         title: title,
            //         desc: desc,
            //         isUpdated: true,
            //         time: time,
            //     });

            //     // Update the AsyncStorage with the updated notes
            //     // await AsyncStorage.setItem('notes', JSON.stringify(notes));

            updateNotes(note.id, title, desc, time);

            // Update the note state with the new values
            setNote({
                ...note,
                title: title,
                desc: desc,
                isUpdated: true,
                time: time,
            });
        }

        setShowModal(false);
    };

    const handleOnClose = () => setShowModal(false);

    const openEditModal = () => {
        setIsEdit(true);
        setShowModal(true);
    }
    return (
        <>
            {/* // <View style={[styles.container], { paddingTop: headerHeight }}> */}
            <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
                <Text style={styles.time}>
                    {note.isUpdated ?
                        `Updated At ${foramtDate(note.time)}` :
                        `Created At ${foramtDate(note.time)}`}
                </Text>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.desc}>{note.desc}</Text>
            </ScrollView >

            <View style={styles.btnContainer}>
                <RoundIconBtn
                    antIconName='delete'
                    style={{ backgroundColor: colors.ERROR, marginBottom: 15, }}
                    onPress={displayDeleteAlert}
                />
                <RoundIconBtn
                    antIconName='edit'
                    // onPress={() => setShowModal(true)}
                    onPress={openEditModal}
                />
            </View>
            <NoteInputModel
                isEdit={isEdit}
                note={note}
                onClose={handleOnClose}
                onSubmit={handleUpdate}
                visible={showModal}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 30,
        color: colors.PRIMARY,
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Light',

    },
    desc: {
        fontSize: 20,
        opacity: 0.6,
        fontFamily: 'Poppins-Light',
    },
    time: {
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.5,
        fontFamily: 'Poppins-Bold',
    },
    btnContainer: {
        position: 'absolute',
        right: 15,
        bottom: 50,
    },
});
export default NoteDetail; 