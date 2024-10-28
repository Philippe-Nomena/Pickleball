import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "../session/checkbox";
import tw from "tailwind-react-native-classnames";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";

import * as Sharing from "expo-sharing";
import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";
import { url } from "../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
////////debut util sur synchronisation de donnees sqlite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("Test.db");
import NetInfo from "@react-native-community/netinfo";
////////fin util sur synchronisation de donnees sqlite
const Ete_liste = () => {
  const [data, setData] = useState([]);
  const [data0, setData0] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [presence, setPresence] = useState([]);
  const [actId, setActId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [presenceModalVisible, setPresenceModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState("");
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState(null);
  const [activite, setActivite] = useState(null);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [sexe, setSexe] = useState("F");
  const [adresse, setAdresse] = useState("");
  const [tel_urgence, setTel_urgence] = useState("");
  const [evaluation, setEvaluation] = useState("NON");
  const [groupe, setGroupe] = useState([]);
  const [payement, setPayement] = useState([]);
  const [carte_payement, setCarte_payement] = useState("");
  const [mode_payement, setMode_payement] = useState("");
  const [telephone, setTelephone] = useState("");
  const [courriel, setCourriel] = useState("");
  const [carte_fede, setCarte_fede] = useState([]);
  const [consigne, setConsigne] = useState([]);
  const [etiquete, setEtiquete] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const filteredSelected = selectedActivite
    ? data0.filter((item) => item.id === selectedActivite)
    : data0;
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
  const handleToggleCheckbox = (state, setState, value) => {
    if (state === value) {
      setState("");
    } else {
      setState(value);
    }
  };
  useEffect(() => {
    fetchAllData();
    fetchAllData3();
    fetchAllData4();
    fetchAllData6();
  }, []);
  useEffect(() => {
    fetchPresence();
  }, []);
  useEffect(() => {
    fetchAllData0();
  }, []);
  useEffect(() => {
    fetchAllData2();
  }, []);
  useEffect(() => {
    if (actId) {
      fetchAllData1(actId);
    }
  }, [actId]);
  useEffect(() => {
    if (selectedActivite) {
      fetchAllData5(selectedActivite);
    }
  }, [selectedActivite]);

  //display all pratiquants in ete session
  const fetchAllData = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.get(`/pratiquants/ete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const donnees = response.data.pratiquants;

          setData(donnees);
          setUsers([]);
          checkUnsyncedData();
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des données de MySQL :",
            error
          );
          fetchSession();
        }
      } else {
        fetchSession();
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
      fetchSession();
    }
  };
  //display all activite

  const fetchAllData0 = async () => {
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

      setData0(res.data);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : error.message;
      console.error("Error fetching data:", errorMessage);
      alert("Error fetching data: " + errorMessage);
    }
  };
  //display all categorie by the activite selected

  const fetchAllData1 = async (activiteId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await url.get(`/categorie/byactivite/${activiteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData1(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      alert("Error fetching categories: " + error.message);
    }
  };

  //display all session

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
  //display all pratiquants in hiver session

  const fetchAllData3 = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.get(`/pratiquants/hiver`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("liste d'hiver", response.data.pratiquants);
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des données de MySQL :",
            error
          );
        }
      } else {
        console.log("Il y a un erreur");
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
    }
  };

  //display all pratiquants in automne session

  const fetchAllData4 = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.get(`/pratiquants/automne`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("liste d'automne", response.data.pratiquants);
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des données de MySQL :",
            error
          );
        }
      } else {
        console.log("Il y a un erreur");
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
    }
  };

  //filter all pratiquants by the activite selected

  const fetchAllData5 = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const res = await url.get(`/pratiquants/selected/${selectedActivite}`, {
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

  //display all pratiquants in printemps session

  const fetchAllData6 = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            throw new Error("Token not found");
          }

          const response = await url.get(`/pratiquants/printemps`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("liste de printemps", response.data.pratiquants);
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des données de MySQL :",
            error
          );
        }
      } else {
        console.log("Il y a un erreur");
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération de l'état du réseau :",
        error
      );
    }
  };
  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };
  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const handlePresence = (item) => {
    setPresenceModalVisible(true);
    fetchPresence(item.id);
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

  //fetch all presence by the pratiquant selected

  const fetchPresence = async (id_pratiquant) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const presence = await url.get(
        `/presence/bypratiquant/${id_pratiquant}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPresence(presence.data);
    } catch (error) {
      console.error("Error presence item:", error);
      Alert.alert("Error presence item", error.message);
    }
  };

  //Edited pratiquant by id

  const saveEditedItem = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const edit = await url.put(
        `pratiquants/${editedItem.id}`,
        {
          session,
          nom,
          sexe,
          naissance: formatDate(date),
          payement,
          consigne,
          carte_fede: carte_fede,
          etiquete,
          courriel,
          adresse,
          telephone,
          tel_urgence: tel_urgence,
          activite,
          categorie,
          evaluation,
          mode_payement: mode_payement,
          carte_payement: carte_payement,
          groupe,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (edit) {
        setNom("");
        setAdresse("");
        setTel_urgence("");
        setCarte_payement("");
        setMode_payement("");
        setTelephone("");
        setCourriel("");
        setModalVisible(false);
        alert("Edit réussi");
        fetchAllData();
      }
    } catch (error) {
      console.error("Error editing item:", error);
      Alert.alert("Error editing item", error.message);
    }
  };
  //delete pratiquant by id
  const confirmDeleteItem = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      await url.delete(`/pratiquants/${itemToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteModalVisible(false);
      fetchAllData();
      Alert.alert("Suppression de pratiquants réussi");
    } catch (error) {
      console.error("Error de suppression item:", error);
      Alert.alert("Error suppression item", error.message);
    }
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
        style={tw`bg-red-500 p-2 h-10 mr-1 rounded-md`}
        onPress={() => handleDelete(item)}
      >
        <Entypo name="trash" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-gray-500 p-2 h-10 rounded-md`}
        onPress={() => handlePresence(item)}
      >
        <MaterialIcons name="co-present" size={24} color="white" />
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
            {/* <Text style={tw`text-lg text-white mr-4`}>{item.id}</Text> */}
            {/* {item.barcodeUrl && (
              <Image
                source={{ uri: item.barcodeUrl }}
                style={tw`w-40 h-10 mr-1`}
              />
            )} */}
            <Text style={tw`text-lg text-white`}>{item.nom}</Text>
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
      </Swipeable>
    );
  };

  const listePresence = ({ item }) => (
    <View style={tw`flex-row items-center justify-between py-2`}>
      <Text
        style={[tw`text-white text-lg font-bold text-center`, { width: 100 }]}
      >
        {item.pratiquant.nom}
      </Text>
      <Text style={[tw`text-lg text-white text-center`, { width: 80 }]}>
        {item.categorie.categorie}
      </Text>
      <Text style={[tw`text-lg text-white text-center`, { width: 110 }]}>
        {item.jour}
      </Text>
      <Text style={[tw`text-white text-center`, { width: 80 }]}>
        {item.present ? "Présent" : "Absent"}
      </Text>
    </View>
  );

  const PasdelistePresence = () => (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-lg text-white`}>Pas de données</Text>
    </View>
  );
  const renderHeader = () => (
    <View
      style={tw`flex-row items-center justify-between py-2 border-b border-gray-600`}
    >
      <Text style={tw`text-white text-lg font-bold`}>Nom</Text>
      <Text style={tw`text-white text-lg font-bold`}>Catégorie</Text>
      <Text style={tw`text-white text-lg font-bold`}>Date</Text>
      <Text style={tw`text-white text-lg font-bold`}>Statut</Text>
    </View>
  );

  //Exportation of the data on the pdf file
  const handleExport = async () => {
    try {
      const htmlContent = `
        <h1>Liste de Présence</h1>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
          ${presence
            .map(
              (item) => `
            <tr>
              <td>${item.pratiquant.nom}</td>
              <td>${item.categorie.categorie}</td>
              <td>${item.jour}</td>
              <td>${item.present ? "Présent" : "Absent"}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      `;

      // Créer le fichier PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      console.log("PDF file created at: ", uri);

      // Utiliser expo-sharing pour ouvrir le fichier
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on this device"
        );
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      Alert.alert("Error", "Failed to export PDF");
    }
  };
  const handleEdit = async (item) => {
    setEditedItem(item);
    setNom(item.nom);
    setSession(item.session);
    setSexe(item.sexe);
    setDate(new Date(item.naissance));
    setCourriel(item.courriel);
    setAdresse(item.adresse);
    setTelephone(item.telephone);
    setTel_urgence(item.tel_urgence);
    setActivite(item.activite);
    const activityId = item.activite.id;
    if (activityId) {
      const categories = await fetchAllData1(activityId);
      if (categories && Array.isArray(categories)) {
        const categoryNames = categories.map((cat) => cat.categorie);
        setCategorie(categoryNames);
      } else {
        setCategorie(null);
        console.log("Categorie: null");
      }
    } else {
      setCategorie(null);
      console.log("Categorie: null");
    }
    setEvaluation(item.evaluation);
    setMode_payement(item.mode_payement);
    setCarte_payement(item.carte_payement);
    setModalVisible(true);
  };

  const [users, setUsers] = useState([]);
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);

  // const dataToRender = (data.length > 0 ? data : users) || [];
  // const filteredData = () => {
  //   dataToRender.filter((item) =>
  //     item.nom.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };

  const filteredData = () =>
    data.filter((item) =>
      item.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

  ///////////////////////////debut sqlite

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

  const fetchSession = async () => {
    try {
      const results = await executeSqlAsync(
        "SELECT * FROM session where session='Ete' ;"
      );
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
        "SELECT * FROM session WHERE synced = 0;"
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
  ///////////////////////////fin sqlite

  return (
    <View>
      <View style={tw`bg-black p-2 flex-row items-center justify-between`}>
        <TouchableOpacity style={tw`p-2`}>
          <AntDesign name="search1" size={18} color="white" />
        </TouchableOpacity>
        <TextInput
          style={tw`flex-1 border-b border-white text-white p-2`}
          placeholder="chercher..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          placeholderTextColor="white"
        />

        <View style={tw`bg-black border`}>
          <Picker
            selectedValue={selectedActivite}
            onValueChange={(itemValue) => {
              setSelectedActivite(itemValue);
            }}
            style={{ color: "white", width: 180 }}
          >
            <Picker.Item label="Filtrer" value={null} />
            {data0.map((item) => (
              <Picker.Item key={item.id} label={item.nom} value={item.id} />
            ))}
          </Picker>
        </View>
      </View>

      <FlatList
        style={tw`mt-1`}
        data={filteredData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={tw`bg-black flex-1 p-4`}>
          <ScrollView style={tw`mb-2 flex-1  bg-gray-800 bg-opacity-50`}>
            <Text style={tw`text-white text-lg font-bold mb-2 text-center`}>
              Editer l'information de pratiquants
            </Text>
            <Text style={tw`text-white text-lg font-bold mb-2`}>Session</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                selectedValue={session}
                onValueChange={(itemValue, itemIndex) => {
                  setSession(itemValue);
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
              onChangeText={setNom}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />

            <Text style={tw`text-white text-lg font-bold mb-2`}>Sexe</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                selectedValue={sexe}
                onValueChange={setSexe}
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
                      handleToggleCheckbox(
                        carte_fede,
                        setCarte_fede,
                        "Carte Fédé"
                      )
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
              onChangeText={setCourriel}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
            <Text style={tw`text-white text-lg font-bold mb-2`}>Adresse</Text>
            <TextInput
              name="adresse"
              placeholderTextColor="gray"
              value={adresse}
              onChangeText={setAdresse}
              placeholder="Adresse"
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
            <Text style={tw`text-white text-lg font-bold mb-2`}>Telephone</Text>
            <TextInput
              name="telephone"
              placeholderTextColor="gray"
              placeholder="Telephone"
              value={telephone}
              onChangeText={setTelephone}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
            <Text style={tw`text-white text-lg font-bold mb-2`}>
              Telephone d'urgence
            </Text>
            <TextInput
              name="tel_urgence"
              placeholderTextColor="gray"
              value={tel_urgence}
              onChangeText={setTel_urgence}
              placeholder="Telephone d'urgence"
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
            <Text style={tw`text-white text-lg font-bold mb-2`}>Activité</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                selectedValue={activite}
                onValueChange={(itemValue) => {
                  setActivite(itemValue);
                  const selectedActivity = data0.find(
                    (item) => item.nom === itemValue
                  );
                  setActId(selectedActivity ? selectedActivity.id : null);
                }}
                style={{ color: "gray" }}
                name="activite"
              >
                {data0.length > 0 ? (
                  data0.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.nom}
                      value={item.nom}
                    />
                  ))
                ) : (
                  <Picker.Item label="No activities available" value={null} />
                )}
              </Picker>
            </View>

            <Text style={tw`text-white text-lg font-bold mb-2`}>Catégorie</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
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
              </Picker>
            </View>

            <Text style={tw`text-white text-lg font-bold mb-2`}>Groupe</Text>
            <View style={tw`flex-row items-center `}>
              <View style={tw`flex-row items-center mb-2 mr-2`}>
                <Checkbox
                  name="groupe"
                  checked={groupe.includes("Jour")}
                  onChange={() => updateGroupe("Jour")}
                />
                <Text style={tw`text-white text-lg ml-1`}>Jour</Text>
              </View>
              <View style={tw`flex-row items-center mb-2 mr-2`}>
                <Checkbox
                  name="groupe"
                  checked={groupe.includes("Nuit")}
                  onChange={() => updateGroupe("Nuit")}
                />
                <Text style={tw`text-white text-lg ml-1`}>Nuit</Text>
              </View>
              <View style={tw`flex-row items-center mb-2 mr-2`}>
                <Checkbox
                  name="groupe"
                  checked={groupe.includes("Mixte")}
                  onChange={() => updateGroupe("Mixte")}
                />
                <Text style={tw`text-white text-lg ml-1`}>Mixte</Text>
              </View>
              <View style={tw`flex-row items-center mb-2 mr-2`}>
                <Checkbox
                  name="groupe"
                  checked={groupe.includes("Weekend")}
                  onChange={() => updateGroupe("Weekend")}
                />
                <Text style={tw`text-white text-lg ml-1`}>Weekend</Text>
              </View>
            </View>

            <Text style={tw`text-white text-lg font-bold mb-2`}>
              Evaluation
            </Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                selectedValue={evaluation}
                onValueChange={setEvaluation}
                style={{ color: "gray" }}
                name="evaluation"
              >
                <Picker.Item label="OUI" value="OUI" />
                <Picker.Item label="NON" value="NON" />
              </Picker>
            </View>
            <Text style={tw`text-white text-lg font-bold mb-2`}>
              Mode Payement
            </Text>
            <TextInput
              name="mode_payement"
              placeholderTextColor="gray"
              value={mode_payement}
              onChangeText={setMode_payement}
              placeholder="Mode Payement"
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />

            <Text style={tw`text-white text-lg font-bold mb-2`}>
              Carte Payement
            </Text>
            <TextInput
              name="carte_payement"
              placeholderTextColor="gray"
              placeholder="Carte Payement"
              value={carte_payement}
              onChangeText={setCarte_payement}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
          </ScrollView>
          <View style={tw`flex-row justify-center `}>
            <TouchableOpacity
              onPress={saveEditedItem}
              style={tw`bg-blue-500 p-2 rounded-md flex flex-row items-center justify-center mr-4 `}
            >
              <FontAwesome5 name="user-plus" size={24} color="white" />
              <Text style={tw`text-white font-bold text-lg ml-2`}>Editer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`bg-red-500 p-2 rounded-md flex-row items-center justify-center`}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
              <Text style={tw`text-white ml-2`}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700  p-4 rounded-md`}>
            {itemToDelete && (
              <Text style={tw`text-lg mb-2 text-white`}>
                Etes-vous sur de supprimer {itemToDelete.nom} ?
              </Text>
            )}

            <View style={tw`flex-row justify-center`}>
              <TouchableOpacity
                style={tw`bg-red-500 p-2 rounded-md mr-5 flex-row`}
                onPress={confirmDeleteItem}
              >
                <Entypo name="trash" size={20} color="white" />

                <Text style={tw`text-white text-center ml-1`}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-500 p-2 rounded-md flex-row`}
                onPress={() => setDeleteModalVisible(false)}
              >
                <MaterialIcons name="cancel" size={20} color="white" />
                <Text style={tw`text-white text-center ml-1`}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={presenceModalVisible}
        onRequestClose={() => {
          setPresenceModalVisible(!presenceModalVisible);
        }}
      >
        <View style={tw`bg-gray-800 p-2 rounded-md shadow-md justify-center `}>
          <Text style={tw`text-white text-lg font-bold mb-4 text-center`}>
            Liste de Présence
          </Text>
          <FlatList
            data={presence}
            renderItem={listePresence}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={PasdelistePresence}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={tw`flex-row justify-center mt-4`}>
            <TouchableOpacity
              style={tw`bg-red-500 p-2 rounded-md flex-row items-center justify-center mr-3`}
              onPress={() => setPresenceModalVisible(false)}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
              <Text style={tw`text-white text-lg ml-1`}>Fermer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-green-500 p-2 rounded-md flex-row items-center justify-center`}
              onPress={handleExport}
            >
              <MaterialIcons name="download" size={24} color="white" />
              <Text style={tw`text-white text-lg ml-1`}>Exporter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Ete_liste;
