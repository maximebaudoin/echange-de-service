import { Message } from "@/constants/Message";
import useHelpers from "@/hooks/useHelpers";
import { useSession } from "@/hooks/useSession";
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";

const MessageComponent = ({
    index,
    id,
    text,
    user_id,
    conversation_id,
    created_at,
    is_seen,
    isLastOfUser,
    isFirstOfUser
}: Message & {
    index: number;
    isLastOfUser: boolean;
    isFirstOfUser: boolean;
}) => {
    const { profile } = useSession();
    const { formatRelativeDate } = useHelpers();

    const isCurrentUser = user_id === profile?.id;
    const formatedCreatedAt = formatRelativeDate(created_at);

    return (
        <View
            // entering={FadeInDown.delay(100)}
            style={{
                alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                gap: 3,
                marginBottom: isLastOfUser ? 8 : 0
            }}
        >
            <View style={{
                backgroundColor: isCurrentUser ? '#00B2FF' : '#fff',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 18,
                borderTopLeftRadius: !isCurrentUser ? (!isFirstOfUser ? 5 : 18) : 18,
                borderTopRightRadius: isCurrentUser ? (!isFirstOfUser ? 5 : 18) : 18,
                borderBottomLeftRadius: !isCurrentUser ? (!isLastOfUser ? 5 : 18) : 18,
                borderBottomRightRadius: isCurrentUser ? (!isLastOfUser ? 5 : 18) : 18,
                maxWidth: '80%',
                borderWidth: 0,
                borderColor: isCurrentUser ? '#029fe3' : '#00000015',
            }}>
                <Text style={{
                    color: isCurrentUser ? '#fff' : '#000',
                    fontWeight: isCurrentUser ? 400 : 400,
                    lineHeight: 19,
                    fontSize: 16
                }}>{text}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 2
            }}>
                {/* <Text style={{
                    color: '#00000055',
                    fontSize: 12,
                }}>
                    {formatedCreatedAt.charAt(0).toUpperCase() + formatedCreatedAt.slice(1)}
                </Text> */}
                {is_seen && <SymbolView name="eye.fill" tintColor="#029fe355" size={20} />}
            </View>
        </View>
    );
}
 
export default MessageComponent;