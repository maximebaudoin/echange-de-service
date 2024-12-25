import { useEffect, useState } from "react";
import InterestedByPostModal from "./modals/InterestedByPostModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <InterestedByPostModal />
        </>
    );
}
 
export default ModalProvider;