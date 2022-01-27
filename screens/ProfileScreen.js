import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
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
    <View style={tw`flex-1`}>
      <Text style={tw`px-2 text-xl font-semibold`}>Zdravo, {user.displayName} </Text>
      <Button
        onPress={signOut}
        buttonStyle={{ width: 150 }}
        containerStyle={{ margin: 5 }}
        disabledStyle={{
          borderWidth: 2,
          borderColor: "#00F",
        }}
        disabledTitleStyle={{ color: "#00F" }}
        linearGradientProps={null}
        iconContainerStyle={{ background: "#000" }}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        title="Sign out"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5 }}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
