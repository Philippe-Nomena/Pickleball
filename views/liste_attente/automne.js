import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const DATA = [
  { id: "1", title: "Andrew Tate" },
  { id: "2", title: "Elon Musk" },
  { id: "3", title: "Steve Jobs" },
];

const Automne_liste = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSwipeableRightOpen = (item) => {
    setSelectedItem(item.id);
  };

  const handleSwipeableClose = () => {
    setSelectedItem(null);
  };

  const renderRightActions = (item) => (
    <View style={tw`flex-row mr-5`}>
      <TouchableOpacity style={tw`bg-blue-500 p-2 h-10 mr-1 rounded-md`}>
        <AntDesign name="edit" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={tw`bg-red-500 p-2 h-10 rounded-md`}>
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
        style={tw`bg-white p-4 shadow-md rounded-md mb-4 flex-row p-2 ml-4 mr-4`}
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

  return (
    <FlatList
      style={tw`mt-1`}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Automne_liste;
