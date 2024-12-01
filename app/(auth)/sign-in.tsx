import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";

import React, { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Application from "expo-application";
import * as Haptics from "expo-haptics";
import { SquircleView } from "expo-squircle-view";
import * as WebBrowser from "expo-web-browser";
import Button from "../components/Button";
import { LogSnagContext } from "../contexts/LogSnagProvider";
import { logSnagIdentifyUser } from "../utils/logSnagIdentifyUser";
import Facebook from "../svgs/Facebook";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
    const { signIn } = useSession();

	const logo = require("../../assets/icon.png");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const appleOAuth = useOAuth({ strategy: "oauth_apple" });
	const googleOAuth = useOAuth({ strategy: "oauth_google" });
	const facebookOAuth = useOAuth({ strategy: "oauth_facebook" });

	const onPressOAuth = React.useCallback(async (OAuth) => {
		try {
			const { createdSessionId, signIn, signUp, setActive } = await OAuth.startOAuthFlow();

			if (createdSessionId) {
				await setActive({ session: createdSessionId });

				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			}
		} catch (err) {
			console.error("OAuth error", JSON.stringify(err, null, 2));
		}
	}, []);

	const onPressAppleOAuth = () => {
		onPressOAuth(appleOAuth);
	};

	const onPressGoogleOAuth = () => {
		onPressOAuth(googleOAuth);
	};

	const onPressFacebookOAuth = () => {
		onPressOAuth(facebookOAuth);
	};

	// const onSignInPress = async () => {
	//     await Haptics.selectionAsync();

	//     if (!isLoaded) {
	//         return;
	//     }

	//     try {
	//         const completeSignIn = await signIn.create({
	//             identifier: emailAddress,
	//             password,
	//         });
	//         // This is an important step,
	//         // This indicates the user is signed in
	//         await setActive({ session: completeSignIn.createdSessionId });
	//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	//     } catch (err) {
	//         console.log(err);
	//     }
	// };

	return (
		<ScrollView style={s.container} contentContainerStyle={s.containerContent} keyboardShouldPersistTaps="handled">
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 15,
				}}
			>
				<Image
					source={logo}
					style={{
						width: 110,
						height: 110,
						backgroundColor: "#fff",
						borderRadius: 30,
					}}
				/>
				<Text
					style={{
						fontFamily: fonts.bold,
						fontSize: 22,
						color: "#123c5b",
					}}
				>
					Échange de service
				</Text>
			</View>

			<View style={s.body}>
				<Text style={s.title}>Bienvenue!</Text>
				{/* <KeyboardAvoidingView
                    enabled
                    style={s.form}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View>
                        <TextInput
                            style={s.input}
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email..."
                            onChangeText={(emailAddress) =>
                                setEmailAddress(emailAddress)
                            }
                        />
                    </View>

                    <View>
                        <TextInput
                            style={s.input}
                            value={password}
                            placeholder="Password..."
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                </KeyboardAvoidingView>

                <TouchableOpacity>
                    <Text style={{
                        fontFamily: fonts.regular
                    }}>Mot de passe oublié?</Text>
                </TouchableOpacity>

                <Button
                    onPress={onSignInPress}
                    disabled={!emailAddress || !password}
                >
                    <Text style={s.btnText}>Let's go</Text>
                </Button> */}

				<Text
					style={{
						textAlign: "center",
						color: "#1F1F1F",
						fontFamily: fonts.medium,
						fontSize: 16,
						marginTop: 20,
					}}
				>
					Connectez-vous avec :
				</Text>

				<View style={s.socialsContainer}>
					<TouchableOpacity style={s.socialBtn} onPress={onPressAppleOAuth}>
						<SquircleView
							style={s.socialBtnBody}
							squircleParams={{
								cornerSmoothing: 0.7,
								cornerRadius: 18,
								fillColor: "#000",
							}}
						>
							<Apple width={34} height={34} fill="#fff" />
						</SquircleView>
					</TouchableOpacity>
					<TouchableOpacity style={s.socialBtn} onPress={onPressGoogleOAuth}>
						<SquircleView
							style={s.socialBtnBody}
							squircleParams={{
								cornerSmoothing: 0.7,
								cornerRadius: 18,
								fillColor: "#EA4335",
							}}
						>
							{/* <Google width={26} height={26} fill="#fff" /> */}
                            <Ionicons name="logo-google" />
						</SquircleView>
					</TouchableOpacity>
					<TouchableOpacity style={s.socialBtn} onPress={onPressFacebookOAuth}>
						<SquircleView
							style={s.socialBtnBody}
							squircleParams={{
								cornerSmoothing: 0.7,
								cornerRadius: 18,
								fillColor: "#1877F2",
							}}
						>
							<Facebook width={27} height={27} fill="#fff" />
						</SquircleView>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					<Pressable onPress={() => Linking.openURL("https://color-hub.app/privacy-policy")}>
						<Text
							style={{
								textAlign: "center",
								color: "#999",
							}}
						>
							Politique de confidentialité
						</Text>
					</Pressable>
					<Text
						style={{
							color: "#C1C1C1",
						}}
					>
						{" "}
						-{" "}
					</Text>
					<Text
						style={{
							textAlign: "center",
							color: "#C1C1C1",
						}}
					>
						v{Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
					</Text>
				</View>

				{/* <TouchableOpacity style={{
                    marginBottom: 20
                }}>
                    <Text>
                        Vous n'avez pas de compte ? <Text style={{
                            fontFamily: fonts.medium
                        }}>Créez-en un</Text>
                    </Text>
                </TouchableOpacity> */}
			</View>
		</ScrollView>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfcfc",
		overflow: "visible",
	},
	containerContent: {
		flex: 1,
		overflow: "visible",
		backgroundColor: "#F1F1F1",
	},
	body: {
		padding: 30,
		backgroundColor: "#fff",
		...shadow.shadowXs,
		gap: 20,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 22,
		textAlign: "center",
	},
	form: {
		gap: 15,
	},
	input: {
		borderWidth: 1,
		borderColor: "#efefef",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 10,
		fontSize: 14,
		fontFamily: fonts.regular,
	},
	socialsContainer: {
		flexDirection: "row",
		gap: 15,
		justifyContent: "center",
		marginBottom: 15,
	},
	socialBtnBody: {
		padding: 10,
		width: 55,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
	},
});
