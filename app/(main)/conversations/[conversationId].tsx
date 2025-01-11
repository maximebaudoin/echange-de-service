import AppView from "@/components/AppView";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { Easing, FadeInDown, FadeOutDown, LinearTransition, useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@/constants/Message";
import MessageComponent from "@/components/MessageComponent";
import { Conversation } from "@/constants/Conversation";
import { useSession } from "@/hooks/useSession";
import { LinearGradient } from "expo-linear-gradient";
import MessageIsWritingComponent from "@/components/MessageIsWritingComponent";
import Constants from "expo-constants";
import { set } from "date-fns";
import { BlurView } from "expo-blur";

const ConversationScreen = () => {
	const { profile } = useSession();

	const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
	const channel = useRef<RealtimeChannel | null>(null);
	const messageInputRef = useRef(null);
	const isWritingTimeout = useRef<NodeJS.Timeout | null>(null);

	const [showOverflowTitle, setShowOverflowTitle] = useState(false);
	const [messageValue, setMessageValue] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [isWriting, setIsWriting] = useState(false);

	const keyboard = useAnimatedKeyboard();
	const animatedStyleMessageInput = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboard.height.value }],
	}));
	const animatedStyleFlatListMessages = useAnimatedStyle(() => ({
		paddingBottom: keyboard.height.value,
	}));

	useEffect(() => {
		retrieveConversation();
		retrieveMessages();
	}, []);

	useEffect(() => {
		channel.current = supabase.channel(`conversation_${conversationId}`);

		channel.current
			.on("broadcast", { event: "message" }, ({ payload }) => {
				handleReceiveMessage(payload);
			})
			.on("broadcast", { event: "isWriting" }, ({ payload }) => {
				handleIsWriting(payload);
			})
			.on("broadcast", { event: "isSeen" }, ({ payload }) => {
				handleIsSeen(payload);
			})
			.subscribe();

		return () => {
			channel.current?.unsubscribe();
			channel.current = null;
		};
	}, [conversationId]);

	useEffect(() => {
        if(messageValue.trim().length === 0) {
            return;
        }

		clearTimeout(isWritingTimeout.current!);

		channel.current?.send({
			event: "isWriting",
			payload: true,
			type: "broadcast",
		});

		isWritingTimeout.current = setTimeout(() => {
			channel.current?.send({
				event: "isWriting",
				payload: false,
				type: "broadcast",
			});
		}, 5000);
	}, [messageValue]);

	const handleReceiveMessage = useCallback(async (payload: Message) => {
		setMessages([payload, ...messages]);

		if (!channel.current) {
			return;
		}

		try {
			const { error } = await supabase
				.from("messages")
				.update({
					is_seen: true,
				})
				.eq("id", payload.id);

			if (error) {
				throw new Error(error.message);
			}

			channel.current.send({
				type: "broadcast",
				event: "isSeen",
				payload: payload.id,
			});
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	}, []);

	const handleIsWriting = useCallback((payload: boolean) => {
		setIsWriting(payload); 
	}, []);

	const handleIsSeen = useCallback((payload: string) => {
        setTimeout(() => {
            const newMessages = messages.map((message) => {
                if (message.id === payload) {
                    return { ...message, is_seen: true };
                }

                return message;
            });

            setMessages(newMessages);
        }, 700);
        
	}, [messages]);

	const handleGoBack = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	}, []);

	const handleSendMessage = useCallback(async () => {
		if (!channel.current || messageValue.trim().length === 0) {
			return;
		}

		try {
			const { data: dataNewMessage, error: errorNewMessage } = await supabase
				.from("messages")
				.insert({
					text: messageValue,
					user_id: profile?.id,
					conversation_id: conversationId,
				})
				.select()
				.single();

			if (errorNewMessage) {
				throw new Error(errorNewMessage.message);
			}

			channel.current.send({
				type: "broadcast",
				event: "message",
				payload: dataNewMessage,
			});

            console.log(messages);
            console.log(dataNewMessage);
            
            

			setMessages([dataNewMessage, ...messages]);
			setMessageValue("");

			clearTimeout(isWritingTimeout.current!);

			channel.current.send({
				event: "isWriting",
				payload: false,
				type: "broadcast",
			});
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	}, [messageValue, profile?.id, conversationId]);

	const retrieveConversation = useCallback(async () => {
		setRefreshing(true);

		try {
			const { data, error } = await supabase
				.from("conversations")
				.select(
					`
                    id, created_at,
                    user1:profiles!conversations_user_id_1_fkey(id, first_name, last_name, image_url),
                    user2:profiles!conversations_user_id_2_fkey(id, first_name, last_name, image_url)
                `
				)
				.eq("id", conversationId)
				.single();

			if (error) {
				throw new Error(error.message);
			}

			// @ts-ignore
			const dataConversation = data.user1.id === profile?.id ? { id: data.id, created_at: data.created_at, user: data.user2 } : { id: data.id, created_at: data.created_at, user: data.user1 };

			// @ts-ignore
			setConversation(dataConversation);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		} finally {
			setRefreshing(false);
		}
	}, [conversationId]);

	const retrieveMessages = async () => {
		setRefreshing(true);

		try {
			const { data, error } = await supabase.from("messages").select().eq("conversation_id", conversationId).order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			setMessages(data);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		} finally {
			setRefreshing(false);
		}
	};

	if (conversation === null) {
		return null;
	}

	return (
		<AppView style={{ backgroundColor: "#fff" }} keyboardAvoidingView={false}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 16, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: "#00000020" }}>
				<Pressable style={{ padding: 16, margin: -16 }} onPress={handleGoBack}>
					<SymbolView name="arrow.left" size={23} weight="semibold" tintColor="#000000" />
				</Pressable>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 6,
					}}
				>
					<Image source={{ uri: conversation.user.image_url }} style={{ width: 35, height: 35, borderRadius: 99 }} />
					<Text
						style={{
							fontSize: 17,
							fontWeight: "600",
						}}
					>
						{conversation.user.first_name} {conversation.user.last_name}
					</Text>
				</View>
				{showOverflowTitle && (
					<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
						<ThemedText type="subtitle">Conversations</ThemedText>
					</Animated.View>
				)}
			</View>
			<Animated.View style={[{ flex: 1 }, animatedStyleFlatListMessages]}>
				<Animated.FlatList
					style={{
						flex: 1,
						backgroundColor: "#F1F1F1",
					}}
					contentContainerStyle={{
						alignItems: "stretch",
						gap: 8,
						padding: 16,
						paddingTop: 135,
					}}
					itemLayoutAnimation={LinearTransition.easing(Easing.inOut(Easing.ease))}
					ListHeaderComponent={isWriting ? <MessageIsWritingComponent /> : null}
					keyboardShouldPersistTaps="handled"
					inverted={true}
					showsVerticalScrollIndicator={true}
					data={messages}
					renderItem={({ item, index }) => <MessageComponent index={index} id={item.id} user_id={item.user_id} conversation_id={item.conversation_id} text={item.text} created_at={item.created_at} is_seen={item.is_seen} />}
				/>
				{/* <LinearGradient colors={['#F1F1F1', 'transparent']} style={[StyleSheet.absoluteFill, { height: 30, top: 0 }]} /> */}
			</Animated.View>
			<Animated.View
				style={[
					{
						marginTop: -120,
						padding: 16,
						paddingBottom: 24,
						borderTopWidth: 1,
						borderColor: "#00000020",
						backgroundColor: "#FFFFFF88",
					},
					animatedStyleMessageInput,
				]}
			>
				{Constants.appOwnership !== "expo" && <BlurView style={[StyleSheet.absoluteFill]} />}
				<TextInput onSubmitEditing={handleSendMessage} returnKeyType="done" returnKeyLabel="Envoyer" value={messageValue} onChangeText={setMessageValue} ref={messageInputRef} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 50, paddingHorizontal: 16 }]} placeholder="Message" placeholderTextColor="#00000020" />
			</Animated.View>
		</AppView>
	);
};

export default ConversationScreen;
