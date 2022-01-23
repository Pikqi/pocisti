import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-elements";
import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);

  const ANCHOR = { x: 0.5, y: 0.5 };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    getMarkers();
  }, []);

  // useFocusEffect(() => {
  //   getCurrentLocation();
  // });

  const getMarkers = async () => {
    const querySnapshot = await getDocs(collection(db, "depo"));

    const m = querySnapshot.docs.map((item) => ({
      id: item.id,
      longitude: item.data().longitude,
      latitude: item.data().latitude,
    }));
    setMarkers(m);
    // console.log(markers);
    // console.log(m);
  };
  // getting permisssion for location and location obj from expo docs

  const getCurrentLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    await Location.enableNetworkProviderAsync();

    let unsub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 500 },
      (loc) => {
        console.log(loc);
        setLocation(loc);
      }
    );

    return unsub;
  };

  return (
    <View style={{ height: "100%" }}>
      <MapView
        style={{ flex: 1 }}
        mapType="mutedStandard"
        initialRegion={{
          latitude: 44.8366,
          longitude: 20.4157,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            anchor={ANCHOR}
            style={styles.mapMarker}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          ></Marker>
        ))}

        {/* marker trenutne lokacije direkt kopirano sa githuba */}
        {location && (
          <Marker
            key={1}
            anchor={ANCHOR}
            style={styles.mapMarker}
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <View style={styles.container}>
              <View style={styles.markerHalo} />
              <View style={styles.marker} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default Map;

// stilovi za marker lokacije korisnika
// primer sa reac-native-maps

const SIZE = 20;
const HALO_RADIUS = 6;
const ARROW_SIZE = 7;
const ARROW_DISTANCE = 6;
const HALO_SIZE = SIZE + HALO_RADIUS;
const HEADING_BOX_SIZE = HALO_SIZE + ARROW_SIZE + ARROW_DISTANCE;

const styles = StyleSheet.create({
  container: {
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
  },
  mapMarker: {
    zIndex: 1000,
  },
  markerHalo: {
    position: "absolute",
    backgroundColor: "white",
    top: 0,
    left: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: Math.ceil(HALO_SIZE / 2),
    margin: (HEADING_BOX_SIZE - HALO_SIZE) / 2,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  marker: {
    justifyContent: "center",
    backgroundColor: "blue",
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HEADING_BOX_SIZE - SIZE) / 2,
  },
});
