// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import { Calendar } from "react-native-calendars";
// import tw from "tailwind-react-native-classnames";
// import { url } from "../url";
// import { FlatList } from "react-native";

// const Scheduler = () => {
//   const [selectedDate, setSelectedDate] = useState("");
//   const [pratiquantsByDate, setPratiquantsByDate] = useState([]);
//   const [allPratiquants, setAllPratiquants] = useState([]);

//   useEffect(() => {
//     fetchAllPratiquants();
//   }, []);

//   useEffect(() => {
//     if (selectedDate) {
//       fetchPratiquantsByDate(selectedDate);
//     } else {
//       setPratiquantsByDate([]);
//     }
//   }, [selectedDate]);

//   const fetchAllPratiquants = async () => {
//     try {
//       const response = await url.get(`/presence`);
//       setAllPratiquants(response.data);
//     } catch (error) {
//       console.error("Error fetching all pratiquants:", error);
//     }
//   };

//   const fetchPratiquantsByDate = async (date) => {
//     try {
//       const response = await url.get("/presence/bydate", {
//         params: {
//           createdAt: date,
//         },
//       });
//       return setPratiquantsByDate(response.data);
//     } catch (error) {
//       console.error("Error fetching pratiquants by date:", error);
//       throw error;
//     }
//   };

//   const renderPratiquants = () => {
//     if (selectedDate) {
//       return (
//         <FlatList
//           data={pratiquantsByDate}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={tw`bg-gray-200 p-2 my-1 rounded-md`}>
//               <Text style={tw`text-black font-bold`}>{item.nom}</Text>
//             </View>
//           )}
//         />
//       );
//     } else {
//       return (
//         <FlatList
//           data={allPratiquants}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={tw`bg-gray-200 p-2 my-1 rounded-md`}>
//               <Text style={tw`text-black font-bold`}>{item.nom}</Text>
//             </View>
//           )}
//         />
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={tw`flex-1 bg-black p-4`}>
//       <Calendar
//         onDayPress={(day) => setSelectedDate(day.dateString)}
//         markedDates={{
//           [selectedDate]: {
//             selected: true,
//             marked: true,
//             selectedColor: "blue",
//           },
//         }}
//       />
//       <View style={tw`mt-4`}>
//         <Text style={tw`text-lg text-white font-bold`}>
//           Pratiquants présents le {selectedDate || "tous les jours"}
//         </Text>
//       </View>
//       {renderPratiquants()}
//     </SafeAreaView>
//   );
// };

// export default Scheduler;
// Scheduler.js
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "tailwind-react-native-classnames";
import { FlatList } from "react-native";
import { url } from "../url";
import dayjs from "dayjs";

const Scheduler = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [pratiquantsByDate, setPratiquantsByDate] = useState([]);
  const [allPratiquants, setAllPratiquants] = useState([]);

  useEffect(() => {
    fetchAllPratiquants();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formatDate = dayjs(selectedDate).format("YYYY-DD-MM");
      fetchPratiquantsByDate(formatDate);
    } else {
      setPratiquantsByDate(allPratiquants);
    }
  }, [selectedDate, allPratiquants]);

  const fetchAllPratiquants = async () => {
    try {
      const response = await url.get(`/presence`);
      setAllPratiquants(response.data);
      if (!selectedDate) {
        setPratiquantsByDate(response.data);
      }
    } catch (error) {
      console.error("Error fetching all pratiquants:", error.message);
      console.error("Error details:", error.response?.data || error.toJSON());
    }
  };

  const fetchPratiquantsByDate = async (date) => {
    console.log("Fetching pratiquants for date:", date);
    try {
      const response = await url.get("/presence/bydate", {
        params: {
          date: date,
        },
      });
      setPratiquantsByDate(response.data);
    } catch (error) {
      console.error("Error fetching pratiquants by date:", error.message);
      console.error("Error details:", error.response?.data || error.toJSON());
    }
  };

  const renderPratiquants = () => {
    return (
      <FlatList
        data={pratiquantsByDate}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`bg-gray-200 p-2 my-1 rounded-md`}>
            <Text style={tw`text-black font-bold`}>{item.nom}</Text>
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
      {renderPratiquants()}
    </SafeAreaView>
  );
};

export default Scheduler;
