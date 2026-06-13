import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from tools import ALL_TOOLS

load_dotenv()

# ── LLM ───────────────────────────────────────────────────────
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
    max_tokens=4096
)

llm_with_tools = llm.bind_tools(ALL_TOOLS)

# ── System Prompt ──────────────────────────────────────────────
SYSTEM_PROMPT = SYSTEM_PROMPT = """You are an expert AI Travel Concierge for Indian travellers.
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
IMPORTANT: When booking_links_tool returns links, copy them EXACTLY as-is into your response. Do not summarize or paraphrase the links. Include the full markdown link text like [MakeMyTrip](url) directly in your response."""

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

    # Step 1 — LLM decides which tools to call
    response = llm_with_tools.invoke(messages)

    # Step 2 — Run all requested tools
    if response.tool_calls:
        messages.append(response)
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

        # Step 3 — Final answer using tool results
        final = llm_with_tools.invoke(messages)
        chat_history.append(final)

        # Inject booking links directly if present
        booking_result = ""
        for tool_call in response.tool_calls:
            if tool_call["name"] == "booking_links_tool":
                tool_fn = next(
                    (t for t in ALL_TOOLS if t.name == "booking_links_tool"), None
                )
                if tool_fn:
                    booking_result = tool_fn.invoke(tool_call["args"])
                    break
        
        if booking_result:
            return final.content + "\n\n---\n" + booking_result
        return final.content

    chat_history.append(response)
    return response.content

def clear_session(session_id: str = "default"):
    if session_id in session_histories:
        del session_histories[session_id]