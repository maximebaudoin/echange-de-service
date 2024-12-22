import Button from "@/components/Button";
import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import * as Haptics from "expo-haptics";
import TransportNetworkButton from "./_components/TransportNetworkButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Steps from "./_components/Steps";
import { useSession } from "@/hooks/useSession";
import { Redirect, router } from "expo-router";

type TransportNetwork = {
    id: string,
    image_name: string,
    name: string,
    image_url?: string
}

export default function SelectTransportNetworkScreen() {
    const { session, profile, selectedTransportNetwork, setSelectedTransportNetwork } = useSession();

    const [transportsNetworks, setTransportsNetworks] = useState<TransportNetwork[]>([]);
    const [selectedTempTransportNetwork, setSelectedTempTransportNetwork] = useState<string | null | undefined>(selectedTransportNetwork?.id);
    const [matriculeValue, setMatriculeValue] = useState<string | undefined>(selectedTransportNetwork?.matricule);
    const [isLoaded, setIsLoaded] = useState(false);
    const [nextIsLoading, setNextIsLoading] = useState(false);

	const logo = require("../../../assets/images/icon.png");

    useEffect(() => {
        getTransportsNetworks();
    }, []);

    const getTransportsNetworks = async () => {
        setIsLoaded(false);

        try {
            const { data, error, status } = await supabase.from("transport_network").select();
            
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                for(let item of data) {
                    const { data: imageData } = await supabase.storage.from('transport_network').createSignedUrl(item.image_name, 60, {
                        transform: {
                            width: 60,
                            height: 60,
                            resize: "contain"
                        },
                    });

                    if(imageData) {
                        item.image_url = imageData.signedUrl;
                    }
                }

                setTransportsNetworks(data);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setIsLoaded(true);
        }
    };

    const handleItemPress = (id: string) => {
        setSelectedTempTransportNetwork(id);
    }

    const handlePressNext = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setNextIsLoading(true);

        try {
            if(!matriculeValue || matriculeValue === "") {
                return;
            }

            const { data, error, status } = await supabase.from("user_transport_network").upsert({
                transport_network_id: selectedTempTransportNetwork,
                matricule: matriculeValue,
                user_id: session?.user.id,
                current: true
            });
            
            if (error) {
                throw error;
            }

            const transport_network = transportsNetworks.find(el => el.id === selectedTempTransportNetwork);

            if(!transport_network) {
                throw new Error('Impossible de récupérer le réseau sélectionné');
            }

            setSelectedTransportNetwork({
                id: transport_network?.id,
                name: transport_network?.name,
                image_name: transport_network?.image_name,
                matricule: matriculeValue
            });
            
            router.push('/(auth)/(firstLogin)/user-infos');
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setNextIsLoading(false);
        }
    }

    if(!session || !profile) {
        return <Redirect href="/(main)/(tabs)" />;
    }

	return (
		<KeyboardAvoidingView style={{ flex: 1, justifyContent: "center", alignItems: "stretch", backgroundColor: "#F8F8F8" }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView edges={['top']} style={{ paddingHorizontal: 16 }}>
                <Steps current={0} />
            </SafeAreaView>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 24 }}>
                    <Image
                        source={logo}
                        style={{
                            width: 100,
                            height: 100,
                            marginBottom: 16,
                        }}
                    />
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 28,
                            color: "#000",
                            marginBottom: 8,
                            textAlign: 'center'
                        }}
                    >
                        Choix du réseau de transport
                    </Text>
                    <Text
                        style={{
                            fontWeight: "light",
                            fontSize: 15,
                            color: "#000",
                            opacity: 0.36,
                            textAlign: 'center'
                        }}
                    >
                        Sélectionnez votre réseau de transport ainsi que votre matricule.
                    </Text>
                </View>
                <View style={{ height: "60%", padding: 24, alignItems: "stretch", gap: 12 }}>
                    {/* <TextInput style={{ borderWidth: 1, borderColor: "#00000020", backgroundColor: "#fff", fontSize: 16, borderRadius: 12, height: 40, paddingHorizontal: 12 }} placeholder="Recherche..." placeholderTextColor="#00000020" /> */}
                    {isLoaded ? (
                        transportsNetworks.map(item => (
                            <TransportNetworkButton
                                key={item.id}
                                id={item.id}
                                imageUrl={item.image_url}
                                name={item.name}
                                selected={selectedTempTransportNetwork === item.id}
                                handlePress={handleItemPress}
                                matriculeValue={matriculeValue ?? ''}
                                setMatriculeValue={setMatriculeValue}
                            />
                        ))
                    ) : (
                        <View style={{ flex: 1, padding: 16 }}>
                            <ActivityIndicator size="large" />
                        </View>
                    )}
                </View>
            </ScrollView>
            <SafeAreaView edges={["left", "right", "bottom"]} style={{ paddingHorizontal: 16 }}>
                <Button onPress={handlePressNext} disabled={selectedTransportNetwork === null || matriculeValue === "" || nextIsLoading}>
                    {nextIsLoading ? <ActivityIndicator color="white" /> : "Suivant"}
                </Button>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
