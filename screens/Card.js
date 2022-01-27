import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
const Card = ({ route }) => {
  const {
    marker: { adress, id, description, latitude, longitude, imageLink },
    marker,
  } = route.params;
  console.log();
  const initialRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`flex-1 mt-10 `}>
      <ScrollView>
        <Text style={tw`mx-auto px-10 text-xl font-bold text-center`}>{adress}</Text>
        <View>
          <MapView
            style={{ height: 200 }}
            mapType="mutedStandard"
            initialRegion={initialRegion}
            scrollEnabled={false}
          >
            <Marker
              key={id}
              coordinate={{ latitude: latitude, longitude: longitude }}
              onPress={(e) => onMarkerPress(e)}
            >
              <Image
                source={require("../assets/trash.png")}
                style={[styles.markerIcon]}
                resizeMode="cover"
              />
            </Marker>
          </MapView>
        </View>
        <Text style={tw`px-4 text-lg`}>{description}</Text>
        <View>
          <Image
            style={[tw`mx-auto`, { height: 200, width: 200 }]}
            source={{ uri: imageLink }}
          ></Image>
        </View>
        <View style={tw`mx-10 flex-row justify-between items-center `}>
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
            title="Vrati se"
            titleStyle={{ marginHorizontal: 5 }}
          />
          <Button
            onPress={() => {
              navigation.navigate("UpdateCard", { marker });
            }}
            buttonStyle={{ width: 150, backgroundColor: "green" }}
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F",
            }}
            disabledTitleStyle={{ color: "#00F" }}
            loadingProps={{ animating: true }}
            title="Ažuriraj"
            titleStyle={{ marginHorizontal: 5 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Card;

const styles = StyleSheet.create({
  markerIcon: {
    width: 30,
    height: 30,
  },
});
