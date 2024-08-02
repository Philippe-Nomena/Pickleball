import React, { useState, useEffect, act } from "react";
import tw from "tailwind-react-native-classnames";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import { url } from "../url";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import dayjs from "dayjs";
import BarcodeScannerScreen from "./qrcode";

const Hiver_Presence = () => {
  const [nom, setNom] = useState("");
  const [session] = useState("Hiver");
  const [remarque, setRemarque] = useState("");
  const [activite, setActivite] = useState("");
  const [categorie, setCategorie] = useState("");
  const [groupe, setGroupe] = useState(["Lundi"]);
  const [id_pratiquant, setId_pratiquant] = useState("");
  const [barcodeData, setBarcodeData] = useState(null);
  const [hiverVisible] = useState(false);
  const [present] = useState(true);
  const [absence] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      console.log("Selected date:", selectedDate.toDateString());
    } else {
      setShowDatePicker(false);
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const Ajout = async () => {
    if (!nom) {
      console.log("Le nom ne peut pas être vide");
      Alert.alert("Erreur", "Le nom ne peut pas être vide");
      return;
    }

    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.put(
            `/presence/${id_pratiquant}`,
            {
              nom,
              session,
              activite,
              jour: formatDate(date),
              present,
              absence,
              categorie,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(id_pratiquant);
          console.log("Données insérées avec succès dans MySQL");
          Alert.alert("Succès", response.data);

          setBarcodeData(null);
        } catch (error) {
          console.error("Error inserting data online:", error.message);
          Alert.alert("Erreur", error.response?.data || error.message);
          await insertLocalData(
            nom,
            session,
            activite,
            categorie,
            groupe,
            present,
            id_pratiquant,
            0
          );
        }
      } else {
        console.log(
          "Pas de connexion Internet. Insertion des données localement."
        );
        await insertLocalData(
          nom,
          session,
          activite,
          categorie,
          groupe,
          present,
          id_pratiquant,
          0
        );
        Alert.alert("Succès", "Données insérées localement");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'état du réseau:",
        error.message
      );
      await insertLocalData(
        nom,
        session,
        activite,
        categorie,
        groupe,
        present,
        id_pratiquant,
        0
      );
      Alert.alert(
        "Erreur",
        "Erreur lors de la récupération de l'état du réseau. Données insérées localement"
      );
    }
  };
  const handleScan = async (data) => {
    setBarcodeData(data);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const getNom = await url.get(`/pratiquants/hiver/${data}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (getNom) {
        const nom = getNom.data.nom;
        const Id = getNom.data.id;
        const activite = getNom.data.activite;
        const categorie = getNom.data.categorie;
        setBarcodeData({ nom, Id, activite, categorie });
        setNom(nom);
        setActivite(activite);
        setCategorie(categorie);
        setId_pratiquant(Id.toString());
      }
    } catch (error) {
      setBarcodeData(null);
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  ////////////////////////////debut sqlite
  const db = SQLite.openDatabase("Test.db");
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);

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
        "CREATE TABLE IF NOT EXISTS presence (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, session TEXT,activite TEXT,categorie TEXT,jour TEXT,present INTEGER,id_pratiquant INTEGER,synced INTEGER);"
      );
      console.log("Table presence créée avec succès");
    } catch (error) {
      console.log("Erreur lors de la création de la table :", error);
    }
  };

  const insertLocalData = async (
    nom,
    session,
    activite,
    categorie,
    jour,
    present,
    id_pratiquant,
    synced
  ) => {
    try {
      await executeSqlAsync(
        "INSERT INTO presence (nom,session,activite,categorie,jour,present,id_pratiquant, synced) VALUES (?, ?,?,?, ?,?, ?,?);",
        [
          nom,
          session,
          activite,
          categorie,
          jour,
          present,
          id_pratiquant,
          synced,
        ]
      );

      setRemarque("");

      setHasUnsyncedData(true);
      alert("Données insérées dans SQLITE avec succès");
    } catch (error) {
      console.log(
        "Erreur lors de l'insertion ou de la vérification des données :",
        error
      );
    }
  };
  ///////////////////////////fin sqlite

  return (
    <SafeAreaView style={tw`bg-black flex-1  p-4`}>
      <ScrollView style={tw`mb-2`}>
        {hiverVisible && (
          <View>
            <TextInput
              name="session"
              value={session}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
          </View>
        )}
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Scan votre code barre
        </Text>
        <BarcodeScannerScreen onScan={handleScan} />
        {barcodeData &&
          barcodeData.nom &&
          barcodeData.Id &&
          barcodeData.activite &&
          barcodeData.categorie && (
            <View>
              <Text style={tw`text-white text-lg font-bold mb-2`}>Nom:</Text>
              <TextInput
                name="nom"
                value={barcodeData.nom}
                editable={false}
                style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Activite:
              </Text>
              <TextInput
                name="activite"
                value={barcodeData.activite}
                editable={false}
                style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Categorie:
              </Text>
              <TextInput
                name="categorie"
                value={barcodeData.categorie}
                editable={false}
                style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
              <TextInput
                name="id_pratiquant"
                value={barcodeData.Id.toString()}
                editable={false}
                style={{ display: "none" }}
                // style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
            </View>
          )}

        <Text style={tw`text-white text-lg font-bold mb-2`}>Jour</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <TextInput
              value={formatDate(date)}
              editable={false}
              style={{ flex: 1, color: "gray" }}
              name="jour"
            />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={{ backgroundColor: "white", color: "black" }}
          />
        )}
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Remarque (facultatif)
        </Text>
        <TextInput
          placeholder="Remarque"
          name="remarque"
          value={remarque}
          onChangeText={(text) => setRemarque(text)}
          style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
        />
        {/* 
        <Text style={tw`text-white text-lg font-bold mb-2`}>Jour</Text>
        <View style={tw`flex-row`}>
          <View style={tw`flex-col mr-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Lundi")}
                onChange={() => updateGroupe("Lundi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Lundi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Mardi")}
                onChange={() => updateGroupe("Mardi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mardi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Mercredi")}
                onChange={() => updateGroupe("Mercredi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mercredi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Jeudi")}
                onChange={() => updateGroupe("Jeudi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Jeudi</Text>
            </View>
          </View>

          <View style={tw`flex-col`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Vendredi")}
                onChange={() => updateGroupe("Vendredi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Vendredi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Samedi")}
                onChange={() => updateGroupe("Samedi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Samedi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="jour"
                checked={groupe.includes("Dimanche")}
                onChange={() => updateGroupe("Dimanche")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Dimanche</Text>
            </View>
          </View>
        </View> */}

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
            onPress={Ajout}
          >
            <FontAwesome5 name="save" size={24} color="white" />
            <Text style={tw`text-white ml-2`}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 py-2 px-4 rounded-md flex-row items-center justify-center`}
          >
            <MaterialIcons name="cancel" size={24} color="white" />
            <Text style={tw`text-white ml-2`}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hiver_Presence;
