import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { Easing, interpolate, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const SelectorBetweenValues = ({ values, value, setValue }: { values: { [key in string]: string }; value: string; setValue: (value: any) => void }) => {
	const left = useSharedValue(0);

	const handleValuePressed = (slug: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setValue(slug);

        const indexOfSelectedValue = Object.values(values).findIndex((item) => values[slug] === item);
		left.value = (100 / Object.values(values).length) * indexOfSelectedValue;
	};

	const animatedStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(`${left.value}%`, {
                duration: 150,
                easing: Easing.inOut(Easing.quad),
                reduceMotion: ReduceMotion.System,
            }),
        };
    });

	return (
		<View style={{ width: "100%", flexDirection: "row", padding: 7, backgroundColor: "#fff", borderWidth: 1, borderColor: "#00000020", borderRadius: 99 }}>
			<View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
				<Animated.View style={[animatedStyle, { width: `${100 / Object.values(values).length}%`, backgroundColor: "#00B2FF", height: 45, borderRadius: 99, position: "absolute", top: 0 }]} />
				{Object.entries(values).map(([slug, item]) => (
					<Pressable key={slug} onPress={() => handleValuePressed(slug)} style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", height: 45, borderRadius: 99 }}>
						<Text style={{ fontSize: 16, fontWeight: 700, color: value === slug ? "#fff" : "#00B2FF" }}>{item}</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
};

export default SelectorBetweenValues;
