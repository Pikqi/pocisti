import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Input } from "react-native-elements";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        navigation.replace("Profile");
      }
    });
    return unsubscribe;
  });

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => alert(error));
  };

  useFocusEffect(() => {
    if (auth.currentUser) {
      navigation.replace("Profile");
    }
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <View style={styles.inputContainer}>
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          ></Input>
          <Input
            placeholder="Lozinka"
            secureTextEntry
            type="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
          ></Input>
        </View>
        <Button containerStyle={styles.button} onPress={signIn} title="Prijavi me"></Button>
        <Button
          containerStyle={styles.button}
          onPress={() => navigation.navigate("Register")}
          type="outline"
          title="Registruj se"
        ></Button>
        <Button
          containerStyle={styles.button}
          onPress={() => navigation.navigate("PasswordReset")}
          type="clear"
          title="Zaboravili ste lozinku?"
        ></Button>

        {/* <View style={{ height: 50 }}></View> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    width: 300,
  },

  button: {
    width: 200,
    marginTop: 10,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
});
