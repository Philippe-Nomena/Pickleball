import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import tw from "tailwind-react-native-classnames";
import { url } from "../url";

const db = SQLite.openDatabase("Test.db");

const TestSqlite = () => {
  const [nom, setNom] = useState("");
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);

  useEffect(() => {
    initializeDatabase();
    const intervalId = setInterval(() => {
      if (hasUnsyncedData) {
        syncData();
      }
    }, 10000);

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
            "Erreur lors de l'insertion des données dans MySQL, insertion locale :",
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

  const insertLocalData = async (name, synced) => {
    try {
      await executeSqlAsync("INSERT INTO users (name, synced) VALUES (?, ?);", [
        name,
        synced,
      ]);
      console.log("Données insérées avec succès dans SQLite");
      setNom("");
      fetchAllData();
      setHasUnsyncedData(true);
    } catch (error) {
      console.log(
        "Erreur lors de l'insertion des données dans SQLite :",
        error
      );
    }
  };

  const fetchAllData = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const response = await url.get(`/sqlite_test`);
          // console.log("Données récupérées du serveur :", response.data);
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

          console.log("Données locales non synchronisées :", rows);

          let localData = rows.map((row) => ({
            id: row.id,
            name: row.name,
          }));

          console.log("localData avant filtrage :", localData);

          if (localData.length === 0) {
            console.log("Aucune donnée locale à synchroniser.");
            setHasUnsyncedData(false);
            return;
          }

          const nonEmptyLocalData = localData.filter((data) => {
            console.log("Data before filter: ", data);
            return data.name && data.name.trim() !== "";
          });

          console.log("nonEmptyLocalData après filtrage :", nonEmptyLocalData);

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
          await url.post(`/sqlite_test/sync`, nonEmptyLocalData);
          console.log("Données synchronisées avec succès");
          await executeSqlAsync(
            "UPDATE users SET synced = 1 WHERE synced = 0;"
          );
          fetchUsers();
          setHasUnsyncedData(false);
        } catch (error) {
          console.log("Erreur lors de la synchronisation des données :", error);
          console.log("Détails de l'erreur : ", error.message);
          if (error.response) {
            console.log("Réponse du serveur : ", error.response.data);
          } else if (error.request) {
            console.log(
              "Requête envoyée mais aucune réponse reçue : ",
              error.request
            );
          } else {
            console.log(
              "Erreur dans la configuration de la requête : ",
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

  return (
    <View style={tw`flex-1 bg-black`}>
      <Text style={tw`text-white text-lg text-center mb-2`}>
        Test de sqlite
      </Text>
      <View style={tw`flex w-80 ml-10`}>
        <TextInput
          value={nom}
          onChangeText={setNom}
          style={tw`bg-gray-400 rounded-md p-2 mb-4`}
          placeholder="Nom"
          placeholderTextColor="white"
        />
        <TouchableOpacity
          onPress={addTest}
          style={tw`bg-green-500 w-24 p-2 rounded-md mt-4 items-center ml-20`}
        >
          <Text style={tw`text-white text-lg`}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={tw`mt-10`}>
        {data.length > 0
          ? data.map((item) => (
              <Text
                key={item.id}
                style={tw`bg-gray-400 p-2 rounded-md text-center mb-2`}
              >
                {item.name} (MySQL)
              </Text>
            ))
          : users.map((user) => (
              <Text
                key={user.id}
                style={tw`text-white bg-gray-400 p-2 rounded-md text-center mb-2`}
              >
                {user.name}{" "}
                {user.synced ? "(Synchronisé)" : "(Non Synchronisé)"}
              </Text>
            ))}
      </ScrollView>
    </View>
  );
};

export default TestSqlite;
