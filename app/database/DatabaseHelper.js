import React, { useEffect, useState } from 'react';
// import { View, Text, StatusBar, TextInput, Button, FlatList } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
    name: "rn_sqlite",
});
export const createTables = () => {
    db.transaction(txn => {
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, desc TEXT, time TEXT)`,
            [],
            (sqlTxn, res) => {
                console.log('table created successfully');
            },
            error => {
                console.log('error on creating table ' + error);
            },
        );
    });
};
export const insertNote = (title, desc, time) => {
    db.transaction(txn => {
        txn.executeSql(
            `INSERT INTO notes(title,desc,time) VALUES(?,?,?)`,
            [title, desc, time],
            (sqlTxn, res) => {
                // (SQLTransaction, SQLResultSet)
                console.log(`insert ${title},${desc},${time} successfully`);
                // getCategories();
                // setCategory("");
            },
            error => {
                console.log('error on adding category' + error);
            },
        )
    });
};
export const getNotes = (callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `SELECT * FROM notes ORDER BY id DESC`,
            [],
            (sqlTxn, res) => {
                console.log('categories retrieved successfully');
                let len = res.rows.length;
                if (len > 0) {
                    let results = [];
                    for (let i = 0; i < len; i++) {
                        let item = res.rows.item(i);
                        results.push({ id: item.id, title: item.title, desc: item.desc, time: item.time });
                    }
                    callback(results); // Pass the results to the callback
                }
            },
            error => {
                console.log('error on getting categories ' + error);
            }
        )
    });
};
export const updateNotes = (id, title, desc, time) => {
    db.transaction(txn => {
        txn.executeSql(
            `UPDATE notes SET title = ?,desc = ?,time = ? WHERE id = ?`,
            [id, title, desc, time],
            (sqlTxn, res) => {
                // (SQLTransaction, SQLResultSet)
                console.log(`id ${id} category Updated successfully`);
                // getCategories();
                // updateIdCategory("");
                // updateNameCategory("");

            },
            error => {
                console.log('error on updating category' + error);
            },
        )
    });
};
export const deleteNote = (id, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `DELETE FROM notes WHERE id = ?`,
            [id],
            (sqlTxn, res) => {
                console.log(`Note with ID ${id} deleted successfully`);
                if (callback) {
                    callback();
                }
            },
            error => {
                console.log('error on deleting note ' + error);
            }
        );
    });
};

// useEffect(() => {
//     createTables();
//     // getCategories();
// }, [])