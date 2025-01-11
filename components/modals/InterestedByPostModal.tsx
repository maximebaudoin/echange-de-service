import { useModal } from "@/hooks/useModal";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { Gesture, GestureDetector, GestureEvent, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Easing, Extrapolation, interpolate, ReduceMotion, runOnJS, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const InterestedByPostModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const prevIsOpen = useRef(isOpen);
	const colorScheme = useColorScheme();

	// Animated.addWhitelistedUIProps({ intensity: true });
	// const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

	const isModalOpen = isOpen && type === "interestedByPost";
	// const { channelType } = data;

	const translateY = useSharedValue(height);
	const blurIntensity = useSharedValue(0);

	const handleClose = () => {
		blurIntensity.value = withTiming(0);
		translateY.value = withTiming(height, { duration: 350 }, () => {
			runOnJS(onClose)();
		});
	};

	// Gestion du geste
	const gesture = Gesture.Pan()
		.onUpdate((event) => {
			if (event.translationY > 0) {
				translateY.value = event.translationY;
				blurIntensity.value = interpolate(
					event.translationY,
					[0, 150], // Plage d'animation
					[1, 0.8], // Plage d'intensité
					Extrapolation.CLAMP
				);
			} else {
				// Plus le geste est vers le haut, plus le mouvement est réduit (aimant inversé)
				const scaledTranslation = interpolate(
					event.translationY,
					[0, -1000], // Plage du geste
					[0, -70], // Plage du déplacement
					Extrapolation.CLAMP
				);
				translateY.value = scaledTranslation;
			}
		})
		.onEnd((event) => {
			if (event.translationY > 100) {
				runOnJS(handleClose)(); // Fermer la modal si le swipe est assez grand
			} else {
				translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.System }); // Revenir à la position initiale
				blurIntensity.value = withTiming(1);
			}
		});

	// Styles animés
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));
	const blurViewAnimatedStyle = useAnimatedStyle(() => ({
		opacity: blurIntensity.value,
	}));

	// const animatedProps = useAnimatedProps(() => ({
	// 	intensity: blurIntensity.value, // Utilisation directe de la sharedValue
	// }));

	useEffect(() => {
		if (isOpen && !prevIsOpen.current) {
			translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.System });
			blurIntensity.value = withTiming(1, { duration: 250 });
		}

		prevIsOpen.current = isOpen;
	}, [isOpen]);

	return (
		<Modal visible={isModalOpen} transparent={true} animationType="none" onRequestClose={handleClose}>
            <AnimatedPressable style={[{ flex: 1 }, StyleSheet.absoluteFill, blurViewAnimatedStyle]} onPress={handleClose}>
                <BlurView style={[{ flex: 1 }]} intensity={75} tint="dark" />
            </AnimatedPressable>
                <GestureHandlerRootView>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <GestureDetector gesture={gesture}>
                            <Animated.View style={[{ justifyContent: "flex-end", alignItems: "stretch" }, animatedStyle]}>
                                <SquircleView
                                    squircleParams={{
                                        cornerSmoothing: 0.7,
                                        cornerRadius: 40,
                                        fillColor: colorScheme == "light" ? "#ffffff" : "#1F1F1F",
                                    }}
                                >
                                    <SafeAreaView edges={["bottom"]} style={{ position: "relative", padding: 25 }}>
                                        <View
                                            style={{
                                                borderRadius: 99,
                                                backgroundColor: colorScheme == "light" ? "#00000033" : "#404040",
                                                width: 40,
                                                height: 6,
                                                position: "absolute",
                                                top: 10,
                                                alignSelf: "center",
                                            }}
                                        />
                                        <Text style={{ paddingVertical: 150 }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, voluptate dolorem laborum illo delectus ipsa impedit tenetur ut temporibus. Mollitia aperiam, dolorum cumque aliquid perferendis nihil quo voluptate quidem repudiandae.</Text>
                                    </SafeAreaView>
                                </SquircleView>
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </GestureHandlerRootView>
		</Modal>
	);
};

export default InterestedByPostModal;
