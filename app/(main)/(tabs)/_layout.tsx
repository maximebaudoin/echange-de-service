import AppHeader from "@/components/AppHeader";
import AppView from "@/components/AppView";
import AppViewContent from "@/components/AppViewContent";
import { tabs } from "@/constants/Tabs";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";

const TabsLayout = () => {
	return (
        <AppView>
            <AppHeader />
            <AppViewContent>
                <Tabs screenOptions={{ tabBarActiveTintColor: "#00B2FF", headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: tabs.index,
                            tabBarIcon: ({ color }) => <FontAwesome size={24} name="newspaper-o" color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="alerts"
                        options={{
                            title: tabs.alerts,
                            tabBarIcon: ({ color }) => <FontAwesome size={20} name="bell" color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="account"
                        options={{
                            title: tabs.account,
                            tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
                        }}
                    />
                </Tabs>
            </AppViewContent>
        </AppView>
		
	);
};

export default TabsLayout;
