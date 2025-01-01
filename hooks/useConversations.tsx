import { Conversation } from "@/constants/Conversation";
import { Post } from "@/constants/Post";
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

interface ConversationContextType {
    conversations: Conversation[];
    setConversations: Dispatch<SetStateAction<Conversation[]>>;
}

const ConversationContext = createContext<ConversationContextType>({
	conversations: [],
	setConversations: () => {},
});

const ConversationProvider = ({
    children,
    value = [] as Conversation[]
}: {
    children: React.ReactNode;
    value?: Conversation[]
}) => {
	const [conversations, setConversations] = useState(value);

	return <ConversationContext.Provider value={{ conversations, setConversations }}>
        {children}
    </ConversationContext.Provider>;
};

const useConversations = () => {
	const context = useContext(ConversationContext);

	if (!context) {
		throw new Error("useConversations must be used within a ConversationContext");
	}

	return context;
};

export { ConversationProvider, useConversations };
