import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { url } from "../url";
import tw from "tailwind-react-native-classnames";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";

const Bonus = () => {
  const [pratiquants, setPratiquants] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPratiquants = async () => {
      try {
        const response = await url.get("/pratiquants");
        setPratiquants(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pratiquants:", error);
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      }
    };

    fetchPratiquants();
  }, []);

  const exportData = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      console.log("Starting export process...");

      const zip = new JSZip();
      let csvContent = "ID,BarcodeFileName\n";

      // Download each barcode image and add to zip
      for (const item of pratiquants) {
        const fileName = `barcode_${item.id}.png`;
        console.log(`Downloading barcode for ID ${item.id}...`);

        const { uri } = await FileSystem.downloadAsync(
          item.barcodeUrl,
          FileSystem.cacheDirectory + fileName
        );

        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        zip.file(fileName, fileContent, { base64: true });

        csvContent += `${item.id},${fileName}\n`;
        console.log(`Added barcode for ID ${item.id} to zip`);
      }

      // Add CSV to zip
      zip.file("barcodes.csv", csvContent);

      // Generate zip file
      const zipContent = await zip.generateAsync({ type: "base64" });

      // Save zip file
      const zipFileName = `barcodes_${new Date().getTime()}.zip`;
      const zipUri = FileSystem.documentDirectory + zipFileName;
      await FileSystem.writeAsStringAsync(zipUri, zipContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Zip file created:", zipUri);

      // Share the zip file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(zipUri);
        console.log("Zip file shared successfully");

        Alert.alert(
          "Export Successful",
          "The barcodes have been exported successfully. You can now save or share the zip file.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        throw new Error("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert(
        "Error",
        "An error occurred while exporting data: " + error.message
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-black text-lg text-center mb-4`}>
        Toutes les barcodes
      </Text>
      <TouchableOpacity
        onPress={exportData}
        style={tw`bg-blue-500 p-2 rounded mb-4`}
        disabled={isExporting}
      >
        <Text style={tw`text-white text-center`}>
          {isExporting ? "Exporting..." : "Export Data"}
        </Text>
      </TouchableOpacity>
      <Text style={tw`text-sm text-gray-600 mb-4 text-center`}>
        After exporting, you can save or share the zip file containing all
        barcodes.
      </Text>
      <FlatList
        data={pratiquants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`mb-4 items-center flex-row justify-center`}>
            <Text style={tw`mr-2`}>{item.id.toString()}</Text>
            {item.barcodeUrl && (
              <Image source={{ uri: item.barcodeUrl }} style={tw`w-40 h-10`} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Bonus;
