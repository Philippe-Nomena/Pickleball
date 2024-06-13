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
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "../session/checkbox";
import tw from "tailwind-react-native-classnames";
import DateTimePicker from "@react-native-community/datetimepicker";

import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";
import { url } from "../url";
const Hiver_liste = () => {
  const [data, setData] = useState([]);
  const [data0, setData0] = useState([]);
  const [data1, setData1] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState("Hiver");
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [activite, setActivite] = useState("");
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

  const [eteVisible, setEteVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
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
    fetchAllData0();
    fetchAllData1();
  }, []);
  useEffect(() => {
    filterCategories();
  }, [activite]);
  const fetchAllData = async () => {
    try {
      const res = await url.get("/pratiquants/hiver");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchAllData0 = async () => {
    try {
      const res = await url.get("/activite");
      setData0(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllData1 = async () => {
    try {
      const res = await url.get(`/categorie`);
      setData1(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterCategories = () => {
    if (activite) {
      const filtered = data1.filter((cat) => cat.activite === activite);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
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
  const handleActiviteChange = (value) => {
    setActivite(value);
    // fetchAllData1(value);
  };
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };
  const saveEditedItem = async () => {
    try {
      const edit = await url.put(`pratiquants/${editedItem.id}`, {
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
      }
    } catch (error) {
      console.error("Error editing item:", error);
      Alert.alert("Error editing item", error.message);
    }
  };
  const confirmDeleteItem = () => {
    setDeleteModalVisible(false);
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

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View
        style={tw`bg-gray-300 p-4 shadow-md rounded-md mb-4 flex-row p-2 ml-4 mr-4`}
      >
        <MaterialCommunityIcons
          name="face-man-profile"
          size={24}
          color="black"
          style={tw`mr-2`}
        />
        <Text style={tw`text-lg text-gray-800 mr-2`}>{item.id}</Text>
        <Text style={tw`text-lg text-gray-800 mr-8`}>{item.nom}</Text>
      </View>
    </Swipeable>
  );

  const handleEdit = (item) => {
    setEditedItem(item);
    setNom(item.nom);
    setSession(item.session);
    setSexe(item.sexe);
    setDate(item.naissance);
    setCourriel(item.courriel);
    setAdresse(item.adresse);
    setTelephone(item.telephone);
    setTel_urgence(item.tel_urgence);
    setActivite(item.activite);
    setCategorie(item.categorie);
    setEvaluation(item.evaluation);
    setMode_payement(item.mode_payement);
    setCarte_payement(item.carte_payement);
    setModalVisible(true);
  };

  const CancelEditedItem = () => {
    setModalVisible(false);
  };
  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <View style={tw`bg-black p-2 flex-row items-center`}>
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
      </View>
      <FlatList
        style={tw`mt-1`}
        data={filteredData}
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

            <Text style={tw`text-white text-lg font-bold mb-2`}>Activite</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                selectedValue={activite}
                onValueChange={handleActiviteChange}
                style={{ color: "gray" }}
                name="activite"
              >
                {data0.map((index) => (
                  <Picker.Item
                    key={index.id}
                    label={index.nom}
                    value={index.id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={tw`text-white text-lg font-bold mb-2`}>Categorie</Text>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <Picker
                style={tw`text-white`}
                selectedValue={categorie}
                onValueChange={(itemValue) => setCategorie(itemValue)}
              >
                {filteredCategories.map((item) => (
                  <Picker.Item key={item.id} label={item.nom} value={item.id} />
                ))}
              </Picker>
            </View>

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
          <View style={tw`flex-row justify-center`}>
            <TouchableOpacity
              onPress={saveEditedItem}
              style={tw`bg-green-500 p-4 rounded-full flex flex-row items-center justify-center mb-4`}
            >
              <FontAwesome5 name="user-plus" size={24} color="white" />
              <Text style={tw`text-white font-bold text-lg ml-2`}>Editer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`bg-red-500 py-2 px-4 rounded-md flex-row items-center justify-center`}
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
                style={tw`bg-red-500 p-2 rounded-md mr-5 w-20 flex-row`}
                onPress={confirmDeleteItem}
              >
                <Entypo name="trash" size={18} color="white" />

                <Text style={tw`text-white text-center ml-1`}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-500 p-2 rounded-md w-20 flex-row`}
                onPress={() => setDeleteModalVisible(false)}
              >
                <MaterialIcons name="cancel" size={20} color="white" />
                <Text style={tw`text-white text-center ml-1`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Hiver_liste;
