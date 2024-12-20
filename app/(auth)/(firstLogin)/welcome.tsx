import Button from "@/components/Button";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import * as Haptics from "expo-haptics";
import TransportNetworkButton from "./_components/TransportNetworkButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Steps from "./_components/Steps";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";

export default function WelcomeScreen() {
    const { profile } = useSession();

	const handlePressNext = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        router.replace('/(main)');
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "stretch", backgroundColor: "#F8F8F8" }}>
			<SafeAreaView edges={["top"]} style={{ paddingHorizontal: 16 }}>
				<Steps current={2} />
			</SafeAreaView>
			<View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 24 }}>
				<Text
					style={{
						fontWeight: "bold",
						fontSize: 28,
						color: "#000",
						marginBottom: 8,
						textAlign: "center",
					}}
				>
					Bienvenue {profile?.first_name}
				</Text>
			</View>
			<View style={{ height: "60%", padding: 24, paddingBottom: 42, alignItems: "stretch", justifyContent: 'flex-end' }}>
				<Button onPress={handlePressNext}>
					Terminer
				</Button>
			</View>
		</View>
	);
}
