import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import SQLite from "react-native-sqlite-storage";
import NetInfo from "@react-native-community/netinfo";
import url from "../url";

const db = SQLite.openDatabase({ name: "my.db", location: "default" });

const Test_sqlite = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    createTable();
    fetchData();
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncData();
      }
    });
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS test_sqlite (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
        [],
        () => {
          console.log("Table created");
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM test_sqlite", [], (tx, results) => {
        const rows = results.rows;
        let items = [];
        for (let i = 0; i < rows.length; i++) {
          items.push(rows.item(i));
        }
        setItems(items);
      });
    });
  };

  const addItem = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO test_sqlite (name) VALUES (?)",
        [input],
        () => {
          fetchData();
          setInput("");
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const updateItem = (id, newName) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE test_sqlite SET name = ? WHERE id = ?",
        [newName, id],
        () => {
          fetchData();
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM test_sqlite WHERE id = ?",
        [id],
        () => {
          fetchData();
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const syncData = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM test_sqlite", [], (tx, results) => {
        const rows = results.rows;
        let localData = [];
        for (let i = 0; i < rows.length; i++) {
          localData.push(rows.item(i));
        }

        url
          .post("/sqlite_test/sync", localData)
          .then((response) => {
            console.log("Data synced");
          })
          .catch((error) => {
            console.log("Sync error: ", error);
          });
      });
    });
  };

  return (
    <View>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter item"
      />
      <Button title="Add Item" onPress={addItem} />
      {items.map((item) => (
        <View key={item.id}>
          <Text>{item.name}</Text>
          <Button
            title="Update"
            onPress={() => updateItem(item.id, "New Name")}
          />
          <Button title="Delete" onPress={() => deleteItem(item.id)} />
        </View>
      ))}
    </View>
  );
};

export default Test_sqlite;
