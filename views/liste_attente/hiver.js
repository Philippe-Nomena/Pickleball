import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const DATA = [
  { id: "1", title: "Andrew Tate" },
  { id: "2", title: "Elon Musk" },
  { id: "3", title: "Steve Jobs" },
];

const Hiver_liste = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState({ id: "", title: "" });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSwipeableRightOpen = (item) => {
    setSelectedItem(item.id);
  };

  const handleSwipeableClose = () => {
    setSelectedItem(null);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
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
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      onSwipeableRightOpen={() => handleSwipeableRightOpen(item)}
      onSwipeableClose={handleSwipeableClose}
    >
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
        <Text style={tw`text-lg text-gray-800 mr-8`}>{item.title}</Text>
      </View>
    </Swipeable>
  );

  const handleEdit = (item) => {
    setEditedItem(item);
    setModalVisible(true);
  };

  const saveEditedItem = () => {
    setModalVisible(false);
  };
  const CancelEditedItem = () => {
    setModalVisible(false);
  };
  const filteredData = DATA.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}
        >
          <View style={tw`bg-gray-700 p-2 w-60 rounded-md`}>
            <Text style={tw`text-white text-xl text-center`}>Editer</Text>
            <TextInput
              style={tw`bg-gray-200 border border-gray-900 rounded-md p-2 mb-2 text-center`}
              onChangeText={(text) =>
                setEditedItem({ ...editedItem, id: text })
              }
              value={editedItem.id}
              editable={false}
            />
            <TextInput
              style={tw`bg-gray-200  border border-gray-600 rounded-md p-2 mb-2 text-center`}
              onChangeText={(text) =>
                setEditedItem({ ...editedItem, title: text })
              }
              value={editedItem.title}
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
                onPress={CancelEditedItem}
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
                Etes-vous sur de supprimer {itemToDelete.title} ?
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
