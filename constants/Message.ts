export interface Message {
    id: string;
    text: string;
    user_id: string;
    conversation_id: string;
    created_at: string;
    is_seen: boolean;
}