import { supabase } from "@/utils/supabase";
import { useState } from "react";

export function useImageUrl(
    bucketName: "profiles" | "transport_network",
    name: string | undefined,
    width?: number,
    height?: number,
    resize?: "fill" | "cover" | "contain"
) {
    const [url, setUrl] = useState<string | null>(null);

    if(!name) {
        return url;
    }

    const getImageUrl = async () => {
        const { data } = await supabase.storage.from(bucketName).createSignedUrl(name, 60, {
            transform: {
                width: width ?? undefined,
                height: height ?? undefined,
                resize: resize ?? undefined
            },
        });

        if(data) {
            setUrl(data.signedUrl);
        }
    }

    getImageUrl();

    return url;
}
