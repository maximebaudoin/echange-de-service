import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { ReactNode } from "react";
import { SquircleView } from "react-native-figma-squircle";
import { SFSymbol, SymbolView } from "expo-symbols";

const Button = ({
    onPress = () => {},
    variant = 'primary',
    size = 'md',
    style = {}, 
    prevIconName = false,
    nextIconName = false,
    disabled = false,
    children
}: {
    onPress?: () => void,
    variant?: "secondary" | "primary" | "danger",
    size?: "md" | "xs",
    style?: StyleProp<ViewStyle>,
    prevIconName?: SFSymbol | false,
    nextIconName?: SFSymbol | false,
    disabled?: boolean,
    children: ReactNode
}) => {
	const colorScheme = useColorScheme();

	const textColor = () => {
		if (variant === "secondary") {
			if (disabled) {
				return colorScheme == "light" ? "#CCCCCC" : "#505050";
			} else {
				return colorScheme == "light" ? "#00B2FF" : "#FAFAFA";
			}
		}
		if (disabled) {
			return colorScheme == "light" ? "#FFFFFF" : "#808080";
		} else {
			return "#FFFFFF";
		}
	};

    const borderColor = () => {
		if (variant === "secondary") {
			if (disabled) {
				return colorScheme == "light" ? "#CCCCCC" : "#505050";
			} else {
				return colorScheme == "light" ? "#00B2FF33" : "#FAFAFA";
			}
		}
		if (disabled) {
			return colorScheme == "light" ? "#FFFFFF" : "#808080";
		} else {
			return "#FFFFFF";
		}
	};

	const backgroundColor = () => {
		if (variant === "secondary") {
			if (disabled) {
				return colorScheme == "light" ? "#FAFAFA" : "#282828";
			} else {
				return colorScheme == "light" ? "#00B2FF22" : "#303030";
			}
		}
		if (variant === "danger") {
			if (!disabled) {
				return "#d44a5b";
			}
		}
		if (disabled) {
			return colorScheme == "light" ? "#DDDDDD" : "#DDDDDD";
		} else {
			return "#00B2FF";
		}
	};

	return (
        <SquircleView squircleParams={{ cornerSmoothing: 1, cornerRadius: variant === "secondary" ? 13 : 16, fillColor: backgroundColor(), strokeWidth: variant === "secondary" ? 1.5 : 0, strokeColor: borderColor() }}>
            <TouchableOpacity onPress={disabled ? () => {} : onPress} style={[s.btn, variant === "secondary" && s.btnSecondary, style]} disabled={disabled}>
                {prevIconName && <SymbolView tintColor={textColor()} size={21} name={prevIconName} weight="semibold" />}
                {children && <Text style={[{ color: textColor() }, variant === "secondary" ? s.btnSecondaryText : s.btnText]}>{children}</Text>}
                {nextIconName && <SymbolView tintColor={textColor()} size={21} name={nextIconName} weight="semibold" />}
            </TouchableOpacity>
        </SquircleView>
	);
};

export default Button;

const s = StyleSheet.create({
	btn: {
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
        height: 50
	},
    btnSecondary: {
		paddingHorizontal: 15,
        height: 38,
    },
	btnText: {
		fontSize: 18,
        fontWeight: 600,
		textAlign: "center",
	},
	btnSecondaryText: {
		fontSize: 16,
        fontWeight: 700,
		textAlign: "center",
	},
});
