import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import tw from "twrnc";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Alert } from "react-native";

const UpdateCardScreen = ({ route }) => {
  const { marker } = route.params;

  const [description, setDescription] = useState(marker.description);
  const [location, setLocation] = useState(marker.location);
  const [adress, setAdress] = useState(marker.adress);
  const [imageLink, setImageLink] = useState(marker.imageLink);
  const [newImageLink, setNewImageLink] = useState(false);
  const [cleaned, setCleaned] = useState(marker.cleaned);

  console.log(marker);

  const navigation = useNavigation();

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
      aspect: [1, 1],
    });

    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      // this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        // this.setState({ image: uploadUrl });
        setNewImageLink(uploadUrl);
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

  const cleanDepo = () => {
    if (!newImageLink) {
      Alert.alert(
        "Pažnja!",
        "Oznacili ste deopniju kao očišćenu, molimo vas dostavite novu fotografiju",
        [
          {
            text: "Ok",
            onPress: () => {
              return;
            },
          },
        ]
      );
    }
    setCleaned(true);
    updateDepo();
    Alert.alert("Hvala", "Hvala vam što čistite!", [
      {
        text: "Ok",
        onPress: () => {
          navigation.navigate("Map");
        },
      },
    ]);
  };

  //   TODO: UPDATING DEPO
  const updateDepo = async () => {
    await setDoc(
      doc(db, "depo", marker.id),
      {
        description: description,
        imageLink: newImageLink || imageLink,
        cleaned: cleaned,
      },
      { merge: true }
    );

    navigation.navigate("Map");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <ScrollView>
        <Text style={tw`mt-10 mx-auto font-bold text-xl `}>Ažurirajte deponiju</Text>

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

          {/* Street name: */}
          <View>
            <Text style={tw`my-2`}>{adress}</Text>
          </View>
          {/* Photos of depo */}
          <View style={tw`flex-row mx-auto  `}>
            <Button
              onPress={getPhotoFromGallery}
              buttonStyle={{ width: 150 }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Izaberite novu"
              titleStyle={{ marginHorizontal: 5 }}
            />
            <Button
              onPress={getPhotoFromCamera}
              buttonStyle={{ width: 150 }}
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

          <View style={tw`mt-5 `}>
            {/* Prikazivanje fotografija */}
            <View style={tw` flex-row justify-between items-center`}>
              <View>
                <Text>Stara fotografija</Text>
                <Image style={{ height: 150, width: 150 }} source={{ uri: imageLink }}></Image>
              </View>
              {newImageLink && (
                <View>
                  <Text>Vasa fotografija</Text>
                  <Image style={{ height: 150, width: 150 }} source={{ uri: newImageLink }}></Image>
                </View>
              )}
            </View>
          </View>
          {/* Bottom btn */}
          <View style={tw`flex-row justify-between items-center mt-5`}>
            <Button
              onPress={updateDepo}
              buttonStyle={{ width: 150 }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Ažužiraj"
              titleStyle={{ marginHorizontal: 5 }}
            />
            <Button
              onPress={cleanDepo}
              buttonStyle={{ width: 150, backgroundColor: "green" }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Očišćeno!"
              titleStyle={{ marginHorizontal: 5 }}
            />
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateCardScreen;

const styles = StyleSheet.create({});

// upload funkcija koja vraca download link koji cemo beleziti uz deponiju
async function uploadImageAsync(uri) {
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

  blob.close();

  return await getDownloadURL(fileRef);
}
