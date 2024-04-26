import React, { useState, Component } from "react";
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

export class Automne_Presence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorie: "A",

      groupe: "Lundi",
      eteVisible: false,
    };

    this.setGroupe = this.setGroupe.bind(this);
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

  render() {
    return (
      <SafeAreaView style={tw`flex-1  p-4`}>
        <ScrollView style={tw`mb-20`}>
          <Text style={tw`text-lg font-bold mb-2`}>Nom</Text>
          <TextInput
            placeholder="Nom"
            style={tw`border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-lg font-bold mb-2`}>Numéro</Text>
          <TextInput
            placeholder="Numéro"
            style={tw`border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-lg font-bold mb-2`}>Remarque</Text>
          <TextInput
            placeholder="Remarque"
            style={tw`border border-gray-300 rounded-md p-2 mb-4`}
          />
          <Text style={tw`text-lg font-bold mb-2`}>Votre catégorie</Text>
          <View style={tw`border border-gray-300 rounded-md p-2 mb-4`}>
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
          <Text style={tw`text-lg font-bold mb-2`}>Jour</Text>
          <View style={tw`flex-row`}>
            <View style={tw`flex-col mr-4`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Lundi")}
                  onChange={() => this.setGroupe("Lundi")}
                />
                <Text style={tw`text-lg ml-2`}>Lundi</Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Mardi")}
                  onChange={() => this.setGroupe("Mardi")}
                />
                <Text style={tw`text-lg ml-2`}>Mardi</Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Mercredi")}
                  onChange={() => this.setGroupe("Mercredi")}
                />
                <Text style={tw`text-lg ml-2`}>Mercredi</Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Jeudi")}
                  onChange={() => this.setGroupe("Jeudi")}
                />
                <Text style={tw`text-lg ml-2`}>Jeudi</Text>
              </View>
            </View>

            <View style={tw`flex-col`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Vendredi")}
                  onChange={() => this.setGroupe("Vendredi")}
                />
                <Text style={tw`text-lg ml-2`}>Vendredi</Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Samedi")}
                  onChange={() => this.setGroupe("Samedi")}
                />
                <Text style={tw`text-lg ml-2`}>Samedi</Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Checkbox
                  checked={this.state.groupe.includes("Dimanche")}
                  onChange={() => this.setGroupe("Dimanche")}
                />
                <Text style={tw`text-lg ml-2`}>Dimanche</Text>
              </View>
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

export default Automne_Presence;
