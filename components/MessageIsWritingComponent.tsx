import { Message } from "@/constants/Message";
import useHelpers from "@/hooks/useHelpers";
import { useSession } from "@/hooks/useSession";
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

const MessageIsWritingComponent = () => {
    return (
        <Animated.View
            entering={FadeInLeft.delay(200)}
            exiting={FadeOutLeft}
            style={{
                alignItems: 'flex-start',
                gap: 3
            }}
        >
            <View style={{
                backgroundColor: '#fff',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 14,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 14,
                maxWidth: '80%',
                borderWidth: 1,
                borderColor: '#00000015',
            }}>
                <SymbolView name="ellipsis" tintColor="#00000077" weight="bold" />
            </View>
        </Animated.View>
    );
}
 
export default MessageIsWritingComponent;