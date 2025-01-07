import AppView from "@/components/AppView";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@/constants/Message";
import MessageComponent from "@/components/MessageComponent";
import { BlurView } from "@react-native-community/blur";
import { Conversation } from "@/constants/Conversation";
import { useSession } from "@/hooks/useSession";
import { LinearGradient } from 'expo-linear-gradient';

const ConversationScreen = () => {
    const { profile } = useSession();
    
	const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
	const channel = useRef<RealtimeChannel | null>(null);
	const messageInputRef = useRef(null);

	const [showOverflowTitle, setShowOverflowTitle] = useState(false);
	const [messageValue, setMessageValue] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
        retrieveConversation();
		retrieveMessages();
	}, []);

	useEffect(() => {
		channel.current = supabase.channel(`conversation_${conversationId}`, {
			config: {
				broadcast: {
					self: true,
				},
			},
		});

		channel.current
			.on("broadcast", { event: "message" }, ({ payload }) => {
				handleInserts(payload);
			})
			.subscribe();

		return () => {
			channel.current?.unsubscribe();
			channel.current = null;
		};
	}, []);

	const handleInserts = (payload: any) => {
		setMessages([...messages, payload]);
	};

	const handleGoBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	function onSend() {
		if (!channel.current || messageValue.trim().length === 0) {
			return;
		}

		channel.current.send({
			type: "broadcast",
			event: "message",
			payload: { message: { message: messageValue } },
		});

		setMessageValue("");
	}

    const retrieveConversation = async () => {
		setRefreshing(true);

		try {
			const { data, error } = await supabase
                .from("conversations")
                .select(`
                    id, created_at,
                    user1:profiles!conversations_user_id_1_fkey(id, first_name, last_name, image_url),
                    user2:profiles!conversations_user_id_2_fkey(id, first_name, last_name, image_url)
                `)
                .eq("id", conversationId)
                .single();

			if (error) {
				throw new Error(error.message);
			}

            // @ts-ignore
            const dataConversation = (data.user1.id === profile?.id) ? { id: data.id, created_at: data.created_at, user: data.user2 } : { id: data.id, created_at: data.created_at, user: data.user1 };

            // @ts-ignore
			setConversation(dataConversation);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		} finally {
			setRefreshing(false);
		}
	};

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

    if(conversation === null) {
        return null;
    }

	return (
		<AppView style={{ backgroundColor: '#fff' }} keyboardAvoidingView={true}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 16, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#00000020' }}>
				<Pressable style={{ padding: 16, margin: -16 }} onPress={handleGoBack}>
					<SymbolView name="arrow.left" size={23} weight="semibold" tintColor="#000000" />
				</Pressable>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <Image source={{ uri: conversation.user.image_url }} style={{ width: 35, height: 35, borderRadius: 99 }} />
                    <Text style={{
                        fontSize: 17,
                        fontWeight: '600'
                    }}>{conversation.user.first_name} {conversation.user.last_name}</Text>
                </View>
				{showOverflowTitle && (
					<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
						<ThemedText type="subtitle">Conversations</ThemedText>
					</Animated.View>
				)}
			</View>
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{
                        flex: 1,
                        backgroundColor: '#F1F1F1'
                    }}
                    contentContainerStyle={{
                        alignItems: "stretch",
                        gap: 8,
                        padding: 16,
                        paddingTop: 135,
                    }}
                    keyboardShouldPersistTaps="handled"
                    inverted={true}
                    showsVerticalScrollIndicator={true}
                    data={messages}
                    renderItem={({ item, index }) => <MessageComponent index={index} id={item.id} user_id={item.user_id} discussion_id={item.discussion_id} text={item.text} created_at={item.created_at} />}
                />
                {/* <LinearGradient colors={['#F1F1F1', 'transparent']} style={[StyleSheet.absoluteFill, { height: 30, top: 0 }]} /> */}
            </View>
			<View
				style={{
                    marginTop: -120,
					padding: 16,
					paddingBottom: 24,
                    borderTopWidth: 1,
                    borderColor: '#00000020',
                    backgroundColor: '#FFFFFF88'
				}}
			>
				<BlurView style={[StyleSheet.absoluteFill]} blurType="light" blurAmount={15} reducedTransparencyFallbackColor="black" />
				<TextInput value={messageValue} onChangeText={setMessageValue} ref={messageInputRef} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 50, paddingHorizontal: 16 }]} placeholder="Message" placeholderTextColor="#00000020" />
			</View>
		</AppView>
	);
};

export default ConversationScreen;
