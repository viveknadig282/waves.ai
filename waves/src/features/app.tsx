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
    <div className="p-3 w-40 rounded-sm border-none shadow-lg hover:shadow-md bg-white text-black">
      <h1 className="text-xl font-semibold">
        Waves.ai
        <SpeechButton muted={muted} setMuted={setMuted}/>
      </h1> 
      <h2 className="text-sm inline whitespace-nowrap">
        is {(muted) ? "muted." : "listening..."}
      </h2>
    </div>
  )
}

export default App