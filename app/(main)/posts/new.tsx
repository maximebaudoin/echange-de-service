import AppView from "@/components/AppView";
import { SymbolView } from "expo-symbols";
import { Keyboard, Linking, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import SelectorBetweenValues from "@/components/SelectorBetweenValues";
import { PostType, postTypes } from "@/constants/PostType";
import Animated, { BounceIn, FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, FadeOut, FadeOutDown, FadeOutRight, FadeOutUp, LinearTransition, SlideInLeft, SlideOutRight } from "react-native-reanimated";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";
import * as FileSystem from 'expo-file-system';
import { useSession } from "@/hooks/useSession";

const NewPostScreen = () => {
    const { profile, selectedTransportNetwork } = useSession();

	const [textValue, setTextValue] = useState("");
	const [textIsFocused, setTextIsFocused] = useState(false);
	const [postType, setPostType] = useState<PostType>("proposition");
	const [attachments, setAttachments] = useState<(DocumentPicker.DocumentPickerAsset | null)[]>([]);
	const [showOverflowTitle, setShowOverflowTitle] = useState(false);
	const [formError, setFormError] = useState<false | string>(false);
    const [formIsLoading, setFormIsLoading] = useState(false);

	const textInputRef = useRef(null);

	const emptyForm = textValue === "" && (!attachments.length || attachments[0] === null);

	const handleGoBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	const handleAddAttachment = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setAttachments([...attachments, null]);
	};

	const handleRemoveAttachment = (index: number) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		const _attachments = attachments;
		attachments.splice(index, 1);
		setAttachments([..._attachments]);
	};

	const handleSelectAttachment = async (index: number) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		const { assets, canceled } = await DocumentPicker.getDocumentAsync({
			multiple: false,
			type: ["application/pdf"],
		});

		if (canceled || !assets || !assets.length) {
			return;
		}

		const _attachments = attachments;
		_attachments[index] = assets[0];

		setAttachments([..._attachments]);
	};

	const onBodyScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (event.nativeEvent.contentOffset.y > 24) {
			setShowOverflowTitle(true);
		} else {
			setShowOverflowTitle(false);
		}
	};

	const handleSubmit = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        setFormIsLoading(true);
		setFormError(false);

		try {
			if (emptyForm) {
				setFormError("Entrez au minimum un message ou ajoutez une pièce jointe.");
				return;
			}

            let attachmentsNames: string[] = [];

			if (!!attachments.length) {
				for (const attachment of attachments) {
                    if(!attachment?.uri) continue;

                    const base64 = await FileSystem.readAsStringAsync(attachment.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    const name = uuidv4()+'.pdf';

					const { data: dataUpload, error: errorUpload } = await supabase.storage.from("posts").upload(name, decode(base64), {
						contentType: attachment.mimeType,
					});

                    if(errorUpload || !dataUpload) {
                        continue;
                    }

                    attachmentsNames.push(name);
				}
			}

            const { error } = await supabase.from("post").insert({
                user_id: profile?.id,
                transport_network_id: selectedTransportNetwork?.id,
                text: textValue,
                type: postType,
                attachments: attachmentsNames
            });

            if(error) {
                throw new Error(error.message);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            setTextValue("");
            setAttachments([]);
            setPostType("proposition");

            router.back();
		} catch (err) {
            if (err instanceof Error) {
				console.error(err.message);
			}
		} finally {
            setTimeout(() => {
                setFormIsLoading(false);
            }, 500);
		}
	};    

	return (
		<AppView style={{ padding: 16, gap: 16 }} edges={["top", "left", "right", "bottom"]} keyboardAvoidingView={true}>
			<View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", gap: 16 }}>
				<Pressable style={{ padding: 16, margin: -16 }} onPress={handleGoBack}>
					<SymbolView name="arrow.left" size={23} weight="semibold" tintColor="#000000" />
				</Pressable>
				{showOverflowTitle && (
					<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
						<ThemedText type="subtitle">Nouvelle publication</ThemedText>
					</Animated.View>
				)}
			</View>
			<ScrollView onScroll={onBodyScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 16, paddingTop: 3, overflow: "visible" }} style={{ flex: 1 }}>
				<ThemedText type="title">Nouvelle publication</ThemedText>
				<View style={{ flex: 1, gap: 16 }}>
					{formError && (
						<Animated.View entering={FadeInRight} exiting={FadeOutRight} style={{ padding: 16, borderRadius: 12, borderWidth: 2, borderColor: "#d44a5b", backgroundColor: "#d44a5b20" }}>
							<Text style={{ color: "#d44a5b", fontWeight: 500 }}>{formError}</Text>
						</Animated.View>
					)}
					<SelectorBetweenValues values={postTypes} value={postType} setValue={setPostType} />
					<TextInput multiline={true} value={textValue} onChangeText={setTextValue} ref={textInputRef} onFocus={() => setTextIsFocused(true)} onBlur={() => setTextIsFocused(false)} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 300, padding: 16 }, textIsFocused && { borderWidth: 3, borderColor: "#00B2FF", padding: 14 }]} placeholder="Message" placeholderTextColor="#00000020" />
					<View style={{ gap: 4, flexDirection: "row", alignItems: "baseline" }}>
						<ThemedText type="subtitle">Pièces jointes</ThemedText>
						<ThemedText type="small">(Service, photo, ...)</ThemedText>
					</View>
					{!!attachments.length && (
						<View style={{ gap: 16 }}>
							{attachments.map((attachment, index) => (
								<Animated.View layout={LinearTransition} entering={FadeInLeft.delay(200)} exiting={FadeOutRight} key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 2, borderColor: "#00B2FF55", padding: 10, borderRadius: 12, borderStyle: "dashed" }}>
									{attachment === null && <Button onPress={() => handleSelectAttachment(index)} disabled={formIsLoading}>Sélectionner</Button>}
									{attachment !== null && <Text>{attachment.name}</Text>}
									<Button onPress={() => handleRemoveAttachment(index)} variant="secondary" disabled={formIsLoading}>
										<SymbolView name="xmark" tintColor="#00B2FF" weight="bold" />
									</Button>
								</Animated.View>
							))}
						</View>
					)}
					<Animated.View layout={LinearTransition}>
						<Button onPress={handleAddAttachment} variant="secondary" disabled={attachments[attachments.length - 1] === null || formIsLoading}>
							Ajouter
						</Button>
					</Animated.View>
				</View>
			</ScrollView>
			<Button onPress={handleSubmit} disabled={emptyForm || formIsLoading}>
				Publier
			</Button>
		</AppView>
	);
};

export default NewPostScreen;
