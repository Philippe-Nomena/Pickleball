import React, { useState } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";
import Ete_liste from "./ete";
import Hiver_liste from "./hiver";
import Automne_liste from "./automne";

const Ete = () => (
  <View style={styles.scene}>
    <Ete_liste />
  </View>
);

const Hiver = () => (
  <View style={styles.scene}>
    <Hiver_liste />
  </View>
);

const Automne = () => (
  <View style={styles.scene}>
    <Automne_liste />
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
          color={focused ? "white" : "white"}
        />
        <Text style={[styles.label, { color: focused ? "white" : "white" }]}>
          {route.title}
        </Text>
      </View>
    )}
    style={styles.tabBar}
    indicatorStyle={styles.indicator}
  />
);

const Liste_attente = () => {
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
    backgroundColor: "black",
  },
  indicator: {
    backgroundColor: "white",
  },
  scene: {
    marginTop: 2,

    justifyContent: "center",
  },
  tabView: {
    flex: 1,
    width: "100%",
  },
  tabBar: {
    height: "6%",
    backgroundColor: "black",
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

export default Liste_attente;
