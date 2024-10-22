import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import App from "..";
const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sketch">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Sketch"
          component={App}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
