import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import url from "../url";

const Activity = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ajoutModal, setAjoutModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nom, setNom] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await url.get("/activite");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDeleteItem = async () => {
    try {
      await url.delete(`/activite/${itemToDelete.id}`);
      setDeleteModalVisible(false);
      fetchAllData();
      Alert.alert("Suppression réussi avec succès");
    } catch (error) {
      Alert.alert("Error deleting item", error.message);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
    setNom(item.nom);
    setModalVisible(true);
  };

  const saveEditedItem = async () => {
    try {
      await url.put(`/activite/${editedItem.id}`, { nom });
      setModalVisible(false);
      fetchAllData();
      Alert.alert("Edit réussi");
    } catch (error) {
      Alert.alert("Error editing item", error.message);
    }
  };

  const addActivity = async () => {
    try {
      await url.post("/activite", { nom });
      setAjoutModal(false);
      fetchAllData();
      Alert.alert("Ajout d'activité réussi avec succès");
      setNom("");
    } catch (error) {
      Alert.alert("Error adding activity", error.message);
    }
  };

  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        style={tw`bg-gray-600 p-4 shadow-md rounded-md mb-4 ml-4 mr-4 flex-row items-center`}
      >
        <Text style={tw`text-lg text-white`}>{item.nom}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={tw`flex-1 bg-black`}>
      <View>
        <TouchableOpacity
          style={tw`bg-green-300 w-28 h-8 rounded justify-center items-center ml-56 mt-2 flex-row`}
          onPress={() => setAjoutModal(true)}
        >
          <AntDesign name="plussquare" size={24} color="white" />
          <Text style={tw`text-white ml-2`}>Activity</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`bg-black flex-row items-center`}>
        <TouchableOpacity style={tw`p-2`}>
          <AntDesign name="search1" size={18} color="white" />
        </TouchableOpacity>
        <TextInput
          style={tw`flex-1 border-b border-white text-white p-2`}
          placeholder="chercher..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholderTextColor="white"
        />
      </View>
      <FlatList
        style={tw`mt-1`}
        data={filteredData}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-2 w-60 rounded-md`}>
            <Text style={tw`text-white text-xl text-center`}>Editer</Text>
            <TextInput
              style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
              onChangeText={setNom}
              value={nom}
            />
            <View style={tw`flex-row justify-center items-center`}>
              <TouchableOpacity
                style={tw`bg-blue-500 p-2 rounded-md ml-2 mr-4 w-24 flex-row`}
                onPress={saveEditedItem}
              >
                <AntDesign name="edit" size={20} color="white" />
                <Text style={tw`text-white text-center ml-2`}>Editer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 p-2 rounded-md w-24 flex-row`}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="cancel" size={20} color="white" />
                <Text style={tw`text-white text-center ml-2`}>Annuler</Text>
              </TouchableOpacity>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={ajoutModal}
        onRequestClose={() => setAjoutModal(!ajoutModal)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-2 w-60 rounded-md`}>
            <Text style={tw`text-white text-xl text-center`}>
              Nouveau Activité
            </Text>
            <TextInput
              style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
              placeholder="Nom de l'activité"
              value={nom}
              onChangeText={setNom}
              name="nom"
            />
            <View style={tw`flex-row justify-center items-center`}>
              <TouchableOpacity
                style={tw`bg-blue-500 p-2 rounded-md ml-2 mr-4 w-24 flex-row`}
                onPress={addActivity}
              >
                <AntDesign name="save" size={20} color="white" />
                <Text style={tw`text-white text-center ml-2`}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 p-2 rounded-md w-24 flex-row`}
                onPress={() => setAjoutModal(false)}
              >
                <MaterialIcons name="cancel" size={20} color="white" />
                <Text style={tw`text-white text-center ml-2`}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Activity;
