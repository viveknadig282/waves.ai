import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import App from "~features/app"
import { Storage } from "@plasmohq/storage"
import { getPort } from "@plasmohq/messaging/port"
import type { PortName } from "@plasmohq/messaging"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const storage = new Storage();
const cloudPort = getPort("cloud" as PortName);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const run = async () => {
  if (!document.hidden) {
    const muted: boolean = await storage.get("muted");
    if (!muted) recognition.start();
  }
}
run()

recognition.onresult = (event: SpeechRecognitionEvent) => {
  const transcript: string = event.results[0][0].transcript;
  cloudPort.postMessage({
    body: {
      transcript: transcript
    }
  })
  console.log('transcript: ', transcript);
};

recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
  console.error('Error occurred in recognition:', event.error);
};

recognition.onend = async () => {
  const muted: boolean = await storage.get("muted");
  if (muted === true) {
    return;
  }
  setTimeout(() => {
    if (!document.hidden) {
      recognition.start();
    }
  }, 300)
};

storage.watch({
  "muted": (c) => {
    if (c.newValue == true) {
      recognition.stop();
    } else {
      recognition.start();
    }
    console.log(c.newValue);
  }
})

const PlasmoOverlay = () => {
  return (
    <div className="z-50 flex fixed top-20 right-8">
      <App />
    </div>
  )
}

export default PlasmoOverlay
