import json
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from langserve import add_routes
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

from operator import itemgetter
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import SequentialChain
from langchain.output_parsers.openai_tools import PydanticToolsParser
from langchain_core.messages.ai import AIMessage
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents import tool
from langchain.utils.openai_functions import convert_pydantic_to_openai_function

general_actions = [
     "click",
     "type",
     "scroll",
     "tabs"
]

class RandomNoise(BaseModel):
    """
    If the prompt seems like it was not meant to be a browser action.

    Examples:
      Prompt: Scroll to the bottom
      Answer: Do not return a response in the form of this schema because this is a browser action.
      Prompt: Focus the last tab
      Answer: Do not return a response in the form of this schema because this is a browser action.
      Prompt: yeah I will know
      Answer: {is_noise: true}
      Prompt: hello what time are you
      Answer: {is_noise: true}
      Prompt: yeah I got it can you login
      Answer: Do not return a response in the form of this schema because this is a browser action.
    """

    is_noise: bool = Field(default=False, description="If the prompt seems like it was not meant to be a browser action")

class NeedsContext(BaseModel):
    """
    The prompt needs extra context from the browser to perform the action.
    The values are mutually exclusive.
    Examples:
      Prompt: Scroll to the bottom
      Answer: Do not return a response in the form of this schema because scroll actions never need additional context.
      Prompt: Focus the last tab
      Answer: Do not return a response in the form of this schema because more context is not needed.
      Prompt: Focus on the youtube tab
      Answer: {needs_clickables_context: false, needs_inputs_context: false, needs_tab_context: true}
      Reasoning: It is not possible to know what tab to focus on without the urls of the tabs.
      Prompt: Click the about us link
      Answer: {needs_clickables_context: true, needs_inputs_context: false, needs_tab_context: false}
      Reasoning: It is not possible to know the what link to click on without the html of the links/buttons.
    """
    needs_clickables_context: bool = Field(default=False, description="If html of the links/buttons are needed")
    needs_inputs_context: bool = Field(default=False, description="If html of the text inputs are needed")
    needs_tab_context: bool = Field(default=False, description="If urls of the tabs in the browser are needed. If only the index of the tab is needed, this is false. For example, if an action is to be performed on the first tab, no context is needed because the index is the only identifying information needed")


class ClickElementAction(BaseModel):
    """
    A click action, with an element to specify which element to click on.
    """
    element_from_context: str = Field(description="The element to click on specified from the prompt. The text must be exactly the same as was given from the context.")


class TypeTextAction(BaseModel):
    """
    A type action, with text to specify what text to type, and the element to type into.
    """

    text: str = Field(description="The text to type into the text field from the prompt")
    element_from_context: str = Field(description="The element to type into specified from the prompt. The text must be exactly the same as was given from the context.")


class BrowserAction(BaseModel):
    """
    An action for an automated browser to take.
    Return the best answer with the information you have available. Do not ask for more information.

    """
    actions: str = Field(description=f"A comma separated list of ordered general browser actions exactly from the following list: {','.join(general_actions)}")
    needs_clickables_context: bool = Field(description="If html of the links/buttons are needed")
    needs_inputs_context: bool = Field(description="If html of the text inputs are needed")
    needs_tab_context: bool = Field(description="If urls of the tabs in the browser are needed. If only the index of the tab is needed, this is false. For example, if an action is to be performed on the first tab, no context is needed because the index is the only identifying information needed")


class ScrollAction(BaseModel):
    """
    A mutually exclusive vertical scroll action, with pixels to scroll for relative scrolling.
    Assume the screen is 800 pixels tall.
    """
    top: bool = Field(description="Scroll to top")
    bottom: bool = Field(description="Scroll to bottom")
    relative: bool = Field(description="Scroll n pixels")
    pixels: int = Field(default=0, description="If relavent, pixels to scroll, else 0")


