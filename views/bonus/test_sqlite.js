import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import tw from "tailwind-react-native-classnames";
import { url } from "../url";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
// import Barcode from "react-native-barcode-builder";

const db = SQLite.openDatabase("Test.db");

const TestSqlite = () => {
  const [nom, setNom] = useState("");
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [EditmodalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  // const [itemToDisplayBarcodeId, setItemToDisplayBarcodeId] = useState(null);

  useEffect(() => {
    initializeDatabase();
    const intervalId = setInterval(() => {
      if (hasUnsyncedData) {
        syncData();
      }
    }, 100000);

    return () => clearInterval(intervalId);
  }, [hasUnsyncedData]);

  const executeSqlAsync = (sqlStatement, params = []) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sqlStatement,
          params,
          (_, results) => resolve(results),
          (_, error) => reject(error)
        );
      });
    });
  };

  const initializeDatabase = async () => {
    try {
      await executeSqlAsync(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, synced INTEGER);"
      );
      console.log("Table créée avec succès");
      fetchAllData();
    } catch (error) {
      console.log("Erreur lors de la création de la table :", error);
    }
  };

  const addTest = async () => {
    if (!nom) {
      console.log("Le nom ne peut pas être vide");
      return;
    }

    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          await url.post(`/sqlite_test`, { name: nom });
          console.log("Données insérées avec succès dans MySQL");
          setNom("");

          fetchAllData();
        } catch (error) {
          console.log(
            "Erreur lors de l'insertion des données dans MySQL :",
            error
          );
          await insertLocalData(nom, 0);
        }
      } else {
        console.log(
          "Pas de connexion Internet. Insertion des données localement."
        );
        await insertLocalData(nom, 0);
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
      await insertLocalData(nom, 0);
    }
  };

  // const checkIfDataExists = async (name) => {
  //   try {
  //     const response = await url.get(`/sqlite_test?name=${name}`);
  //     return response.data.length > 0;
  //   } catch (error) {
  //     console.log(
  //       "Erreur lors de la vérification de l'existence des données :",
  //       error
  //     );
  //     return false;
  //   }
  // };

  const insertLocalData = async (name, synced) => {
    try {
      // const existsInRemote = await checkIfDataExists(name);
      // if (!existsInRemote) {
      //   await url.post(`/sqlite_test`, { name });
      //   console.log("Données insérées avec succès dans MySQL");
      // }
      await executeSqlAsync("INSERT INTO users (name, synced) VALUES (?, ?);", [
        name,
        synced,
      ]);
      fetchAllData();
      setNom("");
      setHasUnsyncedData(true);
      alert("Données insérées avec succès");
      setModalVisible(false);
    } catch (error) {
      console.log(
        "Erreur lors de l'insertion ou de la vérification des données :",
        error
      );
    }
  };

  const deleteLocalData = async () => {
    try {
      await executeSqlAsync("DELETE FROM users WHERE id = ?", [
        itemToDelete.id,
      ]);
      console.log(
        `Donnée avec id ${itemToDelete.id} supprimée avec succès de SQLite`
      );
      alert(`Vous venez de supprimer ${itemToDelete.name} `);
      fetchAllData();
      setDeleteModalVisible(false);
    } catch (error) {
      console.log(
        "Erreur lors de la suppression de la donnée dans SQLite :",
        error
      );
      alert("Erreur lors de la suppression de la donnée");
    }
  };

  const editLocalData = async () => {
    if (!nom || !editedItem) {
      console.log("Nom ou élément à éditer non défini");
      return;
    }

    try {
      await executeSqlAsync("UPDATE users SET name = ? WHERE id = ?", [
        nom,
        editedItem.id,
      ]);
      console.log(`Donnée avec id ${editedItem.id} mise à jour avec succès`);
      alert(`Vous venez de mettre à jour  ${editedItem.name}`);
      fetchAllData();
      setEditModalVisible(false);
      setNom("");
    } catch (error) {
      console.log("Erreur lors de la mise à jour de la donnée :", error);
      alert("Erreur lors de la mise à jour de la donnée");
    }
  };
  const fetchAllData = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const response = await url.get(`/sqlite_test`);
          console.log("Données récupérées de MySQL :", response.data);
          setData(response.data);
          setUsers([]);
          checkUnsyncedData();
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des données de MySQL :",
            error
          );
          fetchUsers();
        }
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      const results = await executeSqlAsync("SELECT * FROM users;");
      let rows = results.rows._array;
      console.log("Données récupérées de SQLite :", rows);
      setUsers(rows);
      setData([]);
      checkUnsyncedData();
    } catch (error) {
      console.log("Erreur lors de la récupération des données :", error);
    }
  };

  const checkUnsyncedData = async () => {
    try {
      const results = await executeSqlAsync(
        "SELECT * FROM users WHERE synced = 0;"
      );
      const rows = results.rows._array;
      setHasUnsyncedData(rows.length > 0);
    } catch (error) {
      console.log(
        "Erreur lors de la vérification des données non synchronisées :",
        error
      );
    }
  };

  const syncData = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const results = await executeSqlAsync(
            "SELECT * FROM users WHERE synced = 0;"
          );
          const rows = results.rows._array;

          let localData = rows.map((row) => ({
            id: row.id,
            name: row.name,
          }));

          if (localData.length === 0) {
            console.log("Aucune donnée locale à synchroniser.");
            setHasUnsyncedData(false);
            return;
          }

          const nonEmptyLocalData = localData.filter((data) => {
            return data.name && data.name.trim() !== "";
          });

          if (nonEmptyLocalData.length === 0) {
            console.log(
              "Toutes les données locales sont vides après filtrage. Rien à synchroniser."
            );
            setHasUnsyncedData(false);
            return;
          }

          console.log(
            "Envoi des données locales à synchroniser :",
            nonEmptyLocalData
          );
          await url.post(`/sqlite_test/sync`, { localData: nonEmptyLocalData });
          console.log("Données synchronisées avec succès");
          await executeSqlAsync(
            "UPDATE users SET synced = 1 WHERE synced = 0;"
          );
          fetchUsers();
          setHasUnsyncedData(false);
        } catch (error) {
          console.log("Erreur lors de la synchronisation des données :", error);
          console.log("Détails de l'erreur :", error.message);
          if (error.response) {
            console.log("Réponse du serveur :", error.response.data);
          } else if (error.request) {
            console.log(
              "Requête envoyée mais aucune réponse reçue :",
              error.request
            );
          } else {
            console.log(
              "Erreur dans la configuration de la requête :",
              error.message
            );
          }
        }
      } else {
        console.log(
          "Pas de connexion Internet. Impossible de synchroniser les données."
        );
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
    setNom(item.name);
    setEditModalVisible(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const renderRightActions = (item) => (
    <View style={tw`flex-row mr-5`}>
      <TouchableOpacity
        style={tw`bg-blue-500 p-2 h-10 mr-1 rounded-md`}
        onPress={() => handleEdit(item)}
      >
        <AntDesign name="edit" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-red-500 p-2 h-10 rounded-md`}
        onPress={() => handleDelete(item)}
      >
        <Entypo name="trash" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const isSynced = item.synced === 1;
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View
          style={tw`bg-gray-900 p-2 shadow-md rounded-md mb-3 ml-4 flex-row items-center`}
        >
          <View style={tw`flex-1 flex-row items-center`}>
            <Text style={tw`text-lg text-white mr-4`}>{item.id}</Text>
            <Text style={tw`text-lg text-white`}>{item.name}</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            {!isSynced ? (
              <MaterialIcons
                name="sync"
                size={24}
                color="white"
                style={tw`mr-2`}
              />
            ) : (
              <AntDesign
                name="checkcircleo"
                size={24}
                color="white"
                style={tw`mr-2`}
              />
            )}
          </View>
        </View>
        {/* <View
              style={tw`flex-1 justify-center items-center h-20 w-24 bg-white`}
            >
              {itemToDisplayBarcodeId === item.id && (
                <>
                  <Text style={tw`text-lg`}>{item.name}</Text>
                  <Barcode value={item.name || "default"} format="CODE128" />
                </>
              )}
            </View> */}
      </Swipeable>
    );
  };

  const dataToRender = data.length > 0 ? data : users;

  return (
    <View style={tw`flex-1 bg-black`}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`bg-blue-500 w-28 items-center rounded-md p-2 mt-4 ml-3`}
      >
        <Text style={tw`text-white text-lg`}>Nouveau</Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-2 w-60 rounded-md`}>
            <Text style={tw`text-white text-lg text-center mb-2`}>
              Test de SQLite
            </Text>
            <View style={tw`flex `}>
              <TextInput
                value={nom}
                onChangeText={setNom}
                style={tw`bg-gray-400 rounded-md p-2 mb-2`}
                placeholder="Nom"
                placeholderTextColor="white"
              />

              <View style={tw`flex-row justify-center`}>
                <TouchableOpacity
                  onPress={addTest}
                  style={tw`bg-green-500 w-24 p-1 rounded-md mt-4 items-center`}
                >
                  <Text style={tw`text-white text-lg`}>Ajouter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={tw`bg-red-500 w-24 p-1 rounded-md mt-4 items-center ml-4`}
                >
                  <Text style={tw`text-white text-lg`}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(!deleteModalVisible)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-4 rounded-md`}>
            {itemToDelete && (
              <Text style={tw`text-lg mb-2 text-white`}>
                Etes-vous sur de supprimer {itemToDelete.name} ?
              </Text>
            )}
            <View style={tw`flex-row justify-center`}>
              <TouchableOpacity
                style={tw`bg-red-500 p-2 rounded-md mr-5 flex-row`}
                onPress={deleteLocalData}
              >
                <Text style={tw`text-white text-center ml-1`}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-500 p-2 rounded-md  flex-row`}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={tw`text-white text-center ml-1`}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={EditmodalVisible}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-2 w-60 rounded-md`}>
            <Text style={tw`text-white text-lg text-center mb-2`}>Editer</Text>
            <View style={tw`flex `}>
              <TextInput
                value={nom}
                onChangeText={setNom}
                style={tw`bg-gray-400 rounded-md p-2 mb-2`}
                placeholder="Nom"
                placeholderTextColor="white"
              />
              <View style={tw`flex-row justify-center`}>
                <TouchableOpacity
                  onPress={editLocalData}
                  style={tw`bg-blue-500 w-24 p-1 rounded-md mt-4 items-center`}
                >
                  <Text style={tw`text-white text-lg`}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={tw`bg-red-500 w-24 p-1 rounded-md mt-4 items-center ml-4`}
                >
                  <Text style={tw`text-white text-lg`}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        style={tw`mt-2`}
        data={dataToRender}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TestSqlite;
