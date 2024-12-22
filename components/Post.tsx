import { Post as PostInterface } from "@/constants/Post";
import { Image, Text, View } from "react-native";
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeInUp, FadeOutDown, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import useHelpers from "@/hooks/useHelpers";
import Button from "./Button";
import { WebView } from 'react-native-webview';
import { useStorageUrl } from "@/hooks/useStorageUrl";
import { useEffect, useState } from "react";

const Post = ({
    index,
    id,
    text,
    type,
    attachments,
    created_at,
    user_id,
    user_first_name,
    user_last_name,
    user_imag_url
}: Partial<PostInterface> & {
    index: number;
    user_first_name: string;
    user_last_name: string;
    user_imag_url: string;
}) => {
    const { formatRelativeDate, getStorageUrl } = useHelpers();

    const [attachmentsUrls, setAttachmentsUrls] = useState<string[]>([]);

    const formatedCreatedAt = formatRelativeDate(created_at as string);

    useEffect(() => {
        const getAttachmentsUrls = async () => {
            setAttachmentsUrls([]);

            if(!attachments || !attachments.length) {
                return;
            }

            let tempAttachmentsUrls = [];

            for(const attachment of attachments) {
                const url = await getStorageUrl('posts', attachment);

                if(!url) {
                    continue;
                }

                tempAttachmentsUrls.push(url);
            }

            setAttachmentsUrls(tempAttachmentsUrls);
        }

        getAttachmentsUrls();
    }, [attachments]);

    return (
        <Animated.View
            key={id}
            entering={FadeInUp.delay(index*100)}
            exiting={FadeOutDown}
            layout={LinearTransition}
            style={{
                borderWidth: 1,
                borderColor: '#00000010',
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                padding: 16,

                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: .04,
                shadowRadius: 7,
                elevation: 5,

                gap: 16
            }}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <Image source={{ uri: user_imag_url }} width={40} height={40} style={{ borderRadius: 99 }} />
                    <View style={{
                        gap: 2
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: 600
                        }}>
                            {user_first_name} {user_last_name}
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#00000080',
                        }}>
                            {formatedCreatedAt.charAt(0).toUpperCase() + formatedCreatedAt.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={{
                fontSize: 15.5,
                lineHeight: 23
            }}>{text}</Text>
            {!!attachments?.length && <View>
                {attachmentsUrls.map((attachment, index) => {
                    return <WebView key={index} source={{ uri: attachment }} style={{ height: 300 }} />
                })}
            </View>}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Button variant="secondary" onPress={() => {}} style={{ alignItems: 'center' }} prevIconName="hand.raised.fingers.spread">
                    Intéréssé
                </Button>
            </View>
        </Animated.View>
        
    );
}
 
export default Post;