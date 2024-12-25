import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const ConversationScreen = () => {
	const { conversation } = useLocalSearchParams<{ conversation: string }>();

	const handleInserts = (payload: any) => {
		console.log("Payload received!", payload);
	};

	const conversationRoom = supabase.channel(`conversation_${conversation}`);

	supabase.channel("conversations").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, handleInserts).subscribe();

	supabase
		.channel("schema-db-changes")
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
			},
			(payload) => console.log(payload)
		)
		.subscribe();

	return (
		<View>
			<Text>Conversation</Text>
		</View>
	);
};

export default ConversationScreen;
