import { Conversation } from "@/constants/Conversation";
import { Image, Text, View } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";

const ConversationComponent = ({
    index,
    id,
    user,
    created_at,
}: Partial<Conversation> & {
    index: number;
}) => {
    return (
        <Animated.View entering={FadeInLeft.delay(200+index*100)} style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        }}>
            <Image source={{ uri: user?.image_url }} style={{ width: 70, height: 70, borderRadius: 99 }} />
            <View style={{
                gap: 2,
                flex: 1,
                marginBottom: 5
            }}>
                <Text style={{
                    fontSize: 17,
                    fontWeight: 600
                }}>
                    {user?.first_name} {user?.last_name}
                </Text>
                <Text style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#00000080',
                    textOverflow: 'ellipsis',
                    width: '100%'
                }} numberOfLines={2}>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae doloremque eos ipsam esse facilis minima? Ullam, ex nisi recusandae a corrupti atque voluptate rerum, similique repellendus quas voluptates fugiat repellat.
                </Text>
            </View>
        </Animated.View>
    );
}
 
export default ConversationComponent;