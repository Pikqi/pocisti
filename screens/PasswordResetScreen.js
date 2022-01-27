import {
  Keyboard,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Button, Input } from "react-native-elements";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const PasswordResetScreen = () => {
  const [email, setEmail] = useState("");

  const auth = getAuth();

  const navigation = useNavigation();

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
        </View>
        <Button
          containerStyle={styles.button}
          onPress={() => {
            Alert.alert("Promena sifre", "Poslat vam je mail za promenu sifre", [
              {
                text: "Ok",
                onPress: () => {
                  navigation.navigate("Login");
                },
              },
            ]);
            sendPasswordResetEmail(auth, email);
          }}
          title="Resetujte sifru"
        ></Button>
        <View style={{ height: 200 }}></View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PasswordResetScreen;

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
