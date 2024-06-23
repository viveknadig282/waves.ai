import { useState } from "react";
import SpeechButton from "./speech-button"

const App = () => {
  const [muted, setMuted] = useState<boolean>(false);

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