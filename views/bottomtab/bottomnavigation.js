import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Liste_attente from "../liste_attente/liste_attente";
import Bonus from "../bonus/bonus";
import Presence from "../presence/presence";
import Session from "../session/session";

const Tab = createBottomTabNavigator();

const Bottomnavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Pratiquants"
      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Pratiquants"
        component={Liste_attente}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bonus"
        component={Bonus}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Présence"
        component={Presence}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="co-present" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Session"
        component={Session}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-cloudy"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Bottomnavigation;
