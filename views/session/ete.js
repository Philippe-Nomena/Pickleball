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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { Checkbox } from "./checkbox";

////////debut util sur synchronisation de donnees sqlite

const db = SQLite.openDatabase("Test.db");

////////fin util sur synchronisation de donnees sqlite

const Ete_Session = () => {
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [session, setSession] = useState("");
  const [activite, setActivite] = useState("");
  const [idactivite, setidActivite] = useState("");
  const [idcategorie, setidCategorie] = useState("");

  const [sexe, setSexe] = useState("F");
  const [adresse, setAdresse] = useState("");
  const [tel_urgence, setTel_urgence] = useState("");
  const [evaluation, setEvaluation] = useState("NON");

  const [mode_payement, setMode_payement] = useState("");
  const [telephone, setTelephone] = useState("");
  const [courriel, setCourriel] = useState("");
  // const [carte_fede, setCarte_fede] = useState("");
  // const [consigne, setConsigne] = useState("");
  // const [etiquete, setEtiquete] = useState("");
  // const [payement, setPayement] = useState("");
  const [carte_fede, setCarte_fede] = useState(false);
  const [consigne, setConsigne] = useState(false);
  const [etiquete, setEtiquete] = useState(false);
  const [payement, setPayement] = useState(false);

  const [carte_payement, setCarte_payement] = useState("");
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [actId, setActId] = useState(null);

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
    fetchAllData2();
  }, []);
  useEffect(() => {
    console.log("Updated idactivite:", idactivite);
  }, [idactivite]);

  useEffect(() => {
    console.log("Updated idcategorie:", idcategorie);
  }, [idcategorie]);
  useEffect(() => {
    if (actId) {
      fetchAllData1(actId);
    }
  }, [actId]);

  const fetchAllData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const res = await url.get("/activite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : error.message;
      console.error("Error fetching data:", errorMessage);
      alert("Error fetching data: " + errorMessage);
    }
  };

  const fetchAllData1 = async (activiteId) => {
    if (!activiteId) {
      console.error("L'ID d'activité est requis pour récupérer les données.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const res = await url.get(`/categorie/byactivite/${activiteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData1(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      Alert.alert("Erreur lors de la récupération des données", error.message);
    }
  };

  const fetchAllData2 = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const res = await url.get("/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData2(res.data);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : error.message;
      console.error("Error fetching data:", errorMessage);
      alert("Error fetching data: " + errorMessage);
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
            const token = await AsyncStorage.getItem("token");

            if (!token) {
              throw new Error("Token not found");
            }

            const presencePayload = {
              nom,
              id_session: session,
              id_activite: idactivite,
              id_categorie: idcategorie,
              jour: date.format("YYYY-MM-DD"),
              id_pratiquant: IdPratiquant,
            };

            await url.post("/presence", presencePayload, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            const errorMessage = error.response
              ? error.response.data.message || error.response.data
              : error.message;

            console.error(
              "Erreur lors de l'insertion des données de présence :",
              errorMessage
            );
            alert(
              "Erreur lors de l'insertion des données de présence : " +
                errorMessage
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
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.post(
            "/pratiquants",
            {
              id_session: session,
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
              id_activite: idactivite,
              id_categorie: idcategorie,
              evaluation,
              mode_payement,
              carte_payement,
              groupe,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const newPratiquants = response.data;

          if (
            newPratiquants &&
            newPratiquants.message &&
            newPratiquants.pratiquant &&
            newPratiquants.pratiquant.id
          ) {
            // console.log("Message de l'API :", newPratiquants.message);
            // console.log(
            //   "ID du nouveau pratiquant :",
            //   newPratiquants.pratiquant.id
            // );

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
      setPayement(false);
      setCarte_fede(false);
      setConsigne(false);
      setEtiquete(false);
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
        <Text style={tw`text-white text-lg font-bold mb-2`}>Session</Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={session}
            onValueChange={(itemValue) => {
              setSession(itemValue);
              console.log(itemValue);
            }}
            style={{ color: "gray" }}
            name="session"
          >
            {data2.map((item) => (
              <Picker.Item key={item.id} label={item.nom} value={item.id} />
            ))}
          </Picker>
        </View>
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
            onValueChange={(itemValue) => setSexe(itemValue)}
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
              {/* <Checkbox
                name="payement"
                checked={payement.includes("Oui")}
                onChange={() =>
                  handleToggleCheckbox(payement, setPayement, "Oui")
                }
              /> */}
              <Checkbox
                name="payement"
                checked={payement}
                onChange={() => setPayement(!payement)}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Payement
              </Text>
            </View>

            <View style={tw`flex-row`}>
              {/* <Checkbox
                name="carte_fede"
                checked={carte_fede.includes("Oui")}
                onChange={() =>
                  handleToggleCheckbox(carte_fede, setCarte_fede, "Oui")
                }
              /> */}
              <Checkbox
                name="carte_fede"
                checked={carte_fede}
                onChange={() => setCarte_fede(!carte_fede)}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Carte Fédé
              </Text>
            </View>
          </View>
          <View style={tw`flex-col ml-4`}>
            <View style={tw`flex-row`}>
              {/* <Checkbox
                name="consigne"
                checked={consigne.includes("Oui")}
                onChange={() =>
                  handleToggleCheckbox(consigne, setConsigne, "Oui")
                }
              /> */}
              <Checkbox
                name="consigne"
                checked={consigne}
                onChange={() => setConsigne(!consigne)}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Consigne
              </Text>
            </View>
            <View style={tw`flex-row`}>
              {/* <Checkbox
                name="etiquete"
                checked={etiquete.includes("Oui")}
                onChange={() =>
                  handleToggleCheckbox(etiquete, setEtiquete, "Oui")
                }
              /> */}
              <Checkbox
                name="etiquete"
                checked={etiquete}
                onChange={() => setEtiquete(!etiquete)}
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
            onValueChange={(itemValue) => {
              const selectedActivity = data.find(
                (item) => item.nom === itemValue
              );
              if (selectedActivity) {
                setidActivite(selectedActivity.id);
              }
              setActId(selectedActivity ? selectedActivity.id : null);
            }}
            style={{ color: "gray" }}
            name="activite"
          >
            {data.map((item) => (
              <Picker.Item key={item.id} label={item.nom} value={item.nom} />
            ))}
          </Picker>

          {/* <Picker
            selectedValue={activite}
            onValueChange={(itemValue) => {
              setActivite(itemValue);
              const selectedActivity = data.find(
                (item) => item.nom === itemValue
              );
              setActId(selectedActivity ? selectedActivity.id : null);
            }}
            style={{ color: "gray" }}
            name="activite"
          >
            {data.length > 0 ? (
              data.map((item) => (
                <Picker.Item key={item.id} label={item.nom} value={item.nom} />
              ))
            ) : (
              <Picker.Item label="No activities available" value={null} />
            )}
          </Picker> */}
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Dans quelle catégorie avez-vous joué auparavant ?
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={categorie}
            onValueChange={(itemValue) => {
              setCategorie(itemValue);

              const selectedCat = data1.find(
                (item) => item.categorie === itemValue
              );
              if (selectedCat) {
                setidCategorie(selectedCat.id);
                console.log("idcategorie", selectedCat.id);
              }
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
          {/* <Picker
            selectedValue={categorie}
            onValueChange={(itemValue) => {
              setCategorie(itemValue);
            }}
            style={{ color: "gray" }}
            name="categorie"
          >
            {data1.length > 0 ? (
              data1.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.categorie}
                  value={item.categorie}
                />
              ))
            ) : (
              <Picker.Item label="No categories available" value={null} />
            )}
          </Picker> */}
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
