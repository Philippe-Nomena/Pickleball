import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// import Hiver_Session from "./hiver";
// import Automne_Session from "./automne";
import Ete_Session from "./ete";

const Tab = createMaterialTopTabNavigator();

// function Ete() {
//   return (
//     <View style={styles.scene}>
//       <Ete_Session />
//     </View>
//   );
// }

// function Hiver() {
//   return (
//     <View style={styles.scene}>
//       <Hiver_Session />
//     </View>
//   );
// }

// function Automne() {
//   return (
//     <View style={styles.scene}>
//       <Automne_Session />
//     </View>
//   );
// }

export default function Session() {
  return (
    // <Tab.Navigator aria-hidden:false>
    //   <Tab.Screen name="Ete" component={Ete} />
    //   <Tab.Screen name="Hiver" component={Hiver} />
    //   <Tab.Screen name="Automne" component={Automne} />
    // </Tab.Navigator>
    <View style={styles.scene}>
      <Ete_Session />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "white",
  },
  tabBar: {
    backgroundColor: "black",
  },
  label: {
    textTransform: "capitalize",
  },
});
