import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import SQLite from "react-native-sqlite-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "../url"; // Assurez-vous que votre URL est correctement définie

const Test_sqlite = () => {
  const db = SQLite.openDatabase({ name: "my.db", location: "default" });
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    createTable();
    fetchData();
    syncData();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS test_sqlite (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
        [],
        () => {
          console.log("Table 'test_sqlite' created successfully");
        },
        (error) => {
          console.log("Error creating table:", error);
        }
      );
    });
  };

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM test_sqlite",
        [],
        (tx, results) => {
          const rows = results.rows;
          let items = [];
          if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
              items.push(rows.item(i));
            }
          }
          setItems(items);
        },
        (tx, error) => {
          console.log("Error fetching data:", error);
        }
      );
    });
  };

  const addItem = () => {
    if (!input) {
      Alert.alert("Input cannot be empty.");
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO test_sqlite (name) VALUES (?)",
          [input],
          () => {
            console.log("Item added successfully");
            fetchData();
            setInput("");
          },
          (tx, error) => {
            console.log("Error adding item:", error);
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
      }
    );
  };

  const updateItem = (id, newName) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE test_sqlite SET name = ? WHERE id = ?",
          [newName, id],
          () => {
            console.log("Item updated successfully");
            fetchData();
          },
          (tx, error) => {
            console.log("Error updating item:", error);
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
      }
    );
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM test_sqlite WHERE id = ?",
          [id],
          () => {
            console.log("Item deleted successfully");
            fetchData();
          },
          (tx, error) => {
            console.log("Error deleting item:", error);
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
      }
    );
  };

  const syncData = () => {
    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected) {
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM test_sqlite",
              [],
              (tx, results) => {
                const rows = results.rows;
                let localData = [];
                for (let i = 0; i < rows.length; i++) {
                  localData.push(rows.item(i));
                }

                axios
                  .post(`${url}/sqlite_test/sync`, localData)
                  .then((response) => {
                    console.log("Data synced successfully");
                  })
                  .catch((error) => {
                    console.log("Sync error:", error);
                  });
              },
              (tx, error) => {
                console.log("Error fetching data for sync:", error);
              }
            );
          });
        } else {
          console.log("No internet connection. Cannot sync data.");
        }
      })
      .catch((error) => {
        console.log("Error fetching network state:", error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter item"
        style={styles.input}
      />
      <Button title="Add Item" onPress={addItem} />
      {items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text>{item.name}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Update"
              onPress={() => updateItem(item.id, "New Name")}
            />
            <Button title="Delete" onPress={() => deleteItem(item.id)} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});

export default Test_sqlite;
