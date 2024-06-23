import { useState } from "react";
import SpeechButton from "./speech-button"
import { Storage } from "@plasmohq/storage";

const App = () => {
  const [muted, setMuted] = useState<boolean>(false);
  const storage = new Storage();

  const getMuted = async () => {
    const muted: boolean = await storage.get("muted");
    if (muted) {
      setMuted(muted);
    }
  }
  
  getMuted();

  return (
    <div className="p-3 w-40 rounded-lg border-none shadow-lg hover:shadow-md backdrop-blur-md text-black">
      <h1 className="text-xl font-semibold mt-1">
        Waves.ai
        <SpeechButton muted={muted} setMuted={setMuted}/>
      </h1> 
      <h2 className="text-base inline whitespace-nowrap font-medium">
        is {" "} 
        <span className={(muted) && "text-red-500"}>
          {(muted) ? "muted." : "listening..."}
        </span>
      </h2>
    </div>
  )
}

export default App