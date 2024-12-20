import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppViewProps extends ViewProps {
    edges: ('top' | 'right' | 'bottom' | 'left')[]
}

const AppView = ({ children, style, edges = ['top', 'left', 'right'] }: AppViewProps) => {
    return (
        <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
            {children}
        </SafeAreaView>
    );
}
 
export default AppView;