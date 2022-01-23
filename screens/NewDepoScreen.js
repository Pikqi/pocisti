import { Alert, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import React, { useState } from "react";
import tw from "twrnc";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const NewDepoScreen = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({});
  const [adress, setAdress] = useState("");

  const auth = getAuth();
  const navigation = useNavigation();

  // TODO GET USERS LOCATION
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    await Location.enableNetworkProviderAsync();
    const oldLocation = location;
    // let location = await Location.getCurrentPositionAsync({ timeInterval: 2000 });
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(currentLocation);
    getAdress(currentLocation);
    console.log(location);
  };

  // geolocation after
  const getAdress = async (loc) => {
    const adr = await Location.reverseGeocodeAsync(loc.coords);
    console.log(adr);
    setAdress(
      adr[0].street + " " + adr[0].streetNumber + " " + adr[0].district + " " + adr[0].city
    );
  };
  // TODO GET LOCATION BY SEARCH
  const selectLocation = () => {};
  // TODO GET PHOTO FROM GALLERY
  const getPhotoFromGallery = () => {};

  // SLANJE NOVE DEPONIJE
  const createNewDepo = async () => {
    // KORISNIK MORA BITI ULOGOVAN KAKO BI POSLAO
    const user = auth.currentUser;
    // obavesti korisnika da nije ulogovan
    if (!user) {
      Alert.alert("Greska", "Da biste prijavili deponiju morate biti ulogovani", [
        {
          text: "Odbaci",
        },
        {
          text: "Uloguj se",
          onPress: () => navigation.navigate("ProfileStack"),
        },
      ]);
    }

    // Proveri da li svi podaci postoje

    if (description && adress) {
      // Podaci postoje -> posalji novu deponiju

      const docRef = await addDoc(collection(db, "depo"), {
        timeStamp: Timestamp.now(),
        description: description,
        adress: adress,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        cleaned: false,
        userId: user.uid,
        userName: user.displayName,
      });
      // resetuj state
      setDescription("");
      setAdress("");
      setLocation({});
      return;
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <Text style={tw`mt-10 mx-auto font-bold text-xl `}>Prijavite novu deponiju</Text>

      {/* Description */}

      <View style={tw`ml-5 mt-10 mr-5 flex-1 text-lg`}>
        <View>
          <Text style={tw`font-medium text-lg`}>Unesite opis deponije</Text>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
            numberOfLines={4}
            style={tw`bg-white mt-3 p-1`}
          ></TextInput>
        </View>

        {/* Lokacija */}
        <View style={tw`mt-5`}>
          <Text style={tw`mb-2`}>Izaberite lokaciju deponije</Text>

          <View style={tw` flex-row justify-between `}>
            <Button
              onPress={getLocation}
              buttonStyle={{ width: 150 }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Trenutna lokacija"
              titleStyle={{ marginHorizontal: 5 }}
            />
            <Button
              onPress={selectLocation}
              buttonStyle={{ width: 150 }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Izaberi mesto"
              titleStyle={{ marginHorizontal: 5 }}
            />
          </View>
        </View>
        {/* Street name: */}
        <View>
          <Text style={tw`my-2`}>
            {adress ? `Izabrali ste: ${adress}` : "Niste jos izabrali adresu"}
          </Text>
        </View>
        {/* Photos of depo */}
        <View style={tw`mt-5 -ml-5`}>
          <Text style={tw`ml-5`}>Fotografija deponije:</Text>
          <View style={[tw`mt-2  mx-auto `]}>
            <Button
              onPress={getPhotoFromGallery}
              containerStyle={{ margin: 5 }}
              loadingProps={{ animating: true }}
              title="Izaberi fotografiju iz galerije"
              titleStyle={{ marginHorizontal: 5 }}
            />
            <View style={tw`my-1`}></View>
            <Button
              onPress={getPhotoFromGallery}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Fotografisi sada"
              titleStyle={{ marginHorizontal: 5 }}
            />
          </View>
        </View>
        {/* Submit depo */}
        <View style={tw`absolute bottom-3 ml-4 `}>
          <View style={tw`flex-row justify-between items-center`}>
            <Button
              onPress={getLocation}
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
              onPress={createNewDepo}
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewDepoScreen;

const styles = StyleSheet.create({});
