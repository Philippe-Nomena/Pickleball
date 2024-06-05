import React, { Component } from "react";
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
import url from "../url";
import dayjs from "dayjs";

export class Ete_Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: "Ete",
      nom: "",
      categorie: "",
      activite: "",
      sexe: "F",
      adresse: "",
      tel_urgence: "",
      evaluation: "NON",
      groupe: [],
      payement: [],
      carte_payement: "",
      mode_payement: "",
      telephone: "",
      courriel: "",
      carte_fede: [],
      consigne: [],
      etiquete: [],
      data: [],
      eteVisible: false,
      date: new Date(),
      showDatePicker: false,
    };
    this.setEvaluation = this.setEvaluation.bind(this);
    this.setGroupe = this.setGroupe.bind(this);
    this.setPayement = this.setPayement.bind(this);
    this.setCarte_fede = this.setCarte_fede.bind(this);
    this.setConsigne = this.setConsigne.bind(this);
    this.setEtiquete = this.setEtiquete.bind(this);
    this.setSexe = this.setSexe.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.setActivite = this.setActivite.bind(this);
    this.setCategorie = this.setCategorie.bind(this);
  }

  setCategorie(value) {
    this.setState({ categorie: value });
  }
  setEvaluation(itemValue) {
    this.setState({ evaluation: itemValue });
  }
  setEtiquete(option) {
    const updatedEtiquete = [...this.state.etiquete];
    const index = updatedEtiquete.indexOf(option);
    if (index > -1) {
      updatedEtiquete.splice(index, 1);
    } else {
      updatedEtiquete.push(option);
    }
    this.setState({ etiquete: updatedEtiquete });
  }
  setConsigne(option) {
    const updatedConsigne = [...this.state.consigne];
    const index = updatedConsigne.indexOf(option);
    if (index > -1) {
      updatedConsigne.splice(index, 1);
    } else {
      updatedConsigne.push(option);
    }
    this.setState({ consigne: updatedConsigne });
  }
  setPayement(option) {
    const updatedPayement = [...this.state.payement];
    const index = updatedPayement.indexOf(option);
    if (index > -1) {
      updatedPayement.splice(index, 1);
    } else {
      updatedPayement.push(option);
    }
    this.setState({ payement: updatedPayement });
  }
  setCarte_fede(option) {
    const updatedCarte_fede = [...this.state.carte_fede];
    const index = updatedCarte_fede.indexOf(option);
    if (index > -1) {
      updatedCarte_fede.splice(index, 1);
    } else {
      updatedCarte_fede.push(option);
    }
    this.setState({ carte_fede: updatedCarte_fede });
  }

  setGroupe(itemValue) {
    let updatedGroupe = [...this.state.groupe];
    const index = updatedGroupe.indexOf(itemValue);
    if (index > -1) {
      updatedGroupe.splice(index, 1);
    } else {
      updatedGroupe.push(itemValue);
    }
    this.setState({ groupe: updatedGroupe });
  }
  setSexe(itemValue) {
    this.setState({ sexe: itemValue });
  }

  handleDateChange(event, selectedDate) {
    if (selectedDate) {
      this.setState({ date: selectedDate, showDatePicker: false }, () => {
        console.log("Selected date:", this.state.date.toDateString());
      });
    } else {
      this.setState({ showDatePicker: false });
    }
  }

  componentDidMount() {
    this.fetchAllData();
  }
  fetchAllData = async () => {
    try {
      const res = await url.get("/activite");
      this.setState({ data: res.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchAllData1 = async (id_activite) => {
    try {
      const res = await url.get(`/categorie/byactivite/${id_activite}`);
      this.setState({ categorie: res.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  setActivite(value) {
    this.setState({ activite: value });
    this.fetchAllData1(value);
  }
  showDatePicker() {
    this.setState({ showDatePicker: true });
  }
  ajoutEte = async () => {
    try {
      const newPratiquants = await url.post("/pratiquants", {
        session: this.state.session,
        nom: this.state.nom,
        sexe: this.state.sexe,
        naissance: this.formatDate(this.state.date),
        payement: this.state.payement,
        consigne: this.state.consigne,
        carte_fede: this.state.carte_fede,
        etiquete: this.state.etiquete,
        courriel: this.state.courriel,
        adresse: this.state.adresse,
        telephone: this.state.telephone,
        tel_urgence: this.state.tel_urgence,
        activite: this.state.activite,
        categorie: this.state.categorie,
        evaluation: this.state.evaluation,
        mode_payement: this.state.mode_payement,
        carte_payement: this.state.carte_payement,
        groupe: this.state.groupe,
      });
      if (newPratiquants) {
        this.setState({
          nom: "",
          adresse: "",
          tel_urgence: "",
          carte_payement: "",
          mode_payement: "",
          telephone: "",
          courriel: "",
        });
        alert("Ajout avec succees");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  formatDate(date) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  render() {
    return (
      <SafeAreaView style={tw`bg-black flex-1  p-4`}>
        <ScrollView style={tw`mb-2`}>
          {this.state.eteVisible && (
            <TextInput
              name="session"
              value={this.state.session}
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            />
          )}

          <Text style={tw`text-white text-lg font-bold mb-2`}>Nom</Text>
          <TextInput
            placeholderTextColor="gray"
            placeholder="Nom"
            name="nom"
            value={this.state.nom}
            onChangeText={(t) => this.setState({ nom: t })}
            style={tw` bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />

          <Text style={tw`text-white text-lg font-bold mb-2`}>Sexe</Text>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.sexe}
              onValueChange={(itemValue, itemIndex) => this.setSexe(itemValue)}
              style={{ color: "gray" }}
              name="sexe"
            >
              <Picker.Item label="F" value="F" />
              <Picker.Item label="M" value="M" />
            </Picker>
          </View>

          <Text style={tw`text-white text-lg font-bold mb-2`}>Naissance</Text>
          <TouchableOpacity onPress={this.showDatePicker}>
            <View
              style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
            >
              <TextInput
                value={this.formatDate(this.state.date)}
                editable={false}
                style={{ flex: 1, color: "gray" }}
                name="naissance"
              />
            </View>
          </TouchableOpacity>

          {this.state.showDatePicker && (
            <DateTimePicker
              value={this.state.date}
              mode="date"
              display="spinner"
              onChange={this.handleDateChange}
              style={{ backgroundColor: "white", color: "black" }}
            />
          )}
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`flex-col`}>
              <View style={tw`flex-row`}>
                <Checkbox
                  name="payement"
                  checked={this.state.payement.includes("Payement")}
                  onChange={() => this.setPayement("Payement")}
                />
                <Text style={tw`text-white text-lg font-bold mb-2`}>
                  Payement
                </Text>
              </View>

              <View style={tw`flex-row`}>
                <Checkbox
                  name="carte_fede"
                  checked={this.state.carte_fede.includes("Carte Fédé")}
                  onChange={() => this.setCarte_fede("Carte Fédé")}
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
                  checked={this.state.consigne.includes("Consigne")}
                  onChange={() => this.setConsigne("Consigne")}
                />
                <Text style={tw`text-white text-lg font-bold mb-2`}>
                  Consigne
                </Text>
              </View>
              <View style={tw`flex-row`}>
                <Checkbox
                  name="etiquete"
                  checked={this.state.etiquete.includes("Etiquete")}
                  onChange={() => this.setEtiquete("Etiquete")}
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
            value={this.state.courriel}
            onChangeText={(t) => this.setState({ courriel: t })}
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Adresse</Text>
          <TextInput
            name="adresse"
            placeholderTextColor="gray"
            value={this.state.adresse}
            onChangeText={(t) => this.setState({ adresse: t })}
            placeholder="Adresse"
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Telephone</Text>
          <TextInput
            name="telephone"
            placeholderTextColor="gray"
            placeholder="Telephone"
            value={this.state.telephone}
            onChangeText={(t) => this.setState({ telephone: t })}
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />

          <Text style={tw`text-white text-lg font-bold mb-2`}>
            En cas d'urgence
          </Text>
          <TextInput
            name="tel_urgence"
            placeholderTextColor="gray"
            placeholder="Numero en cas d'urgence"
            value={this.state.tel_urgence}
            onChangeText={(t) => this.setState({ tel_urgence: t })}
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Choisissez votre activité
          </Text>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.activite}
              onValueChange={(itemValue) => this.setActivite(itemValue)}
              style={{ color: "gray" }}
              name="activite"
            >
              {/* {this.state.data.map((item) => (
                <Picker.Item key={item.id} label={item.nom} value={item.id} />
              ))} */}
            </Picker>
          </View>
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Dans quelle catégorie avez-vous joué auparavant ?
          </Text>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.categorie}
              onValueChange={(itemValue) => this.setCategorie(itemValue)}
              style={{ color: "gray" }}
              name="categorie"
            >
              {/* {this.state.categories.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.categorie}
                  value={item.id}
                />
              ))} */}
            </Picker>
            {/* <Picker
              selectedValue={this.state.categorie}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ categorie: itemValue })
              }
              style={{ color: "gray" }}
              name="categorie"
            >
              <Picker.Item label="A" value="A" />
              <Picker.Item label="B" value="B" />
              <Picker.Item label="C" value="C" />
              <Picker.Item label="D" value="D" />
            </Picker> */}
          </View>
          <Text style={tw`text-white text-lg font-bold mb-2`}>Evaluation</Text>
          <View
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.evaluation}
              onValueChange={(itemValue, itemIndex) =>
                this.setEvaluation(itemValue)
              }
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
            value={this.state.mode_payement}
            onChangeText={(t) => this.setState({ mode_payement: t })}
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
            value={this.state.carte_payement}
            onChangeText={(t) => this.setState({ carte_payement: t })}
            style={tw`bg-gray-300 border border-gray-100 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Groupe</Text>
          <View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="groupe"
                checked={this.state.groupe.includes("Jour")}
                onChange={() => this.setGroupe("Jour")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Jour</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="groupe"
                checked={this.state.groupe.includes("Nuit")}
                onChange={() => this.setGroupe("Nuit")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Nuit</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="groupe"
                checked={this.state.groupe.includes("Mixte")}
                onChange={() => this.setGroupe("Mixte")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mixte</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                name="groupe"
                checked={this.state.groupe.includes("Weekend")}
                onChange={() => this.setGroupe("Weekend")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Weekend</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-center`}>
            <TouchableOpacity
              onPress={this.ajoutEte}
              style={tw`bg-blue-500 py-2 px-4 rounded-md flex-row items-center justify-center mr-4`}
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
  }
}

export default Ete_Session;
