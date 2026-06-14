import os
import requests
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_community.retrievers import BM25Retriever
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

load_dotenv()
OWM_API_KEY = os.getenv("OWM_API_KEY")

# ── Load Vector Store ──────────────────────────────────────────
embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.getenv("HF_TOKEN"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma(
    embedding_function=embeddings,
    persist_directory="db_v2_final_final",
    collection_name="travel_docs_v2_final"
)

all_docs = vector_store.get()
from langchain_core.documents import Document
docs_for_bm25 = [
    Document(page_content=text)
    for text in all_docs["documents"]
]

vector_retriever = vector_store.as_retriever(search_kwargs={"k": 6})
bm25_retriever   = BM25Retriever.from_documents(docs_for_bm25)
bm25_retriever.k = 6

# ── Hybrid Retriever ───────────────────────────────────────────
class HybridRetriever:
    def __init__(self, vector_ret, bm25_ret, k=6):
        self.vector_ret = vector_ret
        self.bm25_ret   = bm25_ret
        self.k          = k

    def invoke(self, query: str):
        vec_docs  = self.vector_ret.invoke(query)
        bm25_docs = self.bm25_ret.invoke(query)
        seen, merged = set(), []
        for doc in vec_docs + bm25_docs:
            key = doc.page_content[:100]
            if key not in seen:
                seen.add(key)
                merged.append(doc)
        return merged[:self.k]

retriever = HybridRetriever(vector_retriever, bm25_retriever, k=6)

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

# ── Tools ──────────────────────────────────────────────────────
@tool
def rag_tool(query: str) -> str:
    """Search travel knowledge base for destination info,
    itineraries, visa requirements, and budget."""
    docs = retriever.invoke(query)
    return format_docs(docs)

@tool
def weather_tool(city: str) -> str:
    """Get current live weather for a city."""
    try:
        resp = requests.get(
            "http://api.openweathermap.org/data/2.5/weather",
            params={"q": city, "appid": OWM_API_KEY, "units": "metric"},
            timeout=10
        )
        data = resp.json()
        if resp.status_code != 200:
            return f"Weather data unavailable for {city}."
        temp        = data["main"]["temp"]
        feels_like  = data["main"]["feels_like"]
        humidity    = data["main"]["humidity"]
        description = data["weather"][0]["description"].capitalize()
        wind        = data["wind"]["speed"]
        return (
            f"Current weather in {city}:\n"
            f"  Condition   : {description}\n"
            f"  Temperature : {temp}°C (feels like {feels_like}°C)\n"
            f"  Humidity    : {humidity}%\n"
            f"  Wind Speed  : {wind} m/s\n"
        )
    except Exception as e:
        return f"Could not fetch weather: {e}"

@tool
def forex_tool(query: str) -> str:
    """Get current INR exchange rates for travel budgeting."""
    try:
        resp  = requests.get(
            "https://api.exchangerate-api.com/v4/latest/INR",
            timeout=10
        )
        rates = resp.json()["rates"]
        return (
            f"Current exchange rates from INR:\n"
            f"  1 INR = {rates.get('USD','N/A'):.4f} USD\n"
            f"  1 INR = {rates.get('EUR','N/A'):.4f} EUR\n"
            f"  1 INR = {rates.get('GBP','N/A'):.4f} GBP\n"
            f"  1 INR = {rates.get('JPY','N/A'):.4f} JPY\n"
            f"  1 INR = {rates.get('AUD','N/A'):.4f} AUD\n"
            f"  1 INR = {rates.get('SGD','N/A'):.4f} SGD\n"
            f"  1 INR = {rates.get('THB','N/A'):.4f} THB\n"
        )
    except Exception as e:
        return f"Could not fetch forex: {e}"

@tool
def visa_tool(country: str) -> str:
    """Get visa requirements for Indian passport holders."""
    docs = retriever.invoke(f"visa requirements {country} Indian passport")
    return format_docs(docs)

@tool
def booking_links_tool(query: str) -> str:
    """Generate booking links for flights, trains, hotels and buses
    based on user's travel query. Use when user asks about booking,
    tickets, or travel options."""
    
    # Parse origin and destination from query
    query_lower = query.lower()
    
    # Common Indian city codes for Skyscanner
    city_codes = {
        "mumbai": "BOM", "delhi": "DEL", "bangalore": "BLR",
        "bengaluru": "BLR", "chennai": "MAA", "kolkata": "CCU",
        "hyderabad": "HYD", "pune": "PNQ", "ahmedabad": "AMD",
        "goa": "GOI", "jaipur": "JAI", "kochi": "COK",
        "bali": "DPS", "paris": "PAR", "tokyo": "TYO",
        "dubai": "DXB", "singapore": "SIN", "london": "LON",
        "new york": "NYC", "bangkok": "BKK", "maldives": "MLE",
        "rome": "ROM", "sydney": "SYD", "kuala lumpur": "KUL",
    }

    # Detect origin city
    origin_code = "DEL"  # default Delhi
    origin_name = "Delhi"
    for city, code in city_codes.items():
        if f"from {city}" in query_lower or f"{city} to" in query_lower:
            origin_code = code
            origin_name = city.title()
            break

    # Detect destination city
    dest_code = None
    dest_name = None
    for city, code in city_codes.items():
        if f"to {city}" in query_lower or f"visit {city}" in query_lower or city in query_lower:
            if code != origin_code:
                dest_code = code
                dest_name = city.title()
                break

    # Build links
    links = []

    # ── Flight Links ──
    if dest_code:
        links.append(f"""
✈️ **Flight Booking:**
- [MakeMyTrip Flights](https://www.makemytrip.com/flights/domestic/results/{origin_code}-to-{dest_code}/)
- [Skyscanner](https://www.skyscanner.co.in/flights/{origin_code.lower()}/{dest_code.lower()}/)
- [Google Flights](https://www.google.com/flights?q=flights+from+{origin_name}+to+{dest_name})
- [EaseMyTrip](https://www.easemytrip.com/flights/result/{origin_code}-to-{dest_code}/)""")
    else:
        links.append(f"""
✈️ **Flight Search:**
- [MakeMyTrip Flights](https://www.makemytrip.com/flights/)
- [Skyscanner India](https://www.skyscanner.co.in/)
- [Google Flights](https://www.google.com/flights)
- [EaseMyTrip](https://www.easemytrip.com/)""")

    # ── Train Links ──
    if any(word in query_lower for word in ["train", "rail", "irctc", "railway"]):
        links.append(f"""
🚂 **Train Booking:**
- [IRCTC](https://www.irctc.co.in/nget/train-search)
- [ixigo Trains](https://www.ixigo.com/trains)
- [Confirmtkt](https://www.confirmtkt.com/)""")

    # ── Hotel Links ──
    if dest_name and any(word in query_lower for word in ["hotel", "stay", "accommodation", "hostel", "resort"]):
        links.append(f"""
🏨 **Hotel Booking:**
- [MakeMyTrip Hotels](https://www.makemytrip.com/hotels/{dest_name.lower()}-hotels/)
- [Booking.com](https://www.booking.com/search.html?ss={dest_name})
- [Airbnb](https://www.airbnb.co.in/s/{dest_name}/homes)
- [Agoda](https://www.agoda.com/search?city={dest_name})""")

    # ── Bus Links ──
    if any(word in query_lower for word in ["bus", "redbus", "road trip"]):
        links.append(f"""
🚌 **Bus Booking:**
- [redBus](https://www.redbus.in/)
- [AbhiBus](https://www.abhibus.com/)
- [ixigo Bus](https://www.ixigo.com/bus)""")

    # Default — show all if nothing specific detected
    if not links:
        links.append(f"""
🔗 **Quick Booking Links:**

✈️ Flights:
- [MakeMyTrip](https://www.makemytrip.com/flights/)
- [Skyscanner India](https://www.skyscanner.co.in/)
- [Google Flights](https://www.google.com/flights)

🚂 Trains:
- [IRCTC](https://www.irctc.co.in/nget/train-search)
- [ixigo](https://www.ixigo.com/trains)

🏨 Hotels:
- [MakeMyTrip Hotels](https://www.makemytrip.com/hotels/)
- [Booking.com](https://www.booking.com/)

🚌 Buses:
- [redBus](https://www.redbus.in/)""")

    return "\n".join(links)

ALL_TOOLS = [rag_tool, weather_tool, forex_tool, visa_tool, booking_links_tool]