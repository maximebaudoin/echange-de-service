import { Text, View, ViewProps } from "react-native";
import { SquircleView } from "react-native-figma-squircle";

const AppViewContent = ({ children }: ViewProps) => {
	return (
		<View style={{ flex: 1 }}>
			<SquircleView
				squircleParams={{
					cornerSmoothing: 0.7,
					cornerRadius: 35,
					bottomLeftCornerRadius: 0,
					bottomRightCornerRadius: 0,
					fillColor: "#fff",
				}}
				style={{
					flex: 1,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.1,
					shadowRadius: 3.84,

					elevation: 3,
				}}
			>
				<View style={{ flex: 1, borderRadius: 35, overflow: 'hidden' }}>{children}</View>
			</SquircleView>
		</View>
	);
};

export default AppViewContent;
