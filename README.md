# Waves AI

#### Introducing Waves AI, the revolutionary browser extension that lets you surf the web using just your voice! Whether you're opening tabs, navigating to sites, or browsing pages, Waves AI makes it effortless. Designed with accessibility in mind, Waves AI is perfect for individuals who find typing and clicking challenging, offering a seamless and empowering experience. It's also ideal for those lazy moments when you want to sit back and control Netflix, YouTube, or read eBooks hands-free. Experience the web like never before with Waves AI—your voice, your control.

![Image of Waves AI working on Netflix](https://github.com/viveknadig282/waves.ai/blob/master/assets/waves-example.png?raw=true)

## Inspiration
The inspiration behind Waves AI is our desire to make the internet accessible to everyone, especially individuals with disabilities. We recognized that traditional web browsing methods can be challenging for those with conditions like arthritis, carpal tunnel syndrome, muscular dystrophy, visual impairments, or those who have suffered strokes. By developing a voice-activated browser extension, we aimed to eliminate these barriers and provide a more inclusive digital experience.

Waves AI is particularly beneficial for people with mobility impairments, such as those with spinal cord injuries or cerebral palsy, offering a hands-free browsing solution that enhances web interaction. It also aids those with temporary disabilities, like a broken arm, ensuring they remain connected without additional strain. Our commitment to accessibility ensures that everyone, regardless of physical capabilities, can enjoy a seamless and independent browsing experience.

For us, the UC Berkeley AI Hackathon was the perfect opportunity to take a bold step and pursue our ambitious vision!

## What it does
- It uses speech recognition and llm agents finetuned with langchain to convert a users requests through voice to many various browser commands
- It can open tabs, close tabs, scroll and open a tab to any webpage with phone only
- It can also open links and find specific html components in a page and select or input text in them based off a users command (ex. signing in, selecting a youtube video, etc.)
- It persists a muted or unmuted state across tabs
- It has a popup and a semi glassmorphic component that embeds itself in every page

## How we built it
- We used Plasmo to create a chrome extension that would use WebSpeechApi to convert speech to text
- We created a post request apis with fastAPI to send transcripts to our llm agents hosted in AWS
- We tuned our llm agents to classify a command as a browser command and then use appropriate tools and the page source html. They used these to customize executable scripts for the browser
- Using puppeteer we would execute these js functions tuned from the llm models to get the desired browser result from the user
![Text Stack Flow Chart](https://github.com/viveknadig282/waves.ai/blob/master/assets/flow-diagram.png?raw=true)

## Challenges we ran into
- We faced challenges initially tuning the models in Intel AI due to limited training data and the private ip
- It was our first time using plasmo and creating an extension so we faced a lot of difficulty in getting Speech Recognition to work


## Accomplishments that we're proud of
- We tried to integrate a lot of the tools at the hackathon!
- We have a lot of things working, many in real-time, and some components are almost functional. 
- We were able to include a large amount of functionality and modern ui before the end of the hackathon, while a little buggy.
- We used plasmo and langchain for the first time and we were able to get them working pretty reliably 

## What's next for Waves AI
- We want to include more functionality by including more possible browser actions to allow users to fully surf the internet effortlessly without hands
- We envision learning more from marginalized groups about the difficulty with browsing the internet with disabilities to help guide our priorities, possibly through focus groups and research. 
- We also want to look into creating our own browser in addition to the extension gain greater control over js functions, variables, and html components in the DOM.
- We would like to expand our speech recognition to other languages to broaden the scope of who Waves AI can impact

## How to run locally
### Browser Control Webserver
- `pnpm i` in the `backend` directory.
- run `npx tsx server.ts`

### Chrome Extension
- `pnpm i` in the `wave` directory
- run `pnpm run dev`
### LangServe
- Create a .env file with your openai api key.
- Run `uvicorn --port 8000 server:app` in the `langchain` directory.
