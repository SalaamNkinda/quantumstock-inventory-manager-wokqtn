
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SystemBars } from "react-native-edge-to-edge";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
import { InventoryProvider } from "../contexts/InventoryContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2563eb',
      background: '#ffffff',
      card: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      notification: '#ef4444',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <InventoryProvider>
          <ThemeProvider value={lightTheme}>
            <SystemBars style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="add-product" 
                options={{ 
                  presentation: 'modal',
                  headerShown: true,
                }} 
              />
              <Stack.Screen 
                name="add-movement" 
                options={{ 
                  presentation: 'modal',
                  headerShown: true,
                }} 
              />
            </Stack>
            <StatusBar style="dark" />
          </ThemeProvider>
        </InventoryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
