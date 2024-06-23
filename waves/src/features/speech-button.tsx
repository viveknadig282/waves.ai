import { BsMicMute } from "react-icons/bs";
import { BsMic } from "react-icons/bs";

type SpeechButtonProps = {
    muted: boolean,
    setMuted: (muted: boolean) => void,

}

const SpeechButton = ({muted, setMuted}: SpeechButtonProps) => {
    
    const handleClick = () => {
        setMuted(!muted);
    }

    return (
        <button 
            className={`
                p-1 ml-2 rounded-full bg-blue-500 
                ${(muted) ? "bg-red-500" : "bg-gray-500"}`} 
            onClick={handleClick}
        >
            {(muted) ? <BsMicMute color="white"/> : <BsMic color="white"/> }
        </button>
    );

}

export default SpeechButton;