import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotes } from '../database/DatabaseHelper';

const NoteContext = createContext();
const NoteProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const findNotes = () => {
        getNotes((results) => {
            setNotes(results);
        });
    }

    useEffect(() => {
        findNotes();
        // AsyncStorage.clear();
        // findGreet();
    }, []);

    return (
        <NoteContext.Provider value={{ notes, setNotes, findNotes }}>
            {children}
        </NoteContext.Provider>
    )
}

const styles = StyleSheet.create({})

export const useNotes = () => useContext(NoteContext);
export default NoteProvider;