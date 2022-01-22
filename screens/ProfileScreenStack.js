import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

const ProfileScreenStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen}></Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileScreenStack;

const styles = StyleSheet.create({});
