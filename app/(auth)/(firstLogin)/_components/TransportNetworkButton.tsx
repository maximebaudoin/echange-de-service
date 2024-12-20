import { Button, Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { SymbolView } from "expo-symbols";
import { supabase } from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { SquircleButton } from "expo-squircle-view";
import { SquircleView } from "react-native-figma-squircle";

const TransportNetworkButton = ({
    id,
    imageUrl = '',
    name,
    selected,
    matriculeValue,
    setMatriculeValue,
    handlePress
}: {
    id: string,
    imageUrl?: string,
    name: string,
    selected: boolean,
    matriculeValue: string,
    setMatriculeValue: (value: string) => void,
    handlePress: (id: string) => void
}) => {
    const matriculeInputRef = useRef<TextInput>(null);

    const handlePressButton = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        handlePress(id);

        setTimeout(() => {
            if(matriculeInputRef) {
                matriculeInputRef.current?.focus();
            }
        }, 100);
    }
      
    return (
        <SquircleView squircleParams={{ cornerSmoothing: 0.7, cornerRadius: 20, fillColor: 'white', strokeWidth: selected ? 3 : 1, strokeColor: selected ? '#00B2FF' : '#DEDEDE' }} style={[{ padding: 12, width: '100%' }]}>
            <Pressable onPress={() => handlePressButton(id)} style={{ gap: 8 }}>
                <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flex: 1 }}>
                        {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 60, height: 60, objectFit: 'contain' }} />}
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={{ fontSize: 17, fontWeight: 600 }} numberOfLines={2}>{name}</Text>
                            {/* <Text style={{ fontSize: 13, fontWeight: 400, color: "#00000040" }}>-</Text> */}
                        </View>
                    </View>
                    <View style={{ width: 20, height: 20, backgroundColor: selected ? '#00B2FF' : '#E2E2E2', borderRadius: 99, alignItems: 'center', justifyContent: 'center' }}>
                        {selected && <SymbolView name="checkmark" weight="black" size={13} tintColor="#FFF" />}
                    </View>
                </View>
                {selected && <TextInput ref={matriculeInputRef} value={matriculeValue} onChangeText={setMatriculeValue} style={{ borderWidth: 1, borderColor: "#00000025", backgroundColor: "#fff", fontSize: 16, borderRadius: 12, height: 40, paddingHorizontal: 12 }} placeholder="Votre matricule..." placeholderTextColor="#00000040" />}
            </Pressable>
        </SquircleView>
    );
}
 
export default TransportNetworkButton;