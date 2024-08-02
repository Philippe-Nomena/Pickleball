import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Checkbox } from "./checkbox";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { url, stateUrl } from "../url";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const Activity = () => {
  const [data, setData] = useState([]);
  const [liste_categorie, setListe_categorie] = useState([]);
  const [modalListe_categorie, setModalListe_categorie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ajoutModal, setAjoutModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categorieModalVisible, setCategorieModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nom, setNom] = useState("");
  const [image, setImage] = useState(null);
  const [id_activite, setId_activite] = useState("");
  const [categorie, setCategorie] = useState("");
  const [groupe, setGroupe] = useState([]);
  const [horaire, SetHoraire] = useState("");
  const [prix, setPrix] = useState("");

  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDateChange1 = (event, selectedDate) => {
    const currentDate = selectedDate || date1;
    setShowDatePicker1(false);
    setDate1(currentDate);
  };

  const handleDateChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShowDatePicker2(false);
    setDate2(currentDate);
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  const handleSetGroupe = (itemValue) => {
    let updatedGroupe = [...groupe];
    const index = updatedGroupe.indexOf(itemValue);
    if (index > -1) {
      updatedGroupe.splice(index, 1);
    } else {
      updatedGroupe.push(itemValue);
    }
    setGroupe(updatedGroupe);
  };

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

  const handleDelete = (item) => {
    const imageUrl = `${stateUrl}/uploads/${item.imagePath}`;
    setItemToDelete(item);
    setDeleteModalVisible(true);
    setImage(imageUrl);
  };

  const handleListeCategorie = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const response = await url.get(`/categorie/byactivite/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListe_categorie(response.data);
      setModalListe_categorie(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const confirmDeleteItem = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      await url.delete(`/activite/${itemToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteModalVisible(false);
      fetchAllData();
      Alert.alert("Suppression réussie avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élément :", error);
      Alert.alert("Erreur lors de la suppression de l'élément", error.message);
    }
  };

  const handleEdit = (item) => {
    const imageUrl = `${stateUrl}/uploads/${item.imagePath}`;
    setEditedItem(item);
    setNom(item.nom);
    setImage(imageUrl);
    setModalVisible(true);
  };
  const handleCategorie = (item) => {
    setEditedItem(item);
    setId_activite(item.id);
    setCategorieModalVisible(true);
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera roll is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const saveEditedItem = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append("nom", nom);

      if (image && image.uri) {
        formData.append("imagePath", {
          uri: image.uri,
          type: getImageType(image.uri),
          name: image.uri.split("/").pop().toLowerCase(),
        });
      }

      const response = await url.put(`/activite/${editedItem.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setModalVisible(false);
      fetchAllData();
      setNom("");
      setImage(null);
      Alert.alert("Modification réussie !");
    } catch (error) {
      console.error("Erreur lors de la modification de l'élément :", error);
      Alert.alert("Erreur lors de la modification de l'élément", error.message);
    }
  };
  const addCategorie = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const formattedDate1 = formatDate(date1);
      const formattedDate2 = formatDate(date2);

      await url.post(
        `/categorie`,
        {
          id_activite,
          horaire,
          prix,
          categorie,
          jour: groupe,
          datedebut: formattedDate1,
          datefin: formattedDate2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategorieModalVisible(false);
      fetchAllData();
      SetHoraire("");
      setPrix("");
      setCategorie("");
      setGroupe([]);

      Alert.alert("Catégorie ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error);
      Alert.alert(
        "Erreur lors de l'ajout de la catégorie",
        error.response?.data?.error || error.message
      );
    }
  };
  const addActivity = async () => {
    if (!nom || !image || !image.uri) {
      Alert.alert("Veuillez remplir tous les champs et sélectionner une image");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("imagePath", {
        uri: image.uri,
        type: getImageType(image.uri),
        name: image.uri.split("/").pop().toLowerCase(),
      });

      const response = await url.post("/activite", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        Alert.alert("Activité créée avec succès !");
        fetchAllData();
        setAjoutModal(false);
        setNom("");
        setImage(null);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'activité :", error);
      Alert.alert("Échec de la création de l'activité. Veuillez réessayer.");
    }
  };

  const getImageType = (uri) => {
    const extension = uri.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "image/jpeg";
    }
  };

  const filteredData = data.filter((item) =>
    item.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRightActions = (item) => (
    <View style={tw`flex-row mr-5`}>
      <TouchableOpacity
        style={tw`bg-green-500 p-2 h-10 mr-1 rounded-md`}
        onPress={() => handleCategorie(item)}
      >
        <MaterialIcons name="category" size={24} color="white" />
      </TouchableOpacity>
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
        onPress={() => handleListeCategorie(item)}
      >
        <Entypo name="list" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
  const renderRightActions1 = (item) => (
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
    </View>
  );
  const renderItem = ({ item }) => {
    const imageUrl = `${stateUrl}/uploads/${item.imagePath}`;

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View
          style={tw`bg-gray-900 p-2 shadow-md rounded-md mb-3 ml-4 mr-4 flex-col`}
        >
          <Text style={tw`text-lg text-white`}>{item.nom}</Text>
          <Image
            source={{ uri: imageUrl }}
            style={tw`w-full h-60 rounded-md`}
          />
        </View>
      </Swipeable>
    );
  };
  const renderItem1 = ({ item }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions1(item)}>
        <View
          style={tw`bg-gray-900 p-2 shadow-md rounded-md mb-3 ml-4 mr-4 flex-col`}
        >
          <Text style={tw`text-lg text-white text-center`}>
            {item.categorie}
          </Text>
        </View>
      </Swipeable>
    );
  };
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
        style={tw`mt-2`}
        data={filteredData}
        vertical={true}
        showsVerticalScrollIndicator={false}
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
            <ScrollView>
              <View>
                <Text style={tw`text-white `}>Nom:</Text>
                <TextInput
                  style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
                  placeholder="Nom de l'activité"
                  value={nom}
                  onChangeText={setNom}
                  name="nom"
                />
                <Text style={tw`text-white `}>Image:</Text>

                <TouchableOpacity
                  onPress={handleImagePick}
                  style={tw`bg-gray-200 rounded-md p-2 mb-2`}
                >
                  <Text style={tw`text-center`}>Changer Photo</Text>
                </TouchableOpacity>

                {image && image.uri && (
                  <Image
                    name="imagePath"
                    source={{ uri: image.uri }}
                    style={tw`w-full h-44 rounded-md mb-2`}
                  />
                )}
              </View>
            </ScrollView>

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
                style={tw`bg-red-500 p-2 rounded-md mr-5 flex-row`}
                onPress={confirmDeleteItem}
              >
                <Entypo name="trash" size={18} color="white" />
                <Text style={tw`text-white text-center ml-1`}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-500 p-2 rounded-md  flex-row`}
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
        visible={ajoutModal}
        onRequestClose={() => setAjoutModal(!ajoutModal)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View
            style={[tw`bg-gray-700 p-2 w-60 rounded-md`, { maxHeight: "70%" }]}
          >
            <Text style={tw`text-white text-xl text-center`}>
              Nouveau Activité
            </Text>
            <ScrollView>
              <View>
                <Text style={tw`text-white `}>Nom:</Text>
                <TextInput
                  style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
                  placeholder="Nom de l'activité"
                  value={nom}
                  onChangeText={setNom}
                  name="nom"
                />
                <Text style={tw`text-white `}>Image:</Text>

                <TouchableOpacity
                  onPress={handleImagePick}
                  style={tw`bg-gray-200 rounded-md p-2 mb-2`}
                >
                  <Text style={tw`text-center`}>Inserer Photo</Text>
                </TouchableOpacity>
                {image && image.uri && (
                  <Image
                    name="imagePath"
                    source={{ uri: image.uri }}
                    style={tw`w-full h-44 mb-2 rounded-md`}
                  />
                )}
              </View>
            </ScrollView>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalListe_categorie}
        onRequestClose={() => setModalListe_categorie(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={[tw`bg-gray-700 w-64 p-2 rounded-md`]}>
            <Text style={tw`text-lg text-white text-center`}>
              Liste de categorie
            </Text>

            <FlatList
              data={liste_categorie}
              renderItem={renderItem1}
              keyExtractor={(item) => item.id.toString()}
              vertical={true}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={tw`bg-red-500 p-1 w-24 items-center rounded-md ml-16`}
              onPress={() => setModalListe_categorie(false)}
            >
              <Text style={tw`text-white text-lg`}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categorieModalVisible}
        onRequestClose={() => setCategorieModalVisible(!categorieModalVisible)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={[tw`bg-gray-700 w-64 p-2 rounded-md`]}>
            <Text style={tw`text-white text-xl text-center`}>
              Nouveau categorie
            </Text>
            <TextInput
              value={id_activite.toString()}
              editable={false}
              name="id_activite"
              style={{ display: "none" }}
            />
            <Text style={tw`text-white mb-2`}>Categorie:</Text>
            <View style={tw`flex-row items-center`}>
              <TextInput
                style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 text-center w-full`}
                placeholder="ex:A || debutant ..."
                value={categorie}
                onChangeText={setCategorie}
                name="categorie"
              />
            </View>
            <View>
              <Text style={tw`text-white `}>Horaire:</Text>
              <TextInput
                style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
                placeholder="ex: 9h-10h-30"
                value={horaire}
                onChangeText={SetHoraire}
                name="horaire"
              />
            </View>

            <View>
              <Text style={tw`text-white `}>Prix:</Text>
              <TextInput
                style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
                placeholder="Prix"
                value={prix}
                onChangeText={setPrix}
                name="prix"
              />
            </View>

            <View>
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Date de debut
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker1(true)}>
                <View
                  style={tw`bg-gray-200 border border-gray-600 rounded-md p-2 mb-2 text-center`}
                >
                  <TextInput
                    value={formatDate(date1)}
                    editable={false}
                    name="datedebut"
                  />
                </View>
              </TouchableOpacity>

              {showDatePicker1 && (
                <DateTimePicker
                  value={date1}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange1}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              )}
            </View>

            <View>
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Date de fin
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker2(true)}>
                <View
                  style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
                >
                  <TextInput
                    value={formatDate(date2)}
                    editable={false}
                    name="datefin"
                  />
                </View>
              </TouchableOpacity>

              {showDatePicker2 && (
                <DateTimePicker
                  value={date2}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange2}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              )}
            </View>
            <View>
              <Text style={tw`text-white text-lg font-bold mb-2`}>Jours</Text>
              <View style={tw`flex-row`}>
                <View style={tw`flex-col mr-1`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Lundi")}
                      onChange={() => handleSetGroupe("Lundi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Lundi</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Mardi")}
                      onChange={() => handleSetGroupe("Mardi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Mardi</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Mercredi")}
                      onChange={() => handleSetGroupe("Mercredi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Mercredi</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Jeudi")}
                      onChange={() => handleSetGroupe("Jeudi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Jeudi</Text>
                  </View>
                </View>

                <View style={tw`flex-col`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Vendredi")}
                      onChange={() => handleSetGroupe("Vendredi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Vendredi</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Samedi")}
                      onChange={() => handleSetGroupe("Samedi")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Samedi</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Checkbox
                      name="jour"
                      checked={groupe.includes("Dimanche")}
                      onChange={() => handleSetGroupe("Dimanche")}
                    />
                    <Text style={tw`text-white text-lg ml-2`}>Dimanche</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={tw`flex-row justify-center items-center`}>
              <TouchableOpacity
                style={tw`bg-blue-500 p-2 rounded-md ml-2 mr-4 w-24 flex-row`}
                onPress={addCategorie}
              >
                <AntDesign name="save" size={20} color="white" />
                <Text style={tw`text-white text-center ml-2`}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 p-2 rounded-md w-24 flex-row`}
                onPress={() => setCategorieModalVisible(false)}
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
