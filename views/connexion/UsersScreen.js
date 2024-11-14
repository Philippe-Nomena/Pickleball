import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../url";
import { AntDesign } from "@expo/vector-icons";
const UsersScreen = () => {
  const navigation = useNavigation();
  const [showPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();

  const loginUsers = async () => {
    try {
      const res = await url.post("/utilisateur/login", {
        username,
        motdepasse: password,
      });
      if (res.data.result) {
        await login(res.data.token);
        await AsyncStorage.setItem("token", res.data.token);
        navigation.navigate("Activite");
        Alert.alert("Success", "Vous êtes connectés");
        setPassword("");
        setUsername("");
      } else {
        Alert.alert("Error", "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      Alert.alert("Error", "Erreur lors de la connexion. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <View style={tw`flex-1 bg-black`}>
      <View style={tw`flex-1 bg-black mt-20`}>
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
        <View style={tw`flex-col justify-center items-center mt-40`}>
          <TextInput
            style={tw`bg-gray-300 w-96 rounded-md h-10 font-semibold text-lg mb-6`}
            placeholder="Username"
            value={username}
            onChangeText={(u) => setUsername(u)}
          />
          <TextInput
            style={tw`bg-gray-300 w-96 rounded-md h-10 font-semibold text-lg`}
            placeholder="Votre mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={tw`flex-row justify-center mt-5`}>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Forget_pass")}>
            <Text style={tw`text-white w-48 mr-5`}>Mot de passe oubliée?</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={loginUsers}
            style={tw`w-36 h-8 bg-blue-500 flex-row rounded-lg flex items-center justify-center`}
          >
            <Text style={tw`text-white mr-3`}>Se connecter</Text>
            <AntDesign name="right" size={15} color="white" />
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <View style={tw`flex-row mt-5 justify-center`}>
            <Text style={tw`text-white`}>Vous n’avez pas de compte?</Text>
            <Text style={tw`text-gray-500`}> S’inscrire</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default UsersScreen;
