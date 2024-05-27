import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export const Checkbox = ({ label, checked, onChange }) => {
  return (
    <View>
      <TouchableOpacity
        style={tw`flex-row items-center mb-2`}
        onPress={onChange}
        activeOpacity={0.8}
      >
        {checked ? (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#3182CE"
            style={tw`mr-2`}
          />
        ) : (
          <View
            style={[
              tw`w-6 h-6 rounded border border-gray-400 `,
              checked && tw`bg-blue-500 border-blue-500`,
            ]}
          />
        )}
        <Text style={tw`text-lg`}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};
