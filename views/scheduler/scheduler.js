import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "tailwind-react-native-classnames";
import { FlatList } from "react-native";
import { url } from "../url";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            <Text style={tw`text-black font-bold`}>{item.nom}</Text>
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
        <Text style={tw`text-lg text-white font-bold`}>
          Pratiquants présents le {selectedDate || "tous les jours"}
        </Text>
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
