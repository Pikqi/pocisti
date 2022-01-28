import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import tw from "twrnc";
const ProfileScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.replace("Login");
    }
  }, []);

  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  return (
    <View style={tw`flex-1 mt-5`}>
      <Text style={tw`px-2 text-xl font-semibold my-4`}>Zdravo, {user.displayName} </Text>
      <Button
        onPress={signOut}
        buttonStyle={{ width: 150 }}
        containerStyle={{ margin: 5 }}
        disabledStyle={{
          borderWidth: 2,
          borderColor: "#00F",
        }}
        title="Odjavi se"
        titleStyle={{ marginHorizontal: 5 }}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
