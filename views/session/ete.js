import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import tw from "tailwind-react-native-classnames";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { url } from "../url";

import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { Checkbox } from "./checkbox";

////////debut util sur synchronisation de donnees sqlite

const db = SQLite.openDatabase("Test.db");

////////fin util sur synchronisation de donnees sqlite

const Ete_Session = () => {
  const [session] = useState("Ete");
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState(null);

  const [activite, setActivite] = useState("");
  const [sexe, setSexe] = useState("F");
  const [adresse, setAdresse] = useState("");
  const [tel_urgence, setTel_urgence] = useState("");
  const [evaluation, setEvaluation] = useState("NON");
  const [payement, setPayement] = useState("");
  const [carte_payement, setCarte_payement] = useState("");
  const [mode_payement, setMode_payement] = useState("");
  const [telephone, setTelephone] = useState("");
  const [courriel, setCourriel] = useState("");
  const [carte_fede, setCarte_fede] = useState("");
  const [consigne, setConsigne] = useState("");
  const [etiquete, setEtiquete] = useState("");
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [actId, setActId] = useState(null);

  const [eteVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [groupe, setGroupe] = useState([]);
  const updateGroupe = (itemValue) => {
    let updatedGroupe = [...groupe];
    const index = updatedGroupe.indexOf(itemValue);
    if (index > -1) {
      updatedGroupe.splice(index, 1);
    } else {
      updatedGroupe.push(itemValue);
    }
    setGroupe(updatedGroupe);
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (actId) {
      fetchAllData1(actId);
    }
  }, [actId]);

  const fetchAllData = async () => {
    try {
      const res = await url.get("/activite");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllData1 = async (activiteId) => {
    try {
      const res = await url.get(`/categorie/byactivite/${activiteId}`);
      setData1(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleToggleCheckbox = (state, setState, value) => {
    if (state === value) {
      setState("");
    } else {
      setState(value);
    }
  };
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
  const annulEte = async () => {
    setNom("");
    setAdresse("");
    setTel_urgence("");
    setCarte_payement("");
    setMode_payement("");
    setTelephone("");
    setCourriel("");
  };
  const handlePresenceInsertion = async (IdPratiquant) => {
    try {
      if (selectedCategorie) {
        const datedebut = selectedCategorie.datedebut;
        const datefin = selectedCategorie.datefin;

        const startDate = dayjs(datedebut);
        const endDate = dayjs(datefin);

        for (
          let date = startDate;
          date.isBefore(endDate) || date.isSame(endDate);
          date = date.add(1, "day")
        ) {
          try {
            const presencePayload = {
              nom,
              session,
              activite,
              categorie,
              jour: date.format("YYYY-MM-DD"),
              id_pratiquant: IdPratiquant,
            };

            console.log("Presence payload being sent:", presencePayload);

            await url.post("/presence", presencePayload);
          } catch (error) {
            console.error(
              "Erreur lors de l'insertion des données de présence :",
              error.response ? error.response.data : error
            );
          }
        }
      } else {
        console.error(
          "Aucune catégorie sélectionnée pour insérer les données de présence"
        );
      }
    } catch (error) {
      console.error(
        "Erreur générale lors de l'insertion des présences :",
        error
      );
    }
  };

  const insertLocalPractitioner = async () => {
    await insertLocalData(
      session,
      nom,
      sexe,
      formatDate(date),
      payement,
      consigne,
      carte_fede,
      etiquete,
      courriel,
      adresse,
      telephone,
      tel_urgence,
      activite,
      categorie,
      evaluation,
      mode_payement,
      carte_payement,
      groupe,
      0
    );
  };
  const ajoutEte = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const response = await url.post("/pratiquants", {
            session,
            nom,
            sexe,
            naissance: formatDate(date),
            payement,
            consigne,
            carte_fede,
            etiquete,
            courriel,
            adresse,
            telephone,
            tel_urgence,
            activite,
            categorie,
            evaluation,
            mode_payement,
            carte_payement,
            groupe,
          });

          const newPratiquants = response.data;
          console.log("Réponse de l'API :", newPratiquants);

          if (
            newPratiquants &&
            newPratiquants.message &&
            newPratiquants.pratiquant &&
            newPratiquants.pratiquant.id
          ) {
            console.log("Message de l'API :", newPratiquants.message);
            console.log(
              "ID du nouveau pratiquant :",
              newPratiquants.pratiquant.id
            );

            setNom("");
            setAdresse("");
            setTel_urgence("");
            setCarte_payement("");
            setMode_payement("");
            setTelephone("");
            setCourriel("");

            alert(newPratiquants.message);

            await handlePresenceInsertion(newPratiquants.pratiquant.id);
          } else {
            console.error("Réponse de l'API invalide :", newPratiquants);
          }
        } catch (error) {
          console.error(
            "Erreur lors de l'insertion des données dans MySQL :",
            error
          );

          await insertLocalPractitioner();
        }
      } else {
        console.log(
          "Pas de connexion Internet. Insertion des données localement."
        );

        await insertLocalPractitioner();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );

      await insertLocalPractitioner();
    }
  };

  ///////////////////////////////////////////////////Debut sqlite
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);
  useEffect(() => {
    initializeDatabase();
    const intervalId = setInterval(() => {
      if (hasUnsyncedData) {
        // syncData();
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
        `CREATE TABLE IF NOT EXISTS session (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session TEXT,
          nom TEXT,
          sexe TEXT,
          naissance TEXT,
          payement TEXT,
          consigne TEXT,
          carte_fede TEXT,
          etiquete TEXT,
          courriel TEXT,
          adresse TEXT,
          telephone TEXT,
          tel_urgence TEXT,
          activite TEXT,
          categorie TEXT,
          evaluation TEXT,
          mode_payement TEXT,
          groupe TEXT,
          synced INTEGER
        );`
      );

      console.log("Table créée avec succès");
      fetchAllData();
    } catch (error) {
      if (!error.message.includes("duplicate column name: synced")) {
        console.log(
          "Erreur lors de la création de la table ou ajout de colonne :",
          error
        );
      } else {
        console.log("La colonne 'synced' existe déjà.");
      }
    }
  };

  const insertLocalData = async (
    session,
    nom,
    sexe,
    naissance,
    payement,
    consigne,
    carte_fede,
    etiquete,
    courriel,
    adresse,
    telephone,
    tel_urgence,
    activite,
    categorie,
    evaluation,
    mode_payement,
    groupe,
    synced
  ) => {
    try {
      await executeSqlAsync(
        "INSERT INTO session (session,nom,sexe,naissance,payement,consigne,carte_fede,etiquete,courriel,adresse,telephone,tel_urgence,activite,categorie,evaluation,mode_payement,groupe,synced) VALUES (?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?);",
        [
          session,
          nom,
          sexe,
          naissance,
          payement,
          consigne,
          carte_fede,
          etiquete,
          courriel,
          adresse,
          telephone,
          tel_urgence,
          activite,
          categorie,
          evaluation,
          mode_payement,
          groupe,
          synced,
        ]
      );
      fetchAllData();
      setNom("");
      setSexe("");
      setPayement("");
      setConsigne("");
      setCarte_fede("");
      setEtiquete("");
      setCourriel("");
      setAdresse("");
      setTelephone("");
      setTel_urgence("");
      setActivite("");
      setCategorie("");
      setEvaluation("");
      setMode_payement("");
      setCarte_payement("");
      setGroupe("");
      setHasUnsyncedData(true);
      alert("Données insérées avec succès");
    } catch (error) {
      console.log(
        "Erreur lors de l'insertion ou de la vérification des données :",
        error
      );
    }
  };

  ///////////////////////////////////////////////////Fin sqlite
  return (
    <SafeAreaView style={tw`bg-black flex-1  p-4`}>
      <ScrollView style={tw`mb-2`}>
        {eteVisible && (
          <TextInput
            name="session"
            value={session}
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />
        )}

        <Text style={tw`text-white text-lg font-bold mb-2`}>Nom</Text>
        <TextInput
          placeholderTextColor="gray"
          placeholder="Nom"
          name="nom"
          value={nom}
          onChangeText={(t) => setNom(t)}
          style={tw` bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />

        <Text style={tw`text-white text-lg font-bold mb-2`}>Sexe</Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={sexe}
            onValueChange={(itemValue, itemIndex) => setSexe(itemValue)}
            style={{ color: "gray" }}
            name="sexe"
          >
            <Picker.Item label="F" value="F" />
            <Picker.Item label="M" value="M" />
          </Picker>
        </View>

        <Text style={tw`text-white text-lg font-bold mb-2`}>Naissance</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <TextInput
              value={formatDate(date)}
              editable={false}
              style={{ flex: 1, color: "gray" }}
              name="naissance"
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
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`flex-col`}>
            <View style={tw`flex-row`}>
              <Checkbox
                name="payement"
                checked={payement.includes("Payement")}
                onChange={() =>
                  handleToggleCheckbox(payement, setPayement, "Payement")
                }
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Payement
              </Text>
            </View>

            <View style={tw`flex-row`}>
              <Checkbox
                name="carte_fede"
                checked={carte_fede.includes("Carte Fédé")}
                onChange={() =>
                  handleToggleCheckbox(carte_fede, setCarte_fede, "Carte Fédé")
                }
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Carte Fédé
              </Text>
            </View>
          </View>
          <View style={tw`flex-col ml-4`}>
            <View style={tw`flex-row`}>
              <Checkbox
                name="consigne"
                checked={consigne.includes("Consigne")}
                onChange={() =>
                  handleToggleCheckbox(consigne, setConsigne, "Consigne")
                }
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Consigne
              </Text>
            </View>
            <View style={tw`flex-row`}>
              <Checkbox
                name="etiquete"
                checked={etiquete.includes("Etiquete")}
                onChange={() =>
                  handleToggleCheckbox(etiquete, setEtiquete, "Etiquete")
                }
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Etiquete
              </Text>
            </View>
          </View>
        </View>

        <Text style={tw`text-white text-lg font-bold mb-2`}>Courriel</Text>
        <TextInput
          name="courriel"
          placeholderTextColor="gray"
          placeholder="Courriel"
          value={courriel}
          onChangeText={(t) => setCourriel(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>Adresse</Text>
        <TextInput
          name="adresse"
          placeholderTextColor="gray"
          value={adresse}
          onChangeText={(t) => setAdresse(t)}
          placeholder="Adresse"
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>Telephone</Text>
        <TextInput
          name="telephone"
          placeholderTextColor="gray"
          placeholder="Telephone"
          value={telephone}
          onChangeText={(t) => setTelephone(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />

        <Text style={tw`text-white text-lg font-bold mb-2`}>
          En cas d'urgence
        </Text>
        <TextInput
          name="tel_urgence"
          placeholderTextColor="gray"
          placeholder="Numero en cas d'urgence"
          value={tel_urgence}
          onChangeText={(t) => setTel_urgence(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />

        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Choisissez votre activité
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={activite}
            onValueChange={(itemValue, itemIndex) => {
              setActivite(itemValue);
              const selectedActivity = data.find(
                (item) => item.nom === itemValue
              );
              setActId(selectedActivity ? selectedActivity.id : null);
            }}
            style={{ color: "gray" }}
            name="activite"
          >
            {data.map((item) => (
              <Picker.Item key={item.id} label={item.nom} value={item.nom} />
            ))}
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Dans quelle catégorie avez-vous joué auparavant ?
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={categorie}
            onValueChange={(itemValue, itemIndex) => {
              setCategorie(itemValue);
              const selectedCat = data1.find(
                (item) => item.categorie === itemValue
              );
              setSelectedCategorie(selectedCat);
            }}
            style={{ color: "gray" }}
            name="categorie"
          >
            {data1.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.categorie}
                value={item.categorie}
              />
            ))}
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>Evaluation</Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={evaluation}
            onValueChange={(itemValue, itemIndex) => setEvaluation(itemValue)}
            style={{ color: "gray" }}
            name="evaluation"
          >
            <Picker.Item label="NON" value="NON" />
            <Picker.Item label="OUI" value="OUI" />
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Mode de payement
        </Text>
        <TextInput
          name="mode_payement"
          value={mode_payement}
          onChangeText={(t) => setMode_payement(t)}
          placeholderTextColor="gray"
          placeholder="Mode de payement"
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Carte bancaire
        </Text>
        <TextInput
          name="carte_payement"
          placeholderTextColor="gray"
          placeholder="Carte bancaire"
          value={carte_payement}
          onChangeText={(t) => setCarte_payement(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>Groupe</Text>
        <View>
          <View style={tw`flex-row items-center mb-2`}>
            <Checkbox
              name="groupe"
              checked={groupe.includes("Jour")}
              onChange={() => updateGroupe("Jour")}
            />
            <Text style={tw`text-white text-lg ml-2`}>Jour</Text>
          </View>
          <View style={tw`flex-row items-center mb-2`}>
            <Checkbox
              name="groupe"
              checked={groupe.includes("Nuit")}
              onChange={() => updateGroupe("Nuit")}
            />
            <Text style={tw`text-white text-lg ml-2`}>Nuit</Text>
          </View>
          <View style={tw`flex-row items-center mb-2`}>
            <Checkbox
              name="groupe"
              checked={groupe.includes("Mixte")}
              onChange={() => updateGroupe("Mixte")}
            />
            <Text style={tw`text-white text-lg ml-2`}>Mixte</Text>
          </View>
          <View style={tw`flex-row items-center mb-2`}>
            <Checkbox
              name="groupe"
              checked={groupe.includes("Weekend")}
              onChange={() => updateGroupe("Weekend")}
            />
            <Text style={tw`text-white text-lg ml-2`}>Weekend</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            onPress={ajoutEte}
            style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
          >
            <FontAwesome5 name="save" size={24} color="white" />
            <Text style={tw`text-white ml-2`}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={annulEte}
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

export default Ete_Session;
