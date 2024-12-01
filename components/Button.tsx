import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

const Button = ({
    onPress,
    variant,
    style, 
    prevIcon: PrevIcon,
    nextIcon: NextIcon,
    disabled = false,
    children
}) => {
	const colorScheme = useColorScheme();

	const textColor = () => {
		if (variant === "secondary") {
			if (disabled) {
				return colorScheme == "light" ? "#CCCCCC" : "#505050";
			} else {
				return colorScheme == "light" ? "#1F1F1F" : "#FAFAFA";
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
				return colorScheme == "light" ? "#FAFAFA" : "#303030";
			}
		}
		if (variant === "danger") {
			if (!disabled) {
				return "#d44a5b";
			}
		}
		if (disabled) {
			return colorScheme == "light" ? "#DDDDDD" : "#282828";
		} else {
			return "#123c5b";
		}
	};

	return (
		<TouchableOpacity onPress={disabled ? () => {} : onPress} style={[variant === "secondary" ? s.secondary : variant === "danger" ? s.danger : s.btn, disabled && (variant === "secondary" ? s.secondaryDisabled : s.disabled), { backgroundColor: backgroundColor() }, style]} disabled={disabled}>
			{PrevIcon && <PrevIcon fill={textColor()} width={18} height={18} />}
			{children && <Text style={[{ color: textColor() }, variant === "secondary" ? s.btnSecondaryText : s.btnText]}>{children}</Text>}
			{NextIcon && <NextIcon fill={textColor()} width={18} height={18} />}
		</TouchableOpacity>
	);
};

export default Button;

const s = StyleSheet.create({
	btn: {
		paddingHorizontal: 20,
		paddingVertical: 13,
		borderRadius: 8,
		...shadow.shadowMd,
		backgroundColor: "#123c5b",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 13,
	},
	secondary: {
		paddingHorizontal: 20,
		paddingVertical: 13,
		borderRadius: 8,
		...shadow.shadowSm,
		backgroundColor: "#FAFAFA",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 13,
	},
	danger: {
		paddingHorizontal: 20,
		paddingVertical: 13,
		borderRadius: 8,
		...shadow.shadowSm,
		backgroundColor: "#d44a5b",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 13,
	},
	secondaryDisabled: {
		shadowOpacity: 0,
	},
	disabled: {
		backgroundColor: "#ddd",
		shadowOpacity: 0,
	},
	btnText: {
		fontSize: 14,
		fontFamily: fonts.bold,
		textAlign: "center",
	},
	btnSecondaryText: {
		fontFamily: fonts.medium,
		fontSize: 14,
		textAlign: "center",
	},
});
