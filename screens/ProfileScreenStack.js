import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import PasswordResetScreen from "./PasswordResetScreen";

const ProfileScreenStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen}></Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileScreenStack;

const styles = StyleSheet.create({});
