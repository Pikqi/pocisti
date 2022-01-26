import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Ekrani
import HomeScreen from "./screens/HomeScreen";
import ProfileScreenStack from "./screens/ProfileScreenStack";
import newDepoStack from "./screens/NewDepoStack";

const App = () => {
  const Tab = createBottomTabNavigator();
  LogBox.ignoreAllLogs(true);

  return (
    <NavigationContainer>
      <StatusBar style="auto"></StatusBar>
      <SafeAreaProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let iconType;
              if (route.name === "Home") {
                iconName = focused ? "ios-home-sharp" : "ios-home-outline";
                iconType = "ionicon";
              } else if (route.name === "ProfileStack") {
                iconName = "profile";
                iconType = "antdesign";
              } else if (route.name === "NewDepoStack") {
                iconName = focused ? "pluscircle" : "pluscircleo";
                iconType = "antdesign";
              }

              // You can return any component that you like here!
              return <Icon type={iconType} name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
          <Tab.Screen name="NewDepoStack" component={newDepoStack}></Tab.Screen>
          <Tab.Screen name="ProfileStack" component={ProfileScreenStack}></Tab.Screen>
        </Tab.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
