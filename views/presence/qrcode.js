import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function BarcodeScannerScreen({ onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState(Camera.Constants.Type.back);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    Alert.alert(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
    setScanned(true);
    onScan(data);
  };

  const toggleCameraFacing = () => {
    setFacing((current) =>
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const scanAgain = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={() =>
            Camera.requestCameraPermissionsAsync().then(({ status }) =>
              setHasPermission(status === "granted")
            )
          }
          title="Grant permission"
        />
      </View>
    );
  }

  return (
    <View style={tw` justify-center items-center`}>
      {isCameraActive && (
        <View style={tw`flex-1 w-full h-40`}>
          <Camera
            style={tw`flex-1 w-full`}
            type={facing}
            ref={(ref) => (cameraRef.current = ref)}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={tw`flex-row`}>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <FontAwesome6 name="camera-rotate" size={20} color="white" />
              </TouchableOpacity>
              {scanned && (
                <TouchableOpacity
                  style={tw`bg-transparent w-10 h-10 items-center justify-center rounded-md`}
                  onPress={scanAgain}
                >
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </Camera>
        </View>
      )}
      <View>
        <TouchableOpacity onPress={toggleCamera}>
          {isCameraActive ? (
            <MaterialCommunityIcons name="camera-off" size={30} color="white" />
          ) : (
            <MaterialIcons name="camera" size={64} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
  button: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
