import React from "react";
import { View, StyleSheet, Text } from "react-native";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { MaterialIcons } from "@expo/vector-icons";

// import Hiver_Presence from "./hiver";
// import Automne_Presence from "./automne";
import Ete_Presence from "./ete";

// const Tab = createMaterialTopTabNavigator();

// function Ete() {
//   return (
//     <View style={styles.scene}>
//       <Ete_Presence />
//     </View>
//   );
// }

// function Hiver() {
//   return (
//     <View style={styles.scene}>
//       <Hiver_Presence />
//     </View>
//   );
// }

// function Automne() {
//   return (
//     <View style={styles.scene}>
//       <Automne_Presence />
//     </View>
//   );
// }

export default function Presence() {
  return (
    // <Tab.Navigator
    //   screenOptions={({ route }) => ({
    //     tabBarIcon: ({ focused }) => {
    //       let iconName;

    //       if (route.name === "Ete") {
    //         iconName = "wb-sunny";
    //       } else if (route.name === "Hiver") {
    //         iconName = "ac-unit";
    //       } else if (route.name === "Automne") {
    //         iconName = "eco";
    //       }

    //       return (
    //         <MaterialIcons
    //           name={iconName}
    //           size={20}
    //           color={focused ? "white" : "white"}
    //         />
    //       );
    //     },
    //     tabBarLabel: ({ focused }) => (
    //       <Text style={[styles.label, { color: focused ? "white" : "white" }]}>
    //         {route.name}
    //       </Text>
    //     ),
    //     tabBarStyle: styles.tabBar,
    //     tabBarIndicatorStyle: styles.indicator,
    //   })}
    // >
    //   <Tab.Screen name="Ete" component={Ete} />
    //   <Tab.Screen name="Hiver" component={Hiver} />
    //   <Tab.Screen name="Automne" component={Automne} />
    // </Tab.Navigator>
    <View style={styles.scene}>
      <Ete_Presence />
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
    display: "flex-row",
  },
  label: {
    textTransform: "capitalize",
  },
});
