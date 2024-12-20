import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { Session } from "@supabase/supabase-js";

export type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    completed: boolean;
    image_url?: string;
};

export type TransportNetwork = {
    id: string;
    name: string;
    image_name: string;
    matricule: string;
};

const AuthContext = createContext<{
	signIn: () => void;
	signOut: () => void;
	session?: Session | null;
    setSession: (value: Session | null) => void;
    profile: Profile | null;
    setProfile: (value: Profile) => void;
    selectedTransportNetwork: TransportNetwork | null;
    setSelectedTransportNetwork: (value: TransportNetwork) => void;
}>({
	signIn: () => {},
	signOut: () => {},
	session: null,
    setSession: () => {},
    profile: null,
    setProfile: () => {},
    selectedTransportNetwork: null,
    setSelectedTransportNetwork: () => {}
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useStorageState<Session>("session");
	const [profile, setProfile] = useStorageState<Profile>("profile");
	const [selectedTransportNetwork, setSelectedTransportNetwork] = useStorageState<TransportNetwork>("selectedTransportNetwork");

	return (
		<AuthContext.Provider
			value={{
				signIn: () => {},
				signOut: () => {
					setSession(null);
                    setProfile(null);
                    setSelectedTransportNetwork(null);
				},
				session,
                setSession,
                profile,
                setProfile,
                selectedTransportNetwork,
                setSelectedTransportNetwork
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
