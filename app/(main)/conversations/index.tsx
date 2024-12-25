import AppView from "@/components/AppView";
import { Link } from "expo-router";
import { Text } from "react-native";

const ConversationsScreen = () => {
    return (
        <AppView>
            <Text>Conversations</Text>
            <Link href="/conversations/ff510309-a187-438f-ade6-1faec1247814">Conversation 1</Link>
        </AppView>
    );
}
 
export default ConversationsScreen;