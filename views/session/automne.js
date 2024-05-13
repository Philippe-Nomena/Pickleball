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

export class Automne_Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorie: "A",
      sexe: "F",
      evaluation: "NON",
      groupe: "Jour",
      payement: [],
      carte_fede: [],
      consigne: [],
      etiquete: [],
      automneVisible: false,
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
      this.setState({ date: selectedDate, showDatePicker: false });
    } else {
      this.setState({ showDatePicker: false });
    }
  }

  showDatePicker() {
    this.setState({ showDatePicker: true });
  }

  render() {
    return (
      <SafeAreaView style={tw`bg-black flex-1  p-4`}>
        <ScrollView style={tw`mb-2`}>
          {this.state.automneVisible && (
            <TextInput
              value="Automne"
              style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
            />
          )}

          <Text style={tw`text-white text-lg font-bold mb-2`}>Nom</Text>
          <TextInput
            placeholder="Nom"
            style={tw` bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />

          <Text style={tw`text-white text-lg font-bold mb-2`}>Sexe</Text>
          <View
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.sexe}
              onValueChange={(itemValue, itemIndex) => this.setSexe(itemValue)}
            >
              <Picker.Item label="F" value="F" />
              <Picker.Item label="M" value="M" />
            </Picker>
          </View>

          <Text style={tw`text-white text-lg font-bold mb-2`}>Naissance</Text>
          <TouchableOpacity onPress={this.showDatePicker}>
            <View
              style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
            >
              <TextInput
                value={this.state.date.toDateString()}
                editable={false}
                style={{ flex: 1, color: "gray" }}
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
                  checked={this.state.payement.includes("Payement")}
                  onChange={() => this.setPayement("Payement")}
                />
                <Text style={tw`text-white text-lg font-bold mb-2`}>
                  Payement
                </Text>
              </View>

              <View style={tw`flex-row`}>
                <Checkbox
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
                  checked={this.state.consigne.includes("Consigne")}
                  onChange={() => this.setConsigne("Consigne")}
                />
                <Text style={tw`text-white text-lg font-bold mb-2`}>
                  Consigne
                </Text>
              </View>
              <View style={tw`flex-row`}>
                <Checkbox
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
            placeholder="Courriel"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Adresse</Text>
          <TextInput
            placeholder="Adresse"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Telephone</Text>
          <TextInput
            placeholder="Telephone"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />

          <Text style={tw`text-white text-lg font-bold mb-2`}>
            En cas d'urgence
          </Text>
          <TextInput
            placeholder="Numero en cas d'urgence"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Dans quelle catégorie avez-vous joué auparavant ?
          </Text>
          <View
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.categorie}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ categorie: itemValue })
              }
            >
              <Picker.Item label="A" value="A" />
              <Picker.Item label="B" value="B" />
              <Picker.Item label="C" value="C" />
              <Picker.Item label="D" value="D" />
            </Picker>
          </View>
          <Text style={tw`text-white text-lg font-bold mb-2`}>Evaluation</Text>
          <View
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          >
            <Picker
              selectedValue={this.state.evaluation}
              onValueChange={(itemValue, itemIndex) =>
                this.setEvaluation(itemValue)
              }
            >
              <Picker.Item label="NON" value="NON" />
              <Picker.Item label="OUI" value="OUI" />
            </Picker>
          </View>
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Mode de payement
          </Text>
          <TextInput
            placeholder="Mode de payement"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Carte bancaire
          </Text>
          <TextInput
            placeholder="Carte bancaire"
            style={tw`bg-gray-300 border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-white text-lg font-bold mb-2`}>Groupe</Text>
          <View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={this.state.groupe.includes("Jour")}
                onChange={() => this.setGroupe("Jour")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Jour</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={this.state.groupe.includes("Nuit")}
                onChange={() => this.setGroupe("Nuit")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Nuit</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={this.state.groupe.includes("Mixte")}
                onChange={() => this.setGroupe("Mixte")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Mixte</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Checkbox
                checked={this.state.groupe.includes("Weekend")}
                onChange={() => this.setGroupe("Weekend")}
              />
              <Text style={tw`text-white text-lg ml-2`}>Weekend</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-center`}>
            <TouchableOpacity
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

export default Automne_Session;
