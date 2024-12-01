import { Stack } from "expo-router";

export const RootAppNavigator = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="(app)" />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export const RootAuthNavigator = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}