import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Map from "../components/Map";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Card from "../screens/Card";
import UpdateCardScreen from "./UpdateCardScreen";
const HomeScreen = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Map" component={Map}></Stack.Screen>
      <Stack.Screen name="Card" component={Card}></Stack.Screen>
      <Stack.Screen name="UpdateCard" component={UpdateCardScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
