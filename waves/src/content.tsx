import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import App from "~features/app"


export const config: PlasmoCSConfig = {}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    console.log('Transcript:', transcript);
};

recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Error occurred in recognition:', event.error);
};

recognition.onend = () => {
    console.log("recognition ended");
    setTimeout(() => {
        recognition.start();
        console.log("recognition starting");
    }, 100);
};

recognition.start();

const PlasmoOverlay = () => {
  return (
    <div className="z-50 flex fixed top-20 right-8">
      <App />
    </div>
  )
}

export default PlasmoOverlay
