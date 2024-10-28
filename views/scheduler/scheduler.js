import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "tailwind-react-native-classnames";
import { FlatList } from "react-native";
import { url } from "../url";
import dayjs from "dayjs";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const Scheduler = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [pratiquantsByDate, setPratiquantsByDate] = useState([]);
  const [allPratiquants, setAllPratiquants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPratiquants();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formatDate = dayjs(selectedDate).format("YYYY-MM-DD");
      fetchPratiquantsByDate(formatDate);
    } else {
      setPratiquantsByDate(allPratiquants);
    }
  }, [selectedDate]);

  const fetchAllPratiquants = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const response = await url.get(`/presence`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uniquePratiquants = removeDuplicates(response.data);
      setAllPratiquants(uniquePratiquants);
      setPratiquantsByDate(uniquePratiquants);
    } catch (error) {
      console.error("Error fetching all pratiquants:", error.message);
      console.error("Error details:", error.response?.data || error.toJSON());
      Alert.alert("Error fetching all pratiquants", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPratiquantsByDate = async (date) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const response = await url.get("/presence/bydate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date },
      });

      const uniquePratiquants = removeDuplicates(response.data);
      setPratiquantsByDate(uniquePratiquants);
    } catch (error) {
      console.error("Error fetching pratiquants by date:", error.message);
      console.error("Error details:", error.response?.data || error.toJSON());
      Alert.alert("Error fetching pratiquants by date", error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter((item) => {
      const duplicate = seen.has(item.id);
      seen.add(item.id);
      return !duplicate;
    });
  };
  // const handleExport = async () => {
  //   try {
  //     const htmlContent = `
  //       <h1>Liste de Présence</h1>
  //       <table border="1" style="width:100%; border-collapse: collapse;">
  //         <tr>
  //           <th>Nom</th>

  //           <th>Jour</th>

  //         </tr>
  //         ${pratiquantsByDate
  //           .map(
  //             (item) => `
  //           <tr>
  //             <td>${item.pratiquant.nom}</td>

  //             <td>${item.jour}</td>

  //           </tr>
  //         `
  //           )
  //           .join("")}
  //       </table>
  //     `;

  //     // Créer le fichier PDF
  //     const { uri } = await Print.printToFileAsync({
  //       html: htmlContent,

  //     });

  //     console.log("PDF file created at: ", uri);

  //     // Utiliser expo-sharing pour ouvrir le fichier
  //     if (await Sharing.isAvailableAsync()) {
  //       await Sharing.shareAsync(uri);
  //     } else {
  //       Alert.alert(
  //         "Sharing not available",
  //         "Sharing is not available on this device"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error exporting PDF:", error);
  //     Alert.alert("Error", "Failed to export PDF");
  //   }
  // };
  const handleExport = async () => {
    try {
      const htmlContent = `
        <h1>Liste de Présence</h1>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <tr>
            <th>Nom</th>
            <th>Jour</th>
          </tr> 
          ${pratiquantsByDate
            .map(
              (item) => `
            <tr>
              <td>${item.pratiquant.nom}</td>
              <td>${item.jour}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      `;

      // Sanitize the file name by replacing unsupported characters
      const sanitizedFileName = `Liste_de_presence_${selectedDate.replace(/[/\\?%*:|"<>]/g, "-")}`;

      // Create the PDF file
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        fileName: sanitizedFileName,
      });

      console.log(
        "PDF file created with sanitized file name: ",
        sanitizedFileName
      );
      console.log("PDF file URI: ", uri);

      // Use expo-sharing to open the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        // await Sharing.shareAsync(uri, {
        //   mimeType: "application/pdf",
        //   dialogTitle: `Share ${sanitizedFileName}`,
        //   UTI: "com.adobe.pdf",
        // });
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on this device"
        );
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      Alert.alert("Error", "Failed to export PDF");
    }
  };

  const renderPratiquants = () => {
    if (pratiquantsByDate.length === 0) {
      return (
        <View style={tw`p-4`}>
          <Text style={tw`text-white text-lg`}>
            Aucun pratiquant présent pour cette date.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={pratiquantsByDate}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`bg-gray-200 p-2 my-1 rounded-md`}>
            <Text style={tw`text-black font-bold`}>{item.pratiquant.nom}</Text>
            <Text>{item.jour}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black p-4`}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: "gray",
          },
        }}
      />
      <View style={tw`mt-4`}>
        <View
          style={tw`flex-row items-center justify-between w-full px-4 mb-3`}
        >
          <Text style={tw`text-lg text-white font-bold`}>
            Pratiquants présents le {selectedDate || "tous les jours"}
          </Text>
          <TouchableOpacity
            style={tw`bg-black p-2 border border-gray-300 rounded-lg flex-row items-center`}
            onPress={handleExport}
          >
            <MaterialIcons name="download" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Text style={tw`text-white`}>Chargement...</Text>
      ) : (
        renderPratiquants()
      )}
    </SafeAreaView>
  );
};

export default Scheduler;
