import * as React from "react";
import { Text, StyleSheet, View, Pressable, TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Color, Border, FontFamily, FontSize } from "../GlobalStyles";

const Login = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.iphone11ProX18}>
      <Text style={styles.pickleapp}>PickleApp</Text>
      <View style={[styles.iphone11ProX18Child, styles.iphone11Bg]} />
      <Pressable
        style={[styles.iphone11ProX18Item, styles.iphone11ProX18ItemLayout]}
        onPress={() => navigation.navigate("IPhone11ProX")}
      />
      <Text style={[styles.seConnecter, styles.textTypo]}>Se connecter</Text>
      <Text style={[styles.bienvenueSurPickleapp, styles.textTypo]}>
        Bienvenue sur PickleApp
      </Text>
      <Pressable
        style={styles.vousNavezPasContainer}
        onPress={() => navigation.navigate("IPhone11ProX12")}
      >
        <Text style={[styles.text, styles.textTypo]}>
          <Text style={styles.vousNavezPas}>Vous n’avez pas de compte?</Text>
          <Text style={styles.sinscrire}> S’inscrire</Text>
        </Text>
      </Pressable>
      <View style={[styles.rectangleParent, styles.rectangleShadowBox]}>
        <View style={[styles.groupChild, styles.groupPosition]} />
        <TextInput
          style={[styles.user554125, styles.ouTypo]}
          placeholder="User554125"
        />
      </View>
      <Text style={[styles.motDePasse, styles.ouTypo]}>
        Mot de passe oubliée?
      </Text>
      <View style={[styles.rectangleGroup, styles.rectangleShadowBox]}>
        <View style={[styles.groupChild, styles.groupPosition]} />

        <TextInput
          style={[styles.user554125, styles.ouTypo]}
          placeholder="********************"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iphone11Bg: {
    backgroundColor: Color.colorDarkslateblue,
    borderRadius: Border.br_7xs,
  },
  iphone11ProX18ItemLayout: {
    height: "4.06%",
    position: "absolute",
  },
  textTypo: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: "700",
    fontSize: FontSize.size_smi,
    textAlign: "center",
  },
  rectangleShadowBox: {
    width: "87.47%",
    left: "6.67%",
    height: "4.56%",
    right: "5.87%",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
  },
  groupPosition: {
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
    borderRadius: Border.br_7xs,
    position: "absolute",
    width: "100%",
  },
  ouTypo: {
    textAlign: "left",
    fontFamily: FontFamily.robotoBold,
    fontWeight: "700",
    fontSize: FontSize.size_smi,
    position: "absolute",
  },

  pickleapp: {
    top: "25.99%",
    left: "34.4%",
    fontSize: FontSize.size_5xl,
    fontWeight: "900",
    fontFamily: FontFamily.robotoBlack,
    textAlign: "center",
    color: Color.colorWhite,
    position: "absolute",
  },
  iphone11ProX18Child: {
    height: "9.36%",
    width: "20.27%",
    top: "15.39%",
    right: "39.73%",
    bottom: "75.25%",
    left: "40%",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_7xs,
    position: "absolute",
  },
  iphone11ProX18Item: {
    width: "33.6%",
    top: "53.08%",
    bottom: "42.86%",
    left: "60.53%",
    right: "5.87%",
    backgroundColor: Color.colorDarkslateblue,
    borderRadius: Border.br_7xs,
  },
  seConnecter: {
    width: "23.2%",
    top: "54.19%",
    left: "62.67%",
    color: Color.colorWhitesmoke_300,
    height: "1.85%",
  },
  bienvenueSurPickleapp: {
    width: "54.93%",
    top: "31.77%",
    left: "22.67%",
    height: "4.06%",
    position: "absolute",
    color: Color.colorWhite,
  },
  vousNavezPas: {
    color: Color.colorWhite,
  },
  sinscrire: {
    color: Color.colorDarkgray,
  },

  vousNavezPasContainer: {
    left: "6.4%",
    top: "63.6%",
    position: "absolute",
  },
  groupChild: {
    backgroundColor: Color.colorGainsboro_100,
  },
  user554125: {
    height: "40.54%",
    width: "42.38%",
    top: "29.73%",
    left: "3.66%",
    color: Color.colorGray_200,
  },
  rectangleParent: {
    top: "39.29%",
    bottom: "56.16%",
    left: "6.67%",
  },
  motDePasse: {
    width: "44.27%",
    top: "54.43%",
    left: "6.67%",
    height: "1.85%",
    color: Color.colorWhite,
  },
  rectangleGroup: {
    top: "46.18%",
    bottom: "49.26%",
    left: "6.67%",
  },

  iphone11ProX18: {
    borderRadius: Border.br_lg,
    backgroundColor: Color.colorGray_300,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default Login;
