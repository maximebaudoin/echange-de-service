import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppViewProps extends ViewProps {
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
    keyboardAvoidingView?: boolean;
}

const AppView = ({ children, style, edges = ['top', 'left', 'right'], keyboardAvoidingView = false }: AppViewProps) => {
    
    const body = (
        <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
            {children}
        </SafeAreaView>
    );

    if(keyboardAvoidingView) {
        return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {body}
        </KeyboardAvoidingView>
    }
    
    return body;
}
 
export default AppView;