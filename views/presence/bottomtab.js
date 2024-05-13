// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { FontAwesome5 } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator();

// export default BottomTab = ({
//   screen1Name,
//   screen1Component,
//   screen2Name,
//   screen2Component,
// }) => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === screen1Name) {
//             iconName = "calendar";
//           } else if (route.name === screen2Name) {
//             iconName = "list";
//           }

//           return <FontAwesome5 name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "blue",
//         tabBarInactiveTintColor: "black",
//       })}
//     >
//       <Tab.Screen
//         name={screen1Name}
//         options={{ headerShown: false }}
//         component={screen1Component}
//       />
//       <Tab.Screen
//         name={screen2Name}
//         options={{ headerShown: false }}
//         component={screen2Component}
//       />
//     </Tab.Navigator>
//   );
// };
import * as React from "react";
import { Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Liste_attente from "../liste_attente/liste_attente";

function Feed() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Feed!</Text>
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Pratiquants"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Pratiquants"
        component={Liste_attente}
        options={{
          // tabBarLabel: "Prat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        // name="Notifications"
        // component={Notifications}
        options={{
          // tabBarLabel: "Updates",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        // name="Profile"
        // component={Profile}
        options={{
          // tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
