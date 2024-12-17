import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
	signIn: () => void;
	signOut: () => void;
	session?: string | null;
    setSession: (session: string) => void;
	isLoading: boolean;
}>({
	signIn: () => null,
	signOut: () => null,
	session: null,
    setSession: (session) => null,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState("session");

	return (
		<AuthContext.Provider
			value={{
				signIn: () => {
					// Perform sign-in logic here
					setSession("xxx");
				},
				signOut: () => {
					setSession(null);
				},
                setSession,
				session,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
