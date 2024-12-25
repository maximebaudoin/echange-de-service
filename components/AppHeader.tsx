import { useStorageUrl } from "@/hooks/useStorageUrl";
import { useSession } from "@/hooks/useSession";
import { router, useSegments } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { tabs } from "@/constants/Tabs";

const AppHeader = () => {
	const segments = useSegments();
	const { profile, setProfile, selectedTransportNetwork, signOut } = useSession();
	const selectedTransportNetworkImageUrl = useStorageUrl("transport_network", selectedTransportNetwork?.image_name, 50, 50, "contain");

	let title = "";

	if (!segments[1] || segments[1] !== "(tabs)" || !segments[2]) {
		title = tabs.index;
	} else {
		title = tabs[segments[2]];
	}

	if (!profile || !selectedTransportNetwork) {
		return;
	}

	return (
		<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", alignSelf: "stretch", paddingHorizontal: 16, marginBottom: 8 }}>
			<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8 }}>
				{selectedTransportNetworkImageUrl && (
					<Image
						source={{ uri: selectedTransportNetworkImageUrl }}
						style={{
							width: 50,
							height: 50,
							objectFit: "contain",
							borderRadius: 16,
							borderWidth: 1,
							borderColor: "#00000010",
                            backgroundColor: "#fff",
                            padding: 3
						}}
					/>
				)}
			</View>
			<View style={{ flex: 1, alignItems: "center" }}>
				<Text
					style={{
						fontSize: 19,
						fontWeight: "bold",
					}}
				>
					{title}
				</Text>
				<Text
					style={{
						fontSize: 12,
						fontWeight: 500,
						color: "#00000040",
					}}
				>
					{selectedTransportNetwork.matricule}
				</Text>
			</View>
			<View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
				<Pressable
					style={{
						borderRadius: 99,
						backgroundColor: "#fff",
						width: 44,
						height: 44,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderColor: "#00000015",
					}}
					onPress={() => signOut()}
				>
					<SymbolView name="rectangle.portrait.and.arrow.right" tintColor="#cc0000DD" size={24} weight="bold" />
				</Pressable>
				<Pressable
					style={{
						borderRadius: 99,
						backgroundColor: "#fff",
						width: 44,
						height: 44,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderColor: "#00000015",
					}}
					onPress={() => setProfile({ ...profile, completed: false })}
				>
					<SymbolView name="pencil" tintColor="#000000DD" size={20} weight="bold" />
				</Pressable>
				<Pressable
					style={{
						borderRadius: 99,
						backgroundColor: "#fff",
						width: 44,
						height: 44,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderColor: "#00000015",
					}}
					onPress={() => router.push("/conversations")}
				>
					<SymbolView name="message" tintColor="#000000DD" size={24} weight="semibold" />
					{/* <View
						style={{
							width: 10,
							height: 10,
							backgroundColor: "#E44",
							borderRadius: 99,
							position: "absolute",
							top: 1,
							left: 1,
						}}
					/> */}
				</Pressable>
			</View>
		</View>
	);
};

export default AppHeader;
