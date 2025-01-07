import { Message } from "@/constants/Message";
import { useSession } from "@/hooks/useSession";
import { Text, View } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";

const MessageComponent = ({
    index,
    id,
    text,
    user_id,
    discussion_id,
    created_at
}: Message & {
    index: number
}) => {
    const { profile } = useSession();

    const isCurrentUser = user_id === profile?.id;

    return (
        <Animated.View entering={FadeInLeft.delay(200+index*50)} style={{
            backgroundColor: isCurrentUser ? '#00B2FF' : '#fff',
            paddingHorizontal: 12,
            paddingVertical: 9,
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            borderRadius: 14,
            borderBottomLeftRadius: !isCurrentUser ? 0 : 14,
            borderBottomRightRadius: isCurrentUser ? 0 : 14,
            maxWidth: '80%',
            borderWidth: 1,
            borderColor: isCurrentUser ? '#029fe3' : '#00000015',
        }}>
            <Text style={{
                color: isCurrentUser ? '#fff' : '#000',
                fontWeight: isCurrentUser ? 500 : 400,
                lineHeight: 19,
                fontSize: 15
            }}>{text}</Text>
        </Animated.View>
    );
}
 
export default MessageComponent;