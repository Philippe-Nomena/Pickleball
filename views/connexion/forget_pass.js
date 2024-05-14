import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Forget_pass = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            placeholder="Nickname"
          />
          <TextInput
            style={tw`bg-gray-300 w-96 rounded-md h-10 font-semibold text-lg`}
            placeholder="Nouveau mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <AntDesign
              name={showPassword ? "eye" : "eyeo"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TextInput
            style={tw`bg-gray-300 w-96 rounded-md h-10 font-semibold text-lg `}
            placeholder="Confirmez votre mot de passe"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={toggleShowConfirmPassword}>
            <AntDesign
              name={showConfirmPassword ? "eye" : "eyeo"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row justify-center mt-5 `}>
          <TouchableOpacity
            style={tw`w-36 h-8 bg-blue-500 flex-row rounded-lg flex items-center justify-center`}
            // onPress={handleConfirm}
          >
            <Text style={tw`text-white mr-3`}>Confirmez</Text>
            <AntDesign name="right" size={15} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <View style={tw`flex-row mt-5 justify-center`}>
            <Text style={tw`text-white `}>Vous avez déjà un compte?</Text>
            <Text style={tw`text-gray-500`}> Se connecter </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Forget_pass;
