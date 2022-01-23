import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";

const NewDepoScreen = () => {
  const [description, setDescription] = useState("");

  // TODO GET USERS LOCATION
  // geolocation after
  const getLocation = () => {};
  // TODO GET LOCATION BY SEARCH
  const selectLocation = () => {};
  // TODO GET PHOTO FROM GALLERY
  const getPhotoFromGallery = () => {};

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <Text style={tw`mt-10 mx-auto font-bold text-lg `}>Prijavite novu deponiju</Text>

      {/* Description */}

      <View style={tw`ml-5 mt-10`}>
        <View>
          <Text style={tw`font-medium`}>Unesite opis deponije</Text>
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

          <View style={tw` flex-row items-center `}>
            <Button
              onPress={getLocation}
              buttonStyle={{ width: 200 }}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              title="Koristi moju lokaciju"
              titleStyle={{ marginHorizontal: 5 }}
            />
            <Button
              onPress={selectLocation}
              buttonStyle={{ width: 200 }}
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
          <Text style={tw`my-2`}>Neka ulica </Text>
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
      </View>
    </SafeAreaView>
  );
};

export default NewDepoScreen;

const styles = StyleSheet.create({});
