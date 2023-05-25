import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TodoScreen from "./TodoScreen";
import WeatherScreen from "./WeatherScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="To-Do List"
          component={TodoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Weather"
          component={WeatherScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
