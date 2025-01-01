import { Post } from "@/constants/Post";
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

const PostContext = createContext({
	posts: [] as Post[],
	setPosts: {} as Dispatch<SetStateAction<Post[]>>,
});

const PostProvider = ({
    children,
    value = [] as Post[]
}: {
    children: React.ReactNode;
    value?: Post[]
}) => {
	const [posts, setPosts] = useState(value);

	return <PostContext.Provider value={{ posts, setPosts }}>
        {children}
    </PostContext.Provider>;
};

const usePosts = () => {
	const context = useContext(PostContext);

	if (!context) {
		throw new Error("usePosts must be used within a PostContext");
	}

	return context;
};

export { PostProvider, usePosts };
