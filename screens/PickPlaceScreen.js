import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import tw from "twrnc";
import { SafeAreaView } from "react-native";

const PickPlaceScreen = () => {
  return (
    //   todo google autoplaces complete
    <SafeAreaView style={tw`mx-4 mt-8`}>
      <GooglePlacesAutocomplete
        placeholder="Izaberite mesto"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "AIzaSyAoCK6SmSwt_F4-1LFATBH0qm4m-yFlvHE",
          language: "en",
        }}
      />
    </SafeAreaView>
  );
};

export default PickPlaceScreen;

const styles = StyleSheet.create({});
