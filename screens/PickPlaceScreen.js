import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import tw from "twrnc";
import { Button } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";

const PickPlaceScreen = () => {
  const [location, setLocation] = useState(null);
  const [adress, setAdress] = useState("");
  const [adressLoading, setAdressLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const { selectAdress, selectLocation } = route.params;

  return (
    //   todo google autoplaces complete
    <SafeAreaView style={tw`flex-1 mx-4 mt-10`}>
      <GooglePlacesAutocomplete
        placeholder="Izaberite mesto"
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            fontSize: 18,
          },
        }}
        fetchDetails={true}
        nearbyPlacesAPI="GooglePlacesSearch"
        query={{
          key: "AIzaSyAoCK6SmSwt_F4-1LFATBH0qm4m-yFlvHE",
          language: "en",
        }}
        debounce={400}
        minLength={2}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          setLocation(details.geometry.location);
          // getAdress(location);
          setAdress(data.description);
        }}
      />
      {/* Map view */}
      <View style={tw`h-3/6`}>
        <MapView
          style={{ flex: 1 }}
          mapType="mutedStandard"
          initialRegion={{
            latitude: 44.8423089,
            longitude: 20.4438745,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {location && (
            <Marker coordinate={{ latitude: location.lat, longitude: location.lng }}></Marker>
          )}
        </MapView>
      </View>
      {/* Selected location */}
      <View style={tw`flex-1`}>
        <Text style={tw`my-2`}>
          {adressLoading
            ? "Ucitava se..."
            : adress
            ? `Izabrali ste: ${adress}`
            : "Niste jos izabrali adresu"}
        </Text>
      </View>
      {/* Buttons */}
      <View style={tw`flex-row mt-4 flex-row justify-between items-center`}>
        <Button
          onPress={() => navigation.goBack()}
          buttonStyle={{ width: 150, backgroundColor: "red" }}
          containerStyle={{ margin: 5 }}
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          disabledTitleStyle={{ color: "#00F" }}
          loadingProps={{ animating: true }}
          title="Odbaci"
          titleStyle={{ marginHorizontal: 5 }}
        />
        <Button
          onPress={() => {
            selectAdress(adress);
            selectLocation(location);
            navigation.goBack();
          }}
          buttonStyle={{ width: 150, backgroundColor: "green" }}
          containerStyle={{ margin: 5 }}
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          disabledTitleStyle={{ color: "#00F" }}
          loadingProps={{ animating: true }}
          title="Potvrdi"
          titleStyle={{ marginHorizontal: 5 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PickPlaceScreen;
