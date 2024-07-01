import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";

import { Checkbox } from "../presence/checkbox";
import tw from "tailwind-react-native-classnames";
import { url } from "../url";
import { FlatList } from "react-native";
const Scheduler = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState({});
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("10:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState([]);
  const [perDate, setPerDate] = useState([]);
  const [pratiquant, setPratiquant] = useState([]);
  const [perPratiquant, setPerPratiquant] = useState([]);

  useEffect(() => {
    fetchAllPratiquant();
  }, []);
  useEffect(
    (selectedDate) => {
      fetchPerDate(selectedDate);
    },
    [selectedDate]
  );
  const fetchAllPratiquant = async () => {
    try {
      const response = await url.get(`/presence`);
      setPratiquant(response.data);
    } catch (error) {
      console.error("Error fetching All pratiquant data:", error);
    }
  };

  const fetchPerDate = async (date) => {
    try {
      const response = await url.get(`/presence/bydate?createdAt=${date}`);
      setPerDate(response.data);
    } catch (error) {
      console.error("Error fetching per pratiquant data:", error);
    }
  };

  const handleAddEvent = () => {
    if (!eventName || !selectedDate) {
      alert("Event name and date are required!");
      return;
    }

    const newEvent = {
      name: eventName,
      time: eventTime,
      isRecurring,
      recurrenceDays,
    };

    setEvents((prevEvents) => {
      const dateEvents = prevEvents[selectedDate] || [];
      return {
        ...prevEvents,
        [selectedDate]: [...dateEvents, newEvent],
      };
    });

    setEventName("");
    setEventTime("10:00");
    setIsRecurring(false);
    setRecurrenceDays([]);
  };

  const renderEvents = (date) => {
    if (!events[date]) return null;
    return events[date].map((event, index) => (
      <View key={index} style={tw`bg-gray-200 p-2 my-1 rounded-md`}>
        <Text style={tw`text-black font-bold`}>{event.name}</Text>
        <Text style={tw`text-black`}>{event.time}</Text>
        {event.isRecurring && (
          <Text style={tw`text-black`}>
            Recurring on: {event.recurrenceDays.join(", ")}
          </Text>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black p-4`}>
      <ScrollView>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: "blue",
            },
            ...Object.keys(events).reduce((acc, date) => {
              acc[date] = { marked: true };
              return acc;
            }, {}),
          }}
        />
        <View style={tw`mt-4`}>
          <Text style={tw`text-lg text-white font-bold`}>Add Event</Text>
          <TextInput
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={tw`bg-gray-200 p-2 rounded-md my-2`}
          />
          <TextInput
            placeholder="Event Time"
            value={eventTime}
            onChangeText={setEventTime}
            style={tw`bg-gray-200 p-2 rounded-md my-2`}
          />
          <View style={tw`flex-row items-center my-2`}>
            <Checkbox
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
            />
            <Text style={tw`text-white ml-2`}>Recurring Event</Text>
          </View>
          {isRecurring && (
            <View style={tw`my-2`}>
              <Text style={tw`text-white font-bold`}>Recurrence Days</Text>
              <View style={tw`flex-row flex-wrap`}>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={tw`p-2 bg-gray-300 m-1 rounded-md ${recurrenceDays.includes(day) ? "bg-blue-300" : ""}`}
                    onPress={() =>
                      setRecurrenceDays((prevDays) =>
                        prevDays.includes(day)
                          ? prevDays.filter((d) => d !== day)
                          : [...prevDays, day]
                      )
                    }
                  >
                    <Text>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity
            style={tw`bg-blue-500 p-2 rounded-md my-2`}
            onPress={handleAddEvent}
          >
            <Text style={tw`text-white text-center`}>Add Event</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-4`}>
          <Text style={tw`text-lg text-white font-bold`}>
            Pratiquants qui était présent le {selectedDate}
          </Text>
          {/* {renderEvents(selectedDate)} */}
        </View>
        <FlatList
          data={perDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.nom}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scheduler;
