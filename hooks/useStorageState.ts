import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseStateHook<T> = [T | null, (value: T | null) => void];

function useAsyncState<T>(initialValue: T | null = null): UseStateHook<T> {
	return useReducer((state: T | null, action: T | null = null): T | null => action, initialValue) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
	if (Platform.OS === "web") {
		try {
			if (value === null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, value);
			}
		} catch (e) {
			console.error("Local storage is unavailable:", e);
		}
	} else {
		if (value == null) {
            await AsyncStorage.removeItem(key);
			// await SecureStore.deleteItemAsync(key);
		} else {
            await AsyncStorage.setItem(key, value)
			// await SecureStore.setItemAsync(key, value);
		}
	}
}

export function useStorageState<T>(key: string): UseStateHook<T> {
	// Public
	const [state, setState] = useAsyncState<T | null>(null);

	// Get
    useEffect(() => {
		if (Platform.OS === "web") {
			try {
				if (typeof localStorage !== "undefined") {
					const storedValue = localStorage.getItem(key);
					if (storedValue !== null) {
						setState(JSON.parse(storedValue) as T);
					} else {
						setState(null);
					}
				}
			} catch (e) {
				console.error("Local storage is unavailable:", e);
				setState(null);
			}
		} else {
            AsyncStorage.getItem(key, (error, value) => {
                if (value !== null && !!value) {
					setState(JSON.parse(value) as T);
				} else {
					setState(null);
				}
            });
			// SecureStore.getItemAsync(key).then((value) => {
			// 	if (value !== null) {
			// 		setState(JSON.parse(value) as T);
			// 	} else {
			// 		setState(null);
			// 	}
			// });
		}
	}, [key]);


	// Set
    const setValue = useCallback(
		(value: T | null) => {
			setState(value);
			const serializedValue = value !== null ? JSON.stringify(value) : null;
			setStorageItemAsync(key, serializedValue);
		},
		[key]
	);

	return [state, setValue];
}
