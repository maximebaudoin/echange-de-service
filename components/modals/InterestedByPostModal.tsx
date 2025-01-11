import { useModal } from "@/hooks/useModal";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { Gesture, GestureDetector, GestureEvent, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const InterestedByPostModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const prevIsOpen = useRef(isOpen);
	const colorScheme = useColorScheme();

	Animated.addWhitelistedUIProps({ intensity: true });
	const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

	const isModalOpen = isOpen && type === "interestedByPost";
	// const { channelType } = data;

	const translateY = useSharedValue(height);

	const handleClose = () => {
		translateY.value = withTiming(height, { duration: 300 }, () => {
			runOnJS(onClose)();
		});
	};

	// Gestion du geste
	const gesture = Gesture.Pan()
		.onUpdate((event) => {
			if (event.translationY > 0) {
				translateY.value = event.translationY;
			}
		})
		.onEnd((event) => {
			if (event.translationY > 150) {
				runOnJS(handleClose)(); // Fermer la modal si le swipe est assez grand
			} else {
				translateY.value = withSpring(0); // Revenir à la position initiale
			}
		});

	// Styles animés
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const animatedProps = useAnimatedProps(() => {
		return {
			intensity: Math.round(interpolate(translateY.value, [0, 150], [50, 0], Extrapolation.CLAMP)),
		};
	});

    useDerivedValue(() => {
        console.log("translateY:", translateY.value);
    });    

	useEffect(() => {
		if (isOpen && !prevIsOpen.current) {
			translateY.value = withTiming(0, { duration: 300 });
		}

		prevIsOpen.current = isOpen;
	}, [isOpen]);

	return (
		<Modal visible={isModalOpen} transparent={true} animationType="none" onRequestClose={handleClose}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<AnimatedBlurView style={[{ flex: 1, justifyContent: "flex-end", alignItems: "stretch" }, StyleSheet.absoluteFill]} animatedProps={animatedProps} />
				<GestureDetector gesture={gesture}>
					<Animated.View style={[{ flex: 1, justifyContent: "flex-end", alignItems: "stretch" }, animatedStyle]}>
						<SquircleView
							style={{ minHeight: 300 }}
							squircleParams={{
								cornerSmoothing: 0.7,
								cornerRadius: 20,
								fillColor: colorScheme == "light" ? "#ffffff" : "#1F1F1F",
							}}
						>
							<SafeAreaView edges={["bottom"]} style={{ position: "relative" }}>
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
								<Text>test</Text>
							</SafeAreaView>
						</SquircleView>
					</Animated.View>
				</GestureDetector>
			</GestureHandlerRootView>
		</Modal>
	);
};

export default InterestedByPostModal;
