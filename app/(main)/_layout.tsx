import { ActivityIndicator, Alert, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

export default function AppLayout() {
	const { session, profile } = useSession();
    
	if (!session || !profile) {
		return <Redirect href="/(auth)/sign-in" />;
	}
    
    if(!profile.completed) {
        return <Redirect href="/(auth)/(firstLogin)" />;
    }

	return <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="conversations" options={{ headerShown: false }} />
        <Stack.Screen name="posts/new" options={{ headerShown: false }} />
    </Stack>;
}