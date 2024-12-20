import 'react-native-get-random-values';
import Button from "@/components/Button";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import Steps from "./_components/Steps";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from 'uuid';
import { decode } from "base64-arraybuffer";

export default function UserInfosScreen() {
	const { session, profile, setProfile } = useSession();

	const [nextIsLoading, setNextIsLoading] = useState(false);
	const [selectImageIsLoading, setSelectImageIsLoading] = useState(false);

	const firstnameInputRef = useRef<TextInput>(null);
	const [firstnameIsFocused, setFirstnameIsFocused] = useState(false);
	const [firstnameValue, setFirstnameValue] = useState(profile?.first_name);

	const lastnameInputRef = useRef<TextInput>(null);
	const [lastnameIsFocused, setLastnameIsFocused] = useState(false);
	const [lastnameValue, setLastnameValue] = useState(profile?.last_name);

	const handlePressNext = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setNextIsLoading(true);

		try {
			if (!firstnameValue || !lastnameValue) {
				return;
			}

			if (!profile) {
				return;
			}

			const { error } = await supabase.from("profiles").upsert({
				id: session?.user.id,
				first_name: firstnameValue,
				last_name: lastnameValue,
				completed: true,
			});

			if (error) {
				throw new Error(error.message);
			}

			setProfile({
				...profile,
				completed: true,
			});

			router.push("/(auth)/(firstLogin)/welcome");
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setNextIsLoading(false);
		}
	};

	const handleSelectImage = async () => {
		setSelectImageIsLoading(true);

		try {
            if(!profile) {
                throw new Error("Unable to access the profile variable");
            }

			let { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
				base64: true,
			});

			if (canceled || !assets || !assets.length) {
				throw new Error("Unable to access the selected asset");
			}

			if (!assets[0].base64) {
				throw new Error("Unable to access the base64 version of selected asset");
			}

			const { data: dataUpload, error: errorUpload } = await supabase.storage.from("profiles").upload(uuidv4(), decode(assets[0].base64), {
				contentType: "image/png",
			});

            if(errorUpload || !dataUpload) {
                throw new Error("Error occured when upload selected asset : "+errorUpload.message);
            }

            const { data: dataImage } = supabase.storage.from('profiles').getPublicUrl(dataUpload.path);

            if(!dataImage) {
                throw new Error("Unable to access the public url of selected asset");
            }

            const { error: errorProfile } = await supabase.from('profiles').update({
                image_url: dataImage.publicUrl
            }).eq('id', profile?.id);

            if(errorProfile) {
                throw new Error("Error occured when update profile : "+errorProfile.message);
            }

            setProfile({
                ...profile,
                image_url: dataImage.publicUrl
            });
        } catch (error) {
            if (error instanceof Error) {
				console.error(error.message);
			}            
		} finally {
			setSelectImageIsLoading(false);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "stretch", backgroundColor: "#F8F8F8" }}>
			<SafeAreaView edges={["top"]} style={{ paddingHorizontal: 16 }}>
				<Steps current={1} />
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
					Informations
				</Text>
				<Text
					style={{
						fontWeight: "light",
						fontSize: 15,
						color: "#000",
						opacity: 0.36,
						textAlign: "center",
					}}
				>
					Veuillez renseigner quelques informations sur vous, ainsi que votre matricule.
				</Text>
			</View>
			<View style={{ height: "70%", padding: 24, paddingBottom: 42, alignItems: "stretch" }}>
				<View style={{ gap: 24, flex: 1 }}>
					<View style={{ gap: 16, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#fff", borderRadius: 18, borderWidth: 1, borderColor: "#00000020", padding: 16 }}>
						<Image source={{ uri: profile?.image_url }} width={100} height={100} style={{ borderRadius: 10 }} />
						<Button variant="secondary" onPress={handleSelectImage}>
							{selectImageIsLoading ? <ActivityIndicator color={"#fff"} /> : "Modifier"}
						</Button>
					</View>

					<View style={{ flex: 1, gap: 8 }}>
						<TextInput value={firstnameValue} onChangeText={setFirstnameValue} ref={firstnameInputRef} onFocus={() => setFirstnameIsFocused(true)} onBlur={() => setFirstnameIsFocused(false)} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 50, paddingHorizontal: 16 }, firstnameIsFocused && { borderWidth: 3, borderColor: "#00B2FF", paddingHorizontal: 14 }]} placeholder="Prénom" placeholderTextColor="#00000020" />
						<TextInput value={lastnameValue} onChangeText={setLastnameValue} ref={lastnameInputRef} onFocus={() => setLastnameIsFocused(true)} onBlur={() => setLastnameIsFocused(false)} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 50, paddingHorizontal: 16 }, lastnameIsFocused && { borderWidth: 3, borderColor: "#00B2FF", paddingHorizontal: 14 }]} placeholder="Nom" placeholderTextColor="#00000020" />
					</View>
				</View>

				<Button onPress={handlePressNext} disabled={firstnameValue === "" || lastnameValue === "" || nextIsLoading}>
					{nextIsLoading ? <ActivityIndicator color="white" /> : "Suivant"}
				</Button>
			</View>
		</View>
	);
}
