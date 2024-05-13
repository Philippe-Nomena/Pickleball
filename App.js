import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import Liste_attente from "./views/liste_attente/liste_attente";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Bonus from "./views/bonus/bonus";
import Presence from "./views/presence/presence";
import Session from "./views/session/session";
import Bottomnavigation from "./views/bottomtab/bottomnavigation";
import Login from "./views/connexion/login";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          drawerContentStyle: { backgroundColor: "black" },
          drawerLabelStyle: { color: "white" },
          drawerActiveBackgroundColor: "gray",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
      >
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="view-list"
                size={24}
                color="white"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Pratiquants"
          component={Liste_attente}
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="view-list"
                size={24}
                color="white"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Bonus"
          component={Bonus}
          options={{
            drawerIcon: () => <AntDesign name="gift" size={24} color="white" />,
          }}
        />
        <Drawer.Screen
          name="Présence"
          component={Presence}
          options={{
            drawerIcon: () => (
              <MaterialIcons name="co-present" size={24} color="white" />
            ),
          }}
        />
        <Drawer.Screen
          name="Session"
          component={Session}
          options={{
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="weather-cloudy"
                size={24}
                color="white"
              />
            ),
          }}
        />
      </Drawer.Navigator>
      {/* <Bottomnavigation /> */}
    </NavigationContainer>
  );
}
