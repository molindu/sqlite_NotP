import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import colors from './colors';
import Icon from './Icons';

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search Notes..."
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={styles.searchBar}
            />
            {searchQuery !== '' && (
                <TouchableOpacity onPress={handleClearSearch}>

                    <Icons name='cross' />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    searchBar: {
        borderWidth: 0.5,
        borderColor: colors.PRIMARY,
        height: 40,
        borderRadius: 40,
        paddingLeft: 15,
        fontSize: 20,
    },
    clearIcon: {
        position: 'absolute',
        right: 10,
    },
})

export default SearchBar;