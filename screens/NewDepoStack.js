import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewDepoScreen from "./NewDepoScreen";
import PickPlaceScreen from "./PickPlaceScreen";

const newDepoStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewDepo" component={NewDepoScreen}></Stack.Screen>
      <Stack.Screen name="PickPlace" component={PickPlaceScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default newDepoStack;
