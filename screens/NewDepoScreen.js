import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import React, { useState } from "react";
import tw from "twrnc";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

const NewDepoScreen = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({});
  const [adress, setAdress] = useState("");
  const [image, setImage] = useState(null);
  const [imageLink, setImageLink] = useState(null);
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
    console.log(location);
    getAdress(currentLocation);
  };

  // geolocation after
  const getAdress = async (loc) => {
    const adr = await Location.reverseGeocodeAsync(loc.coords);
    console.log(adr);
    setAdress(
      `${adr[0].street} ${adr[0].streetNumber} ${
        adr[0].district ? (adr[0].district != adr[0].city ? adr[0].district : "") : ""
      }${adr[0].city}`
    );
  };
  // TODO GET LOCATION BY SEARCH
  const selectLocation = () => {};
  // TODO GET PHOTO FROM GALLERY
  const getPhotoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    pickImage();
  };

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      // this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        // this.setState({ image: uploadUrl });
        setImageLink(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      // this.setState({ uploading: false });
    }
  };

  // TODO GET PHOTO FROM CAMERA
  const getPhotoFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    takePhoto();
  };

  const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    handleImagePicked(pickerResult);
  };
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
        imageLink: imageLink,
      });
      // resetuj state
      setDescription("");
      setAdress("");
      setLocation({});
      return;
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <ScrollView>
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
                onPress={getPhotoFromCamera}
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
            {/* Prikazivanje fotografija */}
            <View style={tw`flex-1 mx-auto`}>
              {!imageLink ? (
                <Text>Niste izabrali fotografiju</Text>
              ) : (
                <View>
                  <Text>Izabrali ste: </Text>
                  <Image style={{ height: 200, width: 200 }} source={{ uri: imageLink }}></Image>
                </View>
              )}
            </View>
          </View>
          {/* Submit depo */}
          {/* <View style={tw`absolute bottom-3 ml-4 `}> */}
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
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
};

export default NewDepoScreen;

const styles = StyleSheet.create({});

// upload funkcija koja vraca download link koji cemo beleziti uz deponiju
async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  // setImageId(uuid.v4());
  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
}
