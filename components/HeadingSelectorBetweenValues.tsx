import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { Easing, interpolate, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const HeadingSelectorBetweenValues = ({ values, value, setValue }: { values: { [key in string]: string }; value: string; setValue: (value: any) => void }) => {
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
		<View style={{ flexDirection: "row", paddingBottom: 5 }}>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 16, position: 'static' }}>
				<Animated.View style={[animatedStyle, { width: `${100 / Object.values(values).length}%`, position: "absolute", bottom: 0 }]}>
                    <View style={{
                        backgroundColor: "#00B2FF80",
                        height: 4,
                        borderRadius: 99,
                        width: '80%',
                        alignSelf: 'center',
                    }} />
                </Animated.View>
				{Object.entries(values).map(([slug, item]) => (
					<Pressable key={slug} onPress={() => handleValuePressed(slug)} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 25, borderRadius: 99 }}>
						<Text style={{ fontSize: 16, fontWeight: 700, color: '#000000DD' }}>{item}</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
};

export default HeadingSelectorBetweenValues;
