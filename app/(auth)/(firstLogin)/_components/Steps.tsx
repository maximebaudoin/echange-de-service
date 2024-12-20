import { View } from "react-native";

const Steps = ({
    current
}: {
    current: number
}) => {
    const total = 3;
    const data = Array.from({ length: total });

    return (
        <View style={{ width: '100%', flexDirection: 'row', gap: 7 }}>
            {data.map((item, index) => <View key={index} style={{ borderRadius: 99, height: 6, backgroundColor: index <= current ? '#00B2FF' : '#00000020', flex: 1 }}></View>)}
        </View>
    );
}
 
export default Steps;