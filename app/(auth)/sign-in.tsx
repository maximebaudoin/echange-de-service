import { useSession } from "@/hooks/useSession";
import { router, useRouter } from "expo-router";

import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Application from "expo-application";
import * as Haptics from "expo-haptics";
import { SquircleView } from "expo-squircle-view";
import Button from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/utils/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import * as WebBrowser from "expo-web-browser";
import { useStorageState } from "@/hooks/useStorageState";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri();

export default function SignInScreen() {
	const { setSession, signIn } = useSession();
    const router = useRouter();

	const logo = require("../../assets/images/icon.png");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// const appleOAuth = useOAuth({ strategy: "oauth_apple" });
	// const googleOAuth = useOAuth({ strategy: "oauth_google" });
	// const facebookOAuth = useOAuth({ strategy: "oauth_facebook" });

	// const onPressOAuth = React.useCallback(async (OAuth) => {
	const onPressOAuth = React.useCallback(async () => {
		// try {
		// 	const { createdSessionId, signIn, signUp, setActive } = await OAuth.startOAuthFlow();
		// 	if (createdSessionId) {
		// 		await setActive({ session: createdSessionId });
		// 		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		// 	}
		// } catch (err) {
		// 	console.error("OAuth error", JSON.stringify(err, null, 2));
		// }
	}, []);

	const handleGitHubSignIn = async () => {
		try {
			// 1. Récupérer l'URL d'authentification pour GitHub via Supabase
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: { redirectTo: redirectUri },
			});

			console.log(redirectUri);

			if (error) {
				console.error("Erreur lors de l’authentification :", error.message);
				return;
			}

			// 2. Ouvrir le navigateur pour GitHub OAuth
			const authUrl = data.url; // URL de connexion générée par Supabase
			const result = await openAuthSessionAsync(authUrl, redirectUri);

			if (result.type === "success" && result.url) {
				const urlParams = new URLSearchParams(result.url.split("#")[1]);

				const accessToken = urlParams.get("access_token");
				const refreshToken = urlParams.get("refresh_token");

				if (!accessToken) throw new Error("Le token d'accès est manquant.");
				if (!refreshToken) throw new Error("Le token de refresh est manquant.");

				// Étape 3 : Authentifier manuellement Supabase avec les tokens
				const { error: sessionError } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});

				if (sessionError) throw sessionError;

				console.log("Session établie avec Supabase 🎉"); 

				// Étape 5 : Récupérer l'utilisateur
				const {data: {session}, error} = await supabase.auth.getSession();
				if (error) throw error;

                setSession(JSON.stringify(session));
                console.log("ma session", session);
                
                
                router.replace('/(app)');
			} else {
				console.log("Authentification annulée ou échouée.");
			}
		} catch (err) {
			console.error("Erreur générale :", err);
		}
	};

	const onPressAppleOAuth = () => {
		// onPressOAuth(appleOAuth);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	};

	const onPressGoogleOAuth = () => {
		// onPressOAuth(googleOAuth);
	};

	const onPressFacebookOAuth = () => {
		// onPressOAuth(facebookOAuth);
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
						// fontFamily: fonts.bold,
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
						// fontFamily: fonts.medium,
						fontSize: 16,
						marginTop: 20,
					}}
				>
					Connectez-vous avec :
				</Text>

				<View style={s.socialsContainer}>
					{/* <AppleAuthentication.AppleAuthenticationButton
							buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
							buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
							cornerRadius={5}
							style={{ width: 200, height: 64 }}
							onPress={async () => {
								try {
									const credential = await AppleAuthentication.signInAsync({
										requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
									});
									// Sign in via Supabase Auth.
									if (credential.identityToken) {
										const {
											error,
											data: { user },
										} = await supabase.auth.signInWithIdToken({
											provider: "apple",
											token: credential.identityToken,
										});
										console.log(JSON.stringify({ error, user }, null, 2));
										if (!error) {
											// User is signed in.
										}
									} else {
										throw new Error("No identityToken.");
									}
								} catch (e: any) {
									if (e.code === "ERR_REQUEST_CANCELED") {
										// handle that the user canceled the sign-in flow
									} else {
										// handle other errors
									}
								}
							}}
						/> */}

					<TouchableOpacity onPress={() => handleGitHubSignIn()}>
						<SquircleView style={s.socialBtnBody} cornerSmoothing={70} borderRadius={18} backgroundColor="#000">
							<Ionicons name="logo-github" size={34} color="#fff" />
						</SquircleView>
					</TouchableOpacity>
					<TouchableOpacity onPress={onPressAppleOAuth}>
						<SquircleView style={s.socialBtnBody} cornerSmoothing={70} borderRadius={18} backgroundColor="#000">
							<Ionicons name="logo-apple" size={34} color="#fff" />
						</SquircleView>
					</TouchableOpacity>
					<TouchableOpacity onPress={onPressGoogleOAuth}>
						<SquircleView style={s.socialBtnBody} cornerSmoothing={70} borderRadius={18} backgroundColor="#EA4335">
							<Ionicons name="logo-google" size={34} color="#fff" />
						</SquircleView>
					</TouchableOpacity>
					<TouchableOpacity onPress={onPressFacebookOAuth}>
						<SquircleView style={s.socialBtnBody} cornerSmoothing={70} borderRadius={18} backgroundColor="#1877F2">
							<Ionicons name="logo-facebook" size={27} color="#fff" />
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
		// ...shadow.shadowXs,
		gap: 20,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
	},
	title: {
		// fontFamily: fonts.bold,
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
		// fontFamily: fonts.regular,
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
