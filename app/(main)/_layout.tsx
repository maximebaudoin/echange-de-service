import { Redirect, Stack } from "expo-router";
import { useSession } from "@/hooks/useSession";
import { PostProvider } from "@/hooks/usePosts";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "@/utils/pushNotifications";
import { ConversationProvider } from "@/hooks/useConversations";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function AppLayout() {
	const { session, profile } = useSession();
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
	const notificationListener = useRef<Notifications.EventSubscription>();
	const responseListener = useRef<Notifications.EventSubscription>();

	useEffect(() => {
		if (!session || !profile || !profile.completed) {
			return;
		}

		registerForPushNotificationsAsync()
			.then((token) => {
                console.log('token is : ' + token);
                setExpoPushToken(token ?? "")
            })
			.catch((error: any) => setExpoPushToken(`${error}`));

		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response);
		});

		return () => {
			notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
			responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, [session, profile]);

	if (!session || !profile) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	if (!profile.completed) {
		return <Redirect href="/(auth)/(firstLogin)" />;
	}

	return (
        <ConversationProvider>
            <PostProvider>
                <Stack initialRouteName="(tabs)">
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="conversations" options={{ headerShown: false }} />
                    <Stack.Screen name="posts/new" options={{ headerShown: false }} />
                </Stack>
            </PostProvider>
        </ConversationProvider>
	);
}
