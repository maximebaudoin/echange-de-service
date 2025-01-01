import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/constants/Profile";
import { TransportNetwork } from "@/constants/TransportNetwork";

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
