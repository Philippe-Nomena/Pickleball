import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminScreen from "./views/connexion/AdminScreen";
import UsersScreen from "./views/connexion/UsersScreen";
import Signup from "./views/connexion/signup";
import { AuthProvider, useAuth } from "./views/connexion/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import Forget_pass from "./views/connexion/forget_pass";
import Activity from "./views/activity/activity";
import Session from "./views/session/session";
import Liste_attente from "./views/liste_attente/liste_attente";
import Presence from "./views/presence/presence";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Scheduler from "./views/scheduler/scheduler";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const UsersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
    }}
  >
    <Stack.Screen
      name="User"
      component={UsersScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Forget_pass"
      component={Forget_pass}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const TabScreens = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === "Admin") {
          iconName = "home";
        } else if (route.name === "Users") {
          iconName = "user";
        }

        return <AntDesign name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "black",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Admin" component={AdminScreen} />
    <Tab.Screen name="Users" component={UsersStack} />
  </Tab.Navigator>
);

function CustomDrawerContent(props) {
  const { navigation } = props;
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnecter",
          onPress: async () => {
            await logout();
            navigation.navigate("Tabs");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={tw`flex-1 bg-black`}>
      <DrawerContentScrollView {...props} contentContainerStyle={tw`flex-1`}>
        <DrawerItemList {...props} />
        <View style={tw`flex-1`} />
        <TouchableOpacity
          style={tw`bg-black flex-row items-center p-2 ml-4 mb-4`}
          onPress={
            isAuthenticated ? handleLogout : () => navigation.navigate("Tabs")
          }
        >
          <FontAwesome5 name="sign-out-alt" size={24} color="white" />
          <Text style={tw`text-white ml-6`}>
            {isAuthenticated ? "Déconnexion" : "Connexion"}
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}

const DrawerScreens = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: "black",
      },
      drawerActiveTintColor: "white",
      drawerInactiveTintColor: "gray",
    }}
  >
    <Drawer.Screen
      name="Activites"
      component={Activity}
      options={{
        drawerIcon: () => (
          <MaterialCommunityIcons name="view-list" size={24} color="white" />
        ),
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
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
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    />
    <Drawer.Screen
      name="Liste des attentes"
      component={Liste_attente}
      options={{
        drawerIcon: () => (
          <MaterialCommunityIcons name="view-list" size={24} color="white" />
        ),
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    />
    <Drawer.Screen
      name="Presence"
      component={Presence}
      options={{
        drawerIcon: () => (
          <MaterialIcons name="co-present" size={24} color="white" />
        ),
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    />
    <Drawer.Screen
      name="Liste de presence"
      component={Scheduler}
      options={{
        drawerIcon: () => <AntDesign name="gift" size={24} color="white" />,
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    />
  </Drawer.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tabs"
      component={TabScreens}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Activite"
      component={DrawerScreens}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
