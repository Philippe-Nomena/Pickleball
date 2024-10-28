import React, { useState, useEffect, act } from "react";
import tw from "tailwind-react-native-classnames";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Checkbox } from "./checkbox";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import BarcodeScannerScreen from "./qrcode";
import { url } from "../url";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import dayjs from "dayjs";

const Ete_Presence = () => {
  const [nom, setNom] = useState("");
  const [session, setSession] = useState("");
  const [remarque, setRemarque] = useState("");
  const [activite, setActivite] = useState("");
  const [idActivite, setIdActivite] = useState("");
  const [idSession, setIdSession] = useState("");
  const [idCategorie, setIdCategorie] = useState("");
  const [categorie, setCategorie] = useState("");
  const [groupe, setGroupe] = useState(["Lundi"]);
  const [id_pratiquant, setId_pratiquant] = useState("");
  const [barcodeData, setBarcodeData] = useState(null);
  const [eteVisible] = useState(false);
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
              id_session: idSession,
              id_activite: idActivite,
              jour: formatDate(date),
              present,
              absence,
              id_categorie: idCategorie,
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

      const getNom = await url.get(`/pratiquants/ete/${data}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (getNom) {
        const nom = getNom.data.nom;
        const Id = getNom.data.id;
        const activite = getNom.data.activite.nom;
        const categorie = getNom.data.categorie.categorie;
        const idActivite = getNom.data.id_activite;
        const idCategorie = getNom.data.id_categorie;
        const session = getNom.data.session.nom;
        const idSession = getNom.data.id_session;
        setBarcodeData({ nom, Id, activite, categorie, session });
        setNom(nom);
        setActivite(activite);
        setCategorie(categorie);
        setSession(session);
        setIdSession(idSession);
        setIdActivite(idActivite);
        setIdCategorie(idCategorie);
        setId_pratiquant(Id.toString());
        console.log("ito pr", getNom.data);
      } else {
        setBarcodeData(null);
        console.error("Pratiquant data not found or invalid response");
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
        {eteVisible && (
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
          barcodeData.session &&
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
                name="id_activite"
                value={barcodeData.activite.toString()}
                editable={false}
                style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Categorie:
              </Text>
              <TextInput
                name="id_Categorie"
                value={barcodeData.categorie.toString()}
                editable={false}
                style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-2`}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Session:
              </Text>
              <TextInput
                name="id_session"
                value={barcodeData.session.toString()}
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

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
            onPress={Ajout}
          >
            <Entypo name="save" size={24} color="white" />
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

export default Ete_Presence;
