import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import Hiver_Session from "./hiver";
import Automne_Session from "./automne";
import Ete_Session from "./ete";

const Tab = createMaterialTopTabNavigator();

function Ete() {
  return (
    <View style={styles.scene}>
      <Ete_Session />
    </View>
  );
}

function Hiver() {
  return (
    <View style={styles.scene}>
      <Hiver_Session />
    </View>
  );
}

function Automne() {
  return (
    <View style={styles.scene}>
      <Automne_Session />
    </View>
  );
}

export default function Session() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Ete") {
            iconName = "wb-sunny";
          } else if (route.name === "Hiver") {
            iconName = "ac-unit";
          } else if (route.name === "Automne") {
            iconName = "eco";
          }

          return (
            <MaterialIcons
              name={iconName}
              size={20}
              color={focused ? "white" : "white"}
            />
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.label, { color: focused ? "white" : "white" }]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.indicator,
      })}
    >
      <Tab.Screen name="Ete" component={Ete} />
      <Tab.Screen name="Hiver" component={Hiver} />
      <Tab.Screen name="Automne" component={Automne} />
    </Tab.Navigator>
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
