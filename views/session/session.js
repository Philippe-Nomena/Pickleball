import React, { useState } from "react";
import { View, StyleSheet, Dimensions, StatusBar, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";

import Hiver_Session from "./hiver";
import Automne_Session from "./automne";
import Ete_Session from "./ete";

const Ete = () => (
  <View style={styles.scene}>
    <Ete_Session />
  </View>
);

const Hiver = () => (
  <View style={styles.scene}>
    <Hiver_Session />
  </View>
);

const Automne = () => (
  <View style={styles.scene}>
    <Automne_Session />
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

const Session = () => {
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
    backgroundColor: "white",
  },
  scene: {
    flex: 1,
  },
  tabView: {
    flex: 1,
    width: "100%",
  },
  tabBar: {
    backgroundColor: "black",
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

export default Session;
