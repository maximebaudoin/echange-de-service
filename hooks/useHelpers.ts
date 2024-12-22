import { supabase } from "@/utils/supabase";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const useHelpers = () => {
    const formatRelativeDate = (dateTime: string): string => {
        const date = new Date(dateTime);
        return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    }

    const getStorageUrl = async (
        bucketName: "profiles" | "transport_network" | "posts",
        name: string,
        width?: number,
        height?: number,
        resize?: "fill" | "cover" | "contain"
    ) => {
        const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(name, 60, {
            transform: {
                width: width ?? undefined,
                height: height ?? undefined,
                resize: resize ?? undefined
            },
        });        

        if(error || !data) {
            return false;
        }

        return data.signedUrl;
    }

    return { formatRelativeDate, getStorageUrl };
}
 
export default useHelpers;