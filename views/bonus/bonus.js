// import React from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   Text,
//   useColorScheme,
//   View,
// } from "react-native";

// import {
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from "react-native/Libraries/NewAppScreen";

// const Section = ({ children, title }) => {
//   return (
//     <View className="mt-8 px-2">
//       <Text className="text-2xl text-black dark:text-white">{title}</Text>
//       <Text className="mt-2 text-lg text-black dark:text-white">
//         {children}
//       </Text>
//     </View>
//   );
// };

// const Bonus = () => {
//   const isDarkMode = useColorScheme() === "dark";
//   const backgroundStyle = "bg-neutral-300 dark:bg-slate-900";

//   return (
//     <SafeAreaView className={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         className={backgroundStyle}
//       >
//         <Header />

//         <View className="bg-white dark:bg-black">
//           <Section title="Step One">
//             Edit <Text className="font-bold">Bonus.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Bonus;
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { url } from "../url";
import tw from "tailwind-react-native-classnames";
const Bonus = () => {
  const [pratiquants, setPratiquants] = useState([]);

  useEffect(() => {
    const fetchPratiquants = async () => {
      try {
        const response = await url.get("/pratiquants");
        console.log("Response from server:", response);
        console.log("Data received:", response.data);
        setPratiquants(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pratiquants:", error);
      }
    };

    fetchPratiquants();
  }, []);

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-black text-lg text-center`}>
        Toutes les barcodes
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
