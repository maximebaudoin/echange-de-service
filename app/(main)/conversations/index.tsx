import AppView from "@/components/AppView";
import { Post } from "@/constants/Post";
import { PostType } from "@/constants/PostType";
import { usePosts } from "@/hooks/usePosts";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/utils/supabase";
import { Link, router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useConversations } from "@/hooks/useConversations";
import { Conversation } from "@/constants/Conversation";
import ConversationComponent from "@/components/ConversationComponent";
import { SymbolView } from "expo-symbols";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";

const ConversationsScreen = () => {
    const navigation = useNavigation();
    const { profile } = useSession();

    const { conversations, setConversations } = useConversations();
    
    const [conversationsDisplayed, setConversationsDisplayed] = useState<Conversation[]>(conversations);
    const [refreshing, setRefreshing] = useState(false);
	const [showOverflowTitle, setShowOverflowTitle] = useState(false);

    useEffect(() => {
        refreshConversations();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            refreshConversations();
        });
      
        return unsubscribe;
    }, [navigation]);

    const refreshConversations = useCallback(async () => {
        setRefreshing(true);

        try {
            const { data: dataConversations, error: errorConversations } = await supabase
                .from('conversations')
                .select(`
                    id, created_at,
                    user1:profiles!conversations_user_id_1_fkey(id, first_name, last_name, image_url),
                    user2:profiles!conversations_user_id_2_fkey(id, first_name, last_name, image_url)
                `)
                .or(`user_id_1.eq.${profile?.id},user_id_2.eq.${profile?.id}`);

            if(errorConversations) {
                throw new Error(errorConversations.message);
            }

            if(JSON.stringify(dataConversations) === JSON.stringify(conversations)) {
                return;
            }

            const filteredConversations = dataConversations.map(conversation => {
                // @ts-ignore
                if (conversation.user1.id === profile?.id) {
                    return { id: conversation.id, created_at: conversation.created_at, user: conversation.user2 };
                } else {
                    return { id: conversation.id, created_at: conversation.created_at, user: conversation.user1 };
                }
            });

            // @ts-ignore
            setConversations(filteredConversations);
            // @ts-ignore
            setConversationsDisplayed(filteredConversations);
        } catch(err) {
            if(err instanceof Error) {
                console.log(err.message);
            }
        } finally {
            setTimeout(() => {
                setRefreshing(false);
            }, 1000);
        }
    }, []);

    // const handleNewPost = () => {
    //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    //     router.push('/(main)/posts/new');
    // }

    const handleGoBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };
    
    const onBodyScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (event.nativeEvent.contentOffset.y > 24) {
            setShowOverflowTitle(true);
        } else {
            setShowOverflowTitle(false);
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
                        <ThemedText type="subtitle">Conversations</ThemedText>
                    </Animated.View>
                )}
            </View>
            <FlatList
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    alignItems: 'stretch',
                    gap: 16
                }}
                ListHeaderComponent={<ThemedText type="title">Conversations</ThemedText>}
                onScroll={onBodyScroll}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refreshConversations}
                data={conversationsDisplayed}
                renderItem={({item, index}) => (
                    <ConversationComponent
                        index={index}
                        id={item.id}
                        user={item.user}
                        created_at={item.created_at}
                    />
                )}
            />
        </AppView>
    );
}
 
export default ConversationsScreen;