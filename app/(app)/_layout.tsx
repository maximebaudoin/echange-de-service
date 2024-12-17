import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/hooks/useSession";

export default function AppLayout() {
	const { session, isLoading } = useSession();

    console.log("session", session);
    

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (!session) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return <Stack />;
}
