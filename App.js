import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Liste_attente from "./views/liste_attente/liste_attente";
import Bonus from "./views/bonus/bonus";
import Presence from "./views/presence/presence";
import Session from "./views/session/session";
// import Bottomnavigation from "./views/bottomtab/bottomnavigation";
import Login from "./views/connexion/login";
import Signup from "./views/connexion/signup";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Forget_pass from "./views/connexion/forget_pass";
import Activity from "./views/activity/activity";
import Test_sqlite from "./views/bonus/test_sqlite";
import Scheduler from "./views/scheduler/scheduler";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Forget_pass"
        component={Forget_pass}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Activités"
        screenOptions={{
          drawerContentStyle: { backgroundColor: "black" },
          drawerLabelStyle: { color: "white" },
          drawerActiveBackgroundColor: "gray",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
      >
        <Drawer.Screen
          name="Auth"
          component={AuthStack}
          options={{
            drawerLabel: () => null,
            headerShown: false,
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
          name="Activités"
          component={Activity}
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
        <Drawer.Screen
          name="Sqlite_test"
          component={Test_sqlite}
          options={{
            drawerIcon: () => <AntDesign name="gift" size={24} color="white" />,
          }}
        />
        <Drawer.Screen
          name="Scheduler"
          component={Scheduler}
          options={{
            drawerIcon: () => <AntDesign name="gift" size={24} color="white" />,
          }}
        />
      </Drawer.Navigator>
      {/* <Bottomnavigation /> */}
    </NavigationContainer>
  );
}

// PAGE DETAILS
// NAVIGATION PUSH
//
