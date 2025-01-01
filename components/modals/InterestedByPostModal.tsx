import { useModal } from "@/hooks/useModal";
import MaskedView from "@react-native-masked-view/masked-view";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import Modal from "react-native-modal";

const InterestedByPostModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const colorScheme = useColorScheme();

    const isModalOpen = isOpen && type === "interestedByPost";
    // const { channelType } = data;

    const handleClose = () => {
        onClose();
    }

    return (
        <Modal
            isVisible={isModalOpen}
            swipeDirection="down"
            onSwipeComplete={onClose}
            style={{ margin: 0, padding: 8 }}
            hideModalContentWhileAnimating={true}
            onBackdropPress={onClose}
            avoidKeyboard
        >
            <MaskedView
                style={{ padding: 25, paddingBottom: 35, paddingTop: 40, borderWidth: 2, borderColor: '#fff'  }}
                maskElement={
                    <SquircleView
                        style={StyleSheet.absoluteFill}
                        squircleParams={{
                            cornerSmoothing: 0.7,
                            cornerRadius: 20,
                            fillColor: colorScheme == 'light' ? "#ffffff" : "#1F1F1F",
                        }}
                    />
                }
            >
                <View style={{
                    borderRadius: 99,
                    backgroundColor: colorScheme == 'light' ? "#00000033" : "#404040",
                    width: 40,
                    height: 6,
                    position: 'absolute',
                    top: 10,
                    alignSelf: 'center',
                }} />
                <Text>test</Text>
            </MaskedView>
            {/* Modal content */}
        </Modal>
    );
}
 
export default InterestedByPostModal;