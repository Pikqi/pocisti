import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Map = () => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 44.8423089,
    longitude: 20.4438745,
    // latitudeDelta: 0.2,
    // longitudeDelta: 0.2,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  });

  const navigation = useNavigation();

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const scrollViewRef = React.useRef(null);
  const mapRef = React.useRef(null);

  const ANCHOR = { x: 0.5, y: 0.5 };

  // USER CURRENT LOCATION
  useFocusEffect(
    React.useCallback(async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.enableNetworkProviderAsync();

      let unsub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 500 },
        (loc) => {
          setLocation(loc);
        }
      );

      return () => unsub();
    }, [])
  );

  // NOT CLEANED DEPOS
  useFocusEffect(
    React.useCallback(async () => {
      const q = query(collection(db, "depo"), where("cleaned", "==", false));
      const querySnapshot = await getDocs(q);

      const m = querySnapshot.docs.map((item) => ({
        id: item.id,
        longitude: item.data().longitude,
        latitude: item.data().latitude,
        adress: item.data().adress,
        description: item.data().description,
        imageLink: item.data().imageLink,
        userId: item.data().userId,
        userName: item.data().userName,
        cleaned: item.data().cleaned,
      }));
      setMarkers(m);
      return () => querySnapshot();
    }, [])
  );

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= markers.length) {
        index = markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { longitude, latitude } = markers[index];
          mapRef.current.animateToRegion(
            {
              longitude,
              latitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = markers.map((marker, index) => {
    const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    scrollViewRef.current.scrollTo({ x: x, y: 0, animated: true });
  };

  return (
    <View style={{ height: "100%" }}>
      <MapView style={{ flex: 1 }} mapType="mutedStandard" initialRegion={region} ref={mapRef}>
        {/* Marker of current user location */}
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

        {/* depo markers */}
        {markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={(e) => onMarkerPress(e)}
            >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require("../assets/trash.png")}
                  style={[styles.markerIcon, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {markers.map((marker) => (
          <View style={styles.card} key={marker.id}>
            <Image source={{ uri: marker.imageLink }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {marker.adress}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.description}
              </Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Card", { marker });
                  }}
                  style={[
                    styles.signIn,
                    {
                      borderColor: "green",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: "green",
                      },
                    ]}
                  >
                    Otvori
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
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
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  button: {
    alignItems: "center",
    marginTop: 5,
  },
  signIn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold",
  },
  markerIcon: {
    width: 30,
    height: 30,
  },
});
