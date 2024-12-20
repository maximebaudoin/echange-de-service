import AppView from "@/components/AppView";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import * as Haptics from "expo-haptics";

const TabsIndexScreen = () => {
    const handleNewPost = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(main)/posts/new');
    }

	return (
		<FlatList
			style={{
				flex: 1,
			}}
			contentContainerStyle={{
				alignItems: "center",
				paddingTop: 12,
			}}
			ListHeaderComponent={
				<TouchableOpacity onPress={handleNewPost}>
					<SquircleView
						squircleParams={{
							cornerSmoothing: 1,
							cornerRadius: 18,
							fillColor: "#00000007",
							strokeWidth: 1,
							strokeColor: "#00000020",
						}}
						style={{
							width: 90,
							alignItems: "center",
							justifyContent: "center",
							height: 39,
						}}
					>
						<SymbolView name="plus" tintColor="#000000DD" size={18} weight="semibold" />
					</SquircleView>
				</TouchableOpacity>
			}
			data={[]}
			renderItem={() => <View></View>}
		/>
	);
};

export default TabsIndexScreen;