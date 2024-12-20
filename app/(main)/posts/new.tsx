import AppView from "@/components/AppView";
import { SymbolView } from "expo-symbols";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useRef, useState } from "react";
import Button from "@/components/Button";

const NewPostScreen = () => {
    const [textValue, setTextValue] = useState("");
    const [textIsFocused, setTextIsFocused] = useState(false);
    const textInputRef = useRef(null);
    
    const handleGoBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    }

    return (
        <AppView style={{ padding: 16, gap: 16 }} edges={['top', 'left', 'right', 'bottom']}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Pressable style={{ padding: 16, margin: -16 }} onPress={handleGoBack}>
                    <SymbolView name="arrow.left" size={23} weight="semibold" tintColor="#000000" />
                </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 16, paddingTop: 3, flexGrow: 1 }} style={{ flexGrow: 1 }}>
                <ThemedText type="title">Nouveau</ThemedText>
                <View style={{ flex: 1 }}>
                    <TextInput multiline={true} value={textValue} onChangeText={setTextValue} ref={textInputRef} onFocus={() => setTextIsFocused(true)} onBlur={() => setTextIsFocused(false)} style={[{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 17, borderRadius: 12, height: 150, padding: 16 }, textIsFocused && { borderWidth: 3, borderColor: "#00B2FF", padding: 14 }]} placeholder="Prénom" placeholderTextColor="#00000020" />
                </View>
            </ScrollView>
            <Button>Publier</Button>
        </AppView>
    );
}
 
export default NewPostScreen;