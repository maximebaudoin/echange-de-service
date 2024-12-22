import { Profile } from "@/hooks/useSession";
import { PostType } from "./PostType";

export interface Post {
    id: string;
    user_id: string;
    transport_network_id: string;
    text: string;
    type: PostType;
    attachments: string[];
    created_at: string;
    profiles: Partial<Profile>
}