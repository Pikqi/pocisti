import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "react-native-elements";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const auth = getAuth();
  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        updateProfile(auth.currentUser, {
          displayName: name,
        }).then(() => {});
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, styles.container]}
      //   behavior="padding"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <>
        <StatusBar style="light"></StatusBar>
        <Text h3 style={{ marginBottom: 50 }}></Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Korisnicko ime"
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          ></Input>
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          ></Input>
          <Input
            placeholder="Šifra"
            type="password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          ></Input>
        </View>
        <Button rasied onPress={register} title="Register"></Button>
      </>
      <View style={{ height: 250 }}></View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },

  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
