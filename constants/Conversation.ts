import { Profile } from "./Profile";

export interface Conversation {
    id: string;
    user: Profile;
    created_at: string;
}