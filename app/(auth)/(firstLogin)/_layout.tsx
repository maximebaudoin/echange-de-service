import { Stack } from "expo-router/stack";
import { Text, View } from "react-native";

const FirstLoginLayout = () => {
    return (
        <>
            <Stack screenOptions={{
                headerShown: false
            }} />
        </>
    );
}
 
export default FirstLoginLayout;