import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { TabBar, TabView, SceneMap } from "react-native-tab-view";
import tw from "tailwind-react-native-classnames";
import { AntDesign } from "@expo/vector-icons";
const Admin = () => (
  <View>
    <View style={tw`flex-col justify-center items-center mt-5`}>
      <TextInput
        style={tw`bg-gray-300 w-96  rounded-md  h-10 font-semibold  text-lg mb-6`}
        placeholder="User554125"
      />
      <TextInput
        style={tw`bg-gray-300  w-96 rounded-md  h-10 font-semibold  text-lg`}
        placeholder="********************"
      />
    </View>
    <View style={tw`flex-row justify-center mt-5 `}>
      <TouchableOpacity
        style={tw`w-36 h-8  bg-blue-500 flex-row rounded-lg flex items-center justify-center`}
      >
        <Text style={tw`text-white mr-3`}>Se connecter</Text>
        <AntDesign name="right" size={15} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

const Users = () => (
  <View>
    <View style={tw`flex-col justify-center items-center mt-5`}>
      <TextInput
        style={tw`bg-gray-300 w-96  rounded-md  h-10 font-semibold  text-lg mb-6`}
        placeholder="User554125"
      />
      <TextInput
        style={tw`bg-gray-300  w-96 rounded-md  h-10 font-semibold  text-lg`}
        placeholder="********************"
      />
    </View>
    <View style={tw`flex-row justify-center mt-5 `}>
      <TouchableOpacity>
        <Text style={tw` text-white w-48  mr-5`}>Mot de passe oubliée?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`w-36 h-8  bg-blue-500 flex-row rounded-lg flex items-center justify-center`}
      >
        <Text style={tw`text-white mr-3`}>Se connecter</Text>
        <AntDesign name="right" size={15} color="white" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity>
      <View style={tw`flex-row mt-5 justify-center`}>
        <Text style={tw`text-white `}>Vous n’avez pas de compte?</Text>
        <Text style={tw`text-gray-500`}> S’inscrire</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const Login = () => {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "first", title: "Admin" },
    { key: "second", title: "Users" },
  ];

  return (
    <View style={styles.scene}>
      <View style={tw`flex-1 bg-black`}>
        <View
          style={tw`absolute w-28 h-28 ml-36 bg-blue-500 mt-6 rounded-3xl`}
        />
        <Text style={tw`text-white font-bold top-36  text-center text-3xl `}>
          PickleApp
        </Text>
        <Text
          style={tw` text-white w-40 ml-32 top-36 mb-2 text-center text-lg`}
        >
          Bienvenue sur PickleApp
        </Text>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            first: Admin,
            second: Users,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          style={tw`top-40`}
          tabBarStyle={tw`bg-black`}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "white" }}
              style={tw`bg-black`}
              activeColor="white"
              inactiveColor="white"
              labelStyle={{ textTransform: "capitalize" }}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default Login;
