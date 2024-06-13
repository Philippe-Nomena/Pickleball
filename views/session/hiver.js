import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "./checkbox";
import tw from "tailwind-react-native-classnames";
import DateTimePicker from "@react-native-community/datetimepicker";

import dayjs from "dayjs";
import { url } from "../url";

const Hiver_Session = () => {
  const [session] = useState("Hiver");
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [activite, setActivite] = useState("");
  const [sexe, setSexe] = useState("F");
  const [adresse, setAdresse] = useState("");
  const [telUrgence, setTelUrgence] = useState("");
  const [evaluation, setEvaluation] = useState("NON");

  const [payement, setPayement] = useState([]);
  const [cartePayement, setCartePayement] = useState("");
  const [modePayement, setModePayement] = useState("");
  const [telephone, setTelephone] = useState("");
  const [courriel, setCourriel] = useState("");
  const [carte_fede, setCarte_fede] = useState([]);
  const [consigne, setConsigne] = useState([]);
  const [etiquete, setEtiquete] = useState([]);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [hiverVisible, setHiverVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [groupe, setGroupe] = useState([]);
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
    fetchAllData1();
  }, []);
  useEffect(() => {
    filterCategories();
  }, [activite]);
  const fetchAllData = async () => {
    try {
      const res = await url.get("/activite");
      setData(res.data);
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

  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const annulHiver = async () => {
    setNom("");
    setAdresse("");
    setTelUrgence("");
    setCartePayement("");
    setModePayement("");
    setTelephone("");
    setCourriel("");
  };
  const ajoutHiver = async () => {
    try {
      const newPratiquants = await url.post("/pratiquants", {
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
        tel_urgence: telUrgence,
        activite,
        categorie,
        evaluation,
        mode_payement: modePayement,
        carte_payement: cartePayement,
        groupe,
      });
      if (newPratiquants) {
        setNom("");
        setAdresse("");
        setTelUrgence("");
        setCartePayement("");
        setModePayement("");
        setTelephone("");
        setCourriel("");
        alert("Ajout avec succès");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={tw`bg-black flex-1  p-4`}>
      <ScrollView style={tw`mb-2`}>
        {hiverVisible && (
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
          onChangeText={(t) => setNom(t)}
          style={tw` bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />

        <Text style={tw`text-white text-lg font-bold mb-2`}>Sexe</Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={sexe}
            onValueChange={(itemValue, itemIndex) => setSexe(itemValue)}
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
                onChange={() => setPayement("Payement")}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Payement
              </Text>
            </View>

            <View style={tw`flex-row`}>
              <Checkbox
                name="carte_fede"
                checked={carte_fede.includes("Carte Fédé")}
                onChange={() => setCarte_fede("Carte Fédé")}
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
                onChange={() => setConsigne("Consigne")}
              />
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                Consigne
              </Text>
            </View>
            <View style={tw`flex-row`}>
              <Checkbox
                name="etiquete"
                checked={etiquete.includes("Etiquete")}
                onChange={() => setEtiquete("Etiquete")}
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
          onChangeText={(t) => setCourriel(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>Adresse</Text>
        <TextInput
          name="adresse"
          placeholderTextColor="gray"
          value={adresse}
          onChangeText={(t) => setAdresse(t)}
          placeholder="Adresse"
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>Telephone</Text>
        <TextInput
          name="telephone"
          placeholderTextColor="gray"
          placeholder="Telephone"
          value={telephone}
          onChangeText={(t) => setTelephone(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />

        <Text style={tw`text-white text-lg font-bold mb-2`}>
          En cas d'urgence
        </Text>
        <TextInput
          name="tel_urgence"
          placeholderTextColor="gray"
          placeholder="Numero en cas d'urgence"
          value={telUrgence}
          onChangeText={(t) => setTelUrgence(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Choisissez votre activité
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
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
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Dans quelle catégorie avez-vous joué auparavant ?
        </Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={categorie}
            onValueChange={(itemValue) => setCategorie(itemValue)}
            style={{ color: "gray" }}
            name="categorie"
          >
            {filteredCategories.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.categorie}
                value={item.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>Evaluation</Text>
        <View
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        >
          <Picker
            selectedValue={evaluation}
            onValueChange={(itemValue, itemIndex) => setEvaluation(itemValue)}
            style={{ color: "gray" }}
            name="evaluation"
          >
            <Picker.Item label="NON" value="NON" />
            <Picker.Item label="OUI" value="OUI" />
          </Picker>
        </View>
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Mode de payement
        </Text>
        <TextInput
          name="mode_payement"
          value={modePayement}
          onChangeText={(t) => setModePayement(t)}
          placeholderTextColor="gray"
          placeholder="Mode de payement"
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
        <Text style={tw`text-white text-lg font-bold mb-2`}>
          Carte bancaire
        </Text>
        <TextInput
          name="carte_payement"
          placeholderTextColor="gray"
          placeholder="Carte bancaire"
          value={cartePayement}
          onChangeText={(t) => setCartePayement(t)}
          style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
        />
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
        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity
            onPress={ajoutHiver}
            style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
          >
            <FontAwesome5 name="save" size={24} color="white" />
            <Text style={tw`text-white ml-2`}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={annulHiver}
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

export default Hiver_Session;