class TabAction(BaseModel):
    """A mutually exclusive tab action, with a tab index to specify which tab to act on. Once of the three values (close_an_existing_tab, create_new_tab, and focus_an_existing_tab) must be true.

    Examples:
      Prompt: Create a new tab
      Answer: {"close_an_existing_tab": false, "create_new_tab": true, "focus_an_existing_tab": false, "tab_index": -1}
      Prompt: Close the first tab
      Answer: {"close_an_existing_tab": true, "create_new_tab": false, "focus_an_existing_tab": false, "tab_index": 0}
      Prompt: Focus the last tab
      Answer: {"close_an_existing_tab": false, "create_new_tab": false, "focus_an_existing_tab": true, "tab_index": -1}
      Prompt: Focus the second tab
      Answer: {"close_an_existing_tab": false, "create_new_tab": false, "focus_an_existing_tab": true, "tab_index": 1}
      Prompt: Close the second tab
      Answer: {"close_an_existing_tab": true, "create_new_tab": false, "focus_an_existing_tab": true, "tab_index": 1}
    """
    close_an_existing_tab: bool = Field(description="Close a specific tab, with a provided tab_index")
    create_new_tab: bool = Field(description="Create a new tab")
    focus_an_existing_tab: bool = Field(description="Focus a specific tab, with a provided tab_index")
    new_tab_url: str = Field(default="", description="If creating a new tab, the url of the new tab to open if specified. If it is not specified, leave as an empty string")
    tab_index: int = Field(default=-1, description="If relevant, The zero-indexed tab index to perform action on, else -1")


def get_tab_context():
  return "No tab context avaliable"

def get_clickables_context():
  return "No clickables context avaliable"

def get_inputs_context():
  return "No inputs context avaliable"

def provide_context(action: NeedsContext, ctx: str):
    if action.needs_clickables_context:
        return f"Html of the buttons/links from the page: {ctx}. Respond to the following natural language prompt: {prompt}"
    elif action.needs_inputs_context:
        return f"Html of the text inputs from the page: {ctx}. Respond to the following natural language prompt: {prompt}"
    elif action.needs_tab_context:
        return f"Ordered tab url list from the browser: {ctx}. Respond to the following natural language prompt: {prompt}"


model = ChatOpenAI(model="gpt-4")
without_context_tools = [
    convert_pydantic_to_openai_function(TabAction),
    convert_pydantic_to_openai_function(ScrollAction),
    convert_pydantic_to_openai_function(NeedsContext),
    convert_pydantic_to_openai_function(RandomNoise)
]
with_context_tools = [
    convert_pydantic_to_openai_function(TabAction),
    convert_pydantic_to_openai_function(ClickElementAction),
    convert_pydantic_to_openai_function(TypeTextAction)
]

model_with_no_context_tools = model.bind_tools(without_context_tools, tool_choice="any")
model_with_context_tools = model.bind_tools(with_context_tools, tool_choice="any")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You must use one or more of the tools provided to answer the prompt"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

without_context_agent = prompt | model_with_no_context_tools
with_context_agent = prompt | model_with_context_tools

woc_agent = create_tool_calling_agent(model, without_context_tools, prompt)
wc_agent = create_tool_calling_agent(model, with_context_tools, prompt)

def do_no_context_action(input: str):
    response = without_context_agent.invoke({"input": input})
    print(response.tool_calls)
    return response.tool_calls

def do_context_action(input: str, needs_context: NeedsContext, ctx: str):
    print("Agent needs context")
    context_prompt = provide_context(ctx)
    response = with_context_agent.invoke({"input": input})


# do_browser_action("")

# woc_agent_executor = AgentExecutor(agent=without_context_agent, tools=without_context_tools)
# wc_agent_executor = AgentExecutor(agent=without_context_agent, tools=without_context_tools)

class Input(BaseModel):
    input: str


class Output(BaseModel):
    output: Any


app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using LangChain's Runnable interfaces",
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        prompt = json.loads(data)['prompt']
        response = do_no_context_action(prompt)

        await websocket.send_text(json.dumps({response.__dict__}))
        if isinstance(response, NeedsContext):
            print("Agent really needs context fr fr")
            data = await websocket.receive_text()
            context = json.loads(data)['context']
            response = do_context_action(prompt, response, context)
        else:
            websocket.close()




@app.on_event("shutdown")
async def shutdown():
    for websocket in active_connections_set:
        await websocket.close(code=1001)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
