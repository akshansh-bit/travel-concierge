import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from tools import ALL_TOOLS

load_dotenv()

# ── LLM ───────────────────────────────────────────────────────
llm = ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
    max_tokens=4096
)

llm_with_tools = llm.bind_tools(ALL_TOOLS)

# ── System Prompt ──────────────────────────────────────────────
SYSTEM_PROMPT = """You are an expert AI Travel Concierge for Indian travellers.
Use tools smartly:
- rag_tool           → destination info, itineraries, budget, best time
- weather_tool       → current weather at destination
- forex_tool         → live currency exchange rates
- visa_tool          → visa requirements for a country
- booking_links_tool → flight, train, hotel, bus booking links

When to use booking_links_tool:
- User asks about booking flights, trains, hotels or buses
- User asks "how to reach", "how to go", "book tickets"
- At the END of any itinerary response, always add booking links

Always use rag_tool first. Combine tool results into one warm, helpful response.
Give responses in a structured, easy to read format.
Always mention costs in INR.
Always end itinerary responses with booking links.
IMPORTANT: When booking_links_tool returns links, copy them EXACTLY as-is into your response. Do not summarize or paraphrase the links. Include the full markdown link text like [MakeMyTrip](url) directly in your response.
For itineraries, be VERY detailed - include:
- Morning, afternoon and evening activities for each day
- Specific restaurant or dhaba recommendations
- Exact travel times between locations
- Must-see attractions with brief descriptions
- Local tips and cultural notes
- Accommodation recommendations per budget
Format day-wise itineraries using markdown headings:
## Day 1: Title
### Morning
### Afternoon
### Evening"""

# ── Agent ──────────────────────────────────────────────────────
# Stores chat history per session_id
session_histories = {}

def run_agent(query: str, session_id: str = "default") -> str:
    # Get or create history for this session
    if session_id not in session_histories:
        session_histories[session_id] = []

    chat_history = session_histories[session_id]
    chat_history.append(HumanMessage(content=query))

    messages = [SystemMessage(content=SYSTEM_PROMPT)] + chat_history

    # Loop: keep letting the model call tools until it returns a final
    # plain-text answer with no more tool calls. This fixes the bug where
    # a SECOND round of tool calls (e.g. booking_links_tool after
    # rag_tool) was silently dropped, leaving response.content empty.
    response = None
    max_steps = 5
    for _ in range(max_steps):
        response = llm_with_tools.invoke(messages)
        messages.append(response)

        if not response.tool_calls:
            break  # model gave a final text answer, stop looping

        for tool_call in response.tool_calls:
            tool_fn = next(
                (t for t in ALL_TOOLS if t.name == tool_call["name"]), None
            )
            if tool_fn:
                result = tool_fn.invoke(tool_call["args"])
                print(f"  🔧 Used tool: {tool_call['name']}")
                messages.append(ToolMessage(
                    content=str(result),
                    tool_call_id=tool_call["id"]
                ))
            else:
                # Unknown tool name requested — feed back an error so the
                # model doesn't get stuck waiting for a ToolMessage it needs
                messages.append(ToolMessage(
                    content=f"Error: tool '{tool_call['name']}' not found.",
                    tool_call_id=tool_call["id"]
                ))

    final_text = (response.content if response else "") or \
        "Sorry, I couldn't generate a response. Please try again."

    chat_history.append(response)
    return final_text

def clear_session(session_id: str = "default"):
    if session_id in session_histories:
        del session_histories[session_id]