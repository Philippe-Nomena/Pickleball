import React, { useState } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";
import Ete_Presence from "./ete";
import Automne_Presence from "./automne";
import { Hiver_Presence } from "./hiver";
import BottomTab from "./bottomtab";
import Ete_liste_presente from "./ete/liste_ete";
// import Hiver_liste_presente from "./hiver/liste_hiver";
// import Automne_liste_presente from "./automne/liste_automne";
import BarcodeScannerScreen from "./qrcode";

const Ete = () => (
  <View style={styles.scene}>
    <BottomTab
      screen1Name="Presence Ete"
      screen1Component={Ete_Presence}
      screen2Name="Liste de presence Ete"
      screen2Component={Ete_liste_presente}
    />
  </View>
);

const Hiver = () => (
  <View style={styles.scene}>
    {/* <BottomTab
      screen1Name="Presence Hiver"
      screen1Component={Hiver_Presence}
      screen2Name="Liste de presence Hiver"
      screen2Component={Hiver_liste_presente}
    /> */}
    <BarcodeScannerScreen />
  </View>
);

const Automne = () => (
  <View style={styles.scene}>
    {/* <BottomTab
      screen1Name="Presence Automne"
      screen1Component={Automne_Presence}
      screen2Name="Liste de presence Automne"
      screen2Component={Automne_liste_presente}
    /> */}
  </View>
);

const renderTabBar = (props) => (
  <TabBar
    {...props}
    renderLabel={({ route, focused }) => (
      <View style={styles.tabItem}>
        <MaterialIcons
          name={
            route.key === "ete"
              ? "wb-sunny"
              : route.key === "hiver"
              ? "ac-unit"
              : "ac-unit"
          }
          size={20}
          color={focused ? "brown" : "black"}
        />
        <Text style={[styles.label, { color: focused ? "brown" : "black" }]}>
          {route.title}
        </Text>
      </View>
    )}
    style={styles.tabBar}
    indicatorStyle={styles.indicator}
  />
);

const Presence = () => {
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState({
    width: Dimensions.get("window").width,
  });

  const handleLayout = () => {
    setLayout({ width: Dimensions.get("window").width });
  };

  const routes = [
    { key: "ete", title: "Ete" },
    { key: "hiver", title: "Hiver" },
    { key: "automne", title: "Automne" },
  ];

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          ete: Ete,
          hiver: Hiver,
          automne: Automne,
        })}
        onIndexChange={setIndex}
        initialLayout={layout}
        style={styles.tabView}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    backgroundColor: "brown",
  },
  scene: {
    flex: 1,
  },
  tabView: {
    flex: 1,
    width: "100%",
  },
  tabBar: {
    backgroundColor: "white",
    height: "6%",
  },
  label: {
    textTransform: "capitalize",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
});

export default Presence;
