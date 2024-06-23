import { BsMicMute } from "react-icons/bs";
import { BsMic } from "react-icons/bs";
import { Storage } from "@plasmohq/storage"

type SpeechButtonProps = {
    muted: boolean,
    setMuted: (muted: boolean) => void,
}

const SpeechButton = ({muted, setMuted}: SpeechButtonProps) => {
    const storage = new Storage();

    const handleClick = async () => {
        await storage.set("muted", !muted);
        setMuted(!muted);
    }

    return (
        <button 
            className={`
                p-2 ml-3 rounded-full hover:shadow-lg active:shadow-sm
                ${(muted) ? "bg-red-500" : "bg-gray-500"}`} 
            id="speechButton"
            onClick={() => handleClick()}
        >
            {(muted) ? <BsMicMute strokeWidth={0.6} size={13} color="white"/> : <BsMic strokeWidth={0.6} size={13} color="white"/> }
        </button>
    );

}

export default SpeechButton;