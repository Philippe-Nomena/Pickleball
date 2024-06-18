import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "./checkbox";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import BarcodeScannerScreen from "./qrcode";
import { url } from "../url";

const Ete_Presence = () => {
  const [data, setData] = useState([]);
  const [nom, setNom] = useState("");
  const [remarque, setRemarque] = useState("");
  const [activite, setActivite] = useState("Pickleball");
  const [groupe, setGroupe] = useState(["Lundi"]);
  const [barcodeData, setBarcodeData] = useState(null);
  const [eteVisible] = useState(false);

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

  const fetchAllData = async () => {
    try {
      const res = await url.get("/activite");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Ajout = () => {
    console.log({
      remarque,
      activite,
      groupe,
      barcodeData,
    });
  };

  return (
    <SafeAreaView style={tw`bg-black flex-1  p-4`}>
      <ScrollView style={tw`mb-2`}>
        {eteVisible && (
          <View>
            <TextInput
              value="Ete"
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
          </View>
        )}
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Scan votre code barre
        </Text>
        <BarcodeScannerScreen onScan={setBarcodeData} />
        {barcodeData && (
          <TextInput
            placeholder="Remarque"
            value={barcodeData}
            editable={false}
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4 mt-2`}
          />
        )}
        <Text style={tw`text-white text-lg font-bold mb-2`}>Remarque</Text>
        <TextInput
          placeholder="Remarque"
          name="remarque"
          value={remarque}
          onChangeText={(text) => setRemarque(text)}
          style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Votre activité
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={activite}
            onValueChange={(itemValue) => setActivite(itemValue)}
            style={{ color: "gray" }}
            name="activite"
          >
            {data.map((item) => (
              <Picker.Item key={item.id} label={item.nom} value={item.id} />
            ))}
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>Jour</Text>
        <View style={tw`flex-row`}>
          <View style={tw`flex-col mr-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Lundi")}
                onChange={() => updateGroupe("Lundi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Lundi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Mardi")}
                onChange={() => updateGroupe("Mardi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mardi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Mercredi")}
                onChange={() => updateGroupe("Mercredi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mercredi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Jeudi")}
                onChange={() => updateGroupe("Jeudi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Jeudi</Text>
            </View>
          </View>

          <View style={tw`flex-col`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Vendredi")}
                onChange={() => updateGroupe("Vendredi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Vendredi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Samedi")}
                onChange={() => updateGroupe("Samedi")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Samedi</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={groupe.includes("Dimanche")}
                onChange={() => updateGroupe("Dimanche")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Dimanche</Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
            onPress={Ajout}
          >
            <FontAwesome5 name="save" size={24} color="white" />
            <Text style={tw`text-white ml-2`}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
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

export default Ete_Presence;
