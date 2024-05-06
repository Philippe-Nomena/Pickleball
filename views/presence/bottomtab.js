import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default BottomTab = ({
  screen1Name,
  screen1Component,
  screen2Name,
  screen2Component,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === screen1Name) {
            iconName = "calendar";
          } else if (route.name === screen2Name) {
            iconName = "list";
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "black",
      })}
    >
      <Tab.Screen
        name={screen1Name}
        options={{ headerShown: false }}
        component={screen1Component}
      />
      <Tab.Screen
        name={screen2Name}
        options={{ headerShown: false }}
        component={screen2Component}
      />
    </Tab.Navigator>
  );
};
