import AppView from "@/components/AppView";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { router, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import * as Haptics from "expo-haptics";
import { usePost } from "@/hooks/usePosts";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import PostComponent from "../../../components/Post";
import HeadingSelectorBetweenValues from "@/components/HeadingSelectorBetweenValues";
import { PostType, postTypes } from "@/constants/PostType";
import { Post } from "@/constants/Post";

const TabsIndexScreen = () => {
    const navigation = useNavigation();
    const { selectedTransportNetwork } = useSession();

    const { posts, setPosts } = usePost();
    const [postsDisplayed, setPostsDisplayed] = useState<Post[]>(posts);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedPostType, setSelectedPostType] = useState<PostType>("proposition");

    useEffect(() => {
        refreshPosts();
    }, []);

    useEffect(() => {
        filterPostsByPostType();
    }, [selectedPostType, posts]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            console.log(true);
            
            refreshPosts();
        });
      
        return unsubscribe;
    }, [navigation]);

    const refreshPosts = useCallback(async () => {
        setRefreshing(true);

        try {
            const { data: dataPosts, error: errorPosts } = await supabase.from('post').select('*, profiles(id, first_name, last_name, image_url)').eq('transport_network_id', selectedTransportNetwork?.id).order('created_at', { ascending: false });

            if(errorPosts) {
                throw new Error(errorPosts.message);
            }

            if(JSON.stringify(dataPosts) === JSON.stringify(posts)) {
                return;
            }

            setPosts(dataPosts);
            setPostsDisplayed(dataPosts);
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

    const filterPostsByPostType = async () => {
        let tempPosts = posts;
        tempPosts = tempPosts.filter((value) => value.type === selectedPostType);
        setPostsDisplayed(tempPosts);
    }

    const handleNewPost = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(main)/posts/new');
    }

	return (
        <>
            <View style={{ padding: 12, paddingLeft: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <HeadingSelectorBetweenValues values={postTypes} value={selectedPostType} setValue={setSelectedPostType} />
				<TouchableOpacity onPress={handleNewPost}>
					<SquircleView
						squircleParams={{
							cornerSmoothing: 1,
							cornerRadius: 16,
							fillColor: "#00000007",
							strokeWidth: 1,
							strokeColor: "#00000020",
						}}
						style={{
							width: 65,
							alignItems: "center",
							justifyContent: "center",
							height: 36,
						}}
					>
						<SymbolView name="plus" tintColor="#000000DD" size={18} weight="semibold" />
					</SquircleView>
				</TouchableOpacity>
            </View>
            <FlatList
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    alignItems: 'stretch',
                    padding: 12,
                    gap: 16
                }}
                refreshing={refreshing}
                onRefresh={refreshPosts}
                data={postsDisplayed}
                renderItem={({item, index}) => (
                    <PostComponent
                        index={index}
                        id={item.id}
                        user_id={item.user_id}
                        text={item.text}
                        type={item.type}
                        attachments={item.attachments}
                        created_at={item.created_at}
                        user_first_name={item.profiles.first_name as string}
                        user_last_name={item.profiles.last_name as string}
                        user_imag_url={item.profiles.image_url as string}
                    />
                )}
            />
        </>
	);
};

export default TabsIndexScreen;