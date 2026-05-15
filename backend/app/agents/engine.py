"""
LangGraph-based Agent Engine with Supervisor Router pattern.

Provides mock LLM responses for demo mode (no API key required).
When OPENAI_API_KEY is set, uses real LLM for agent responses.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)

from .agent_catalog import AGENT_CATALOG

# Tools are optional — they require langchain which may not be installed
try:
    from .tools import ALL_TOOLS, TOOLS_BY_CATEGORY
except ImportError:
    ALL_TOOLS = {}
    TOOLS_BY_CATEGORY = {}


class MockLLM:
    """Mock LLM that returns contextual responses without an API key."""

    def invoke(self, prompt: str, agent_config: dict) -> str:
        name = agent_config.get("name", "Agent")
        category = agent_config.get("category", "general")
        return (
            f"[{name}] I've analyzed your request using San Antonio local data. "
            f"As a specialized {category} agent, here's what I found:\n\n"
            f"Based on the information provided, I recommend the following actions:\n"
            f"1. Review the relevant San Antonio municipal resources\n"
            f"2. Contact the appropriate local department for verification\n"
            f"3. Follow up within 5-7 business days for status updates\n\n"
            f"This response is generated in demo mode. Connect an LLM API key "
            f"for full autonomous agent capabilities."
        )


class IntentClassifier:
    """Classify user intent and route to the appropriate agent."""

    CATEGORY_KEYWORDS = {
        "civic": ["311", "pothole", "trash", "waste", "brush", "recycling", "code violation",
                  "property", "animal", "cat", "dog", "court", "citation", "ticket",
                  "pre-k", "prek", "transit", "bus", "via", "energy", "cps", "council",
                  "policy", "saspeakup",
                  # Connect-360 / SmartSA keywords
                  "moving", "relocat", "newcomer", "new resident", "new to san antonio",
                  "water", "saws", "utility", "utilities", "register", "signup",
                  "school", "enrollment", "isd", "k-12", "kindergarten",
                  "neighborhood", "housing", "apartment", "rent", "buy home",
                  "section 8", "affordable housing", "opportunity home",
                  "aquifer", "drought", "water restriction", "conservation",
                  "flood", "creek", "river authority", "floodplain",
                  "vote", "voter", "election", "polling", "ballot"],
        "business": ["business", "permit", "grant", "sbeda", "procurement", "rfp", "tax",
                     "vita", "food truck", "vending", "historic", "preservation", "real estate",
                     "commercial", "b2b", "lead", "disaster", "social commerce", "instagram",
                     "property tax", "homestead", "exemption", "appraisal", "bcad"],
        "military": ["military", "veteran", "va ", "jbsa", "army", "navy", "air force",
                     "marines", "tricare", "gi bill", "hazelwood", "skillbridge", "clearance",
                     "ncoer", "fitrep", "resume", "mos", "mic3", "spouse", "pcs"],
        "healthcare": ["clinical", "medical", "doctor", "nurse", "hospital", "patient",
                       "insurance", "referral", "icd", "cpt", "coding", "hipaa", "phi",
                       "diabetes", "telehealth", "triage", "bed", "icu", "trial", "soap"],
        "tourism": ["hotel", "tourism", "tourist", "river walk", "riverwalk", "fiesta",
                    "convention", "flight", "restaurant", "dining", "mission", "alamo",
                    "concierge", "housekeeping", "vip", "pricing", "gastronomy"],
    }

    def classify(self, query: str) -> str:
        query_lower = query.lower()
        scores = {}
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            scores[category] = sum(1 for kw in keywords if kw in query_lower)
        if max(scores.values()) == 0:
            return "civic"
        return max(scores, key=scores.get)

    def find_best_agent(self, query: str) -> Optional[dict]:
        category = self.classify(query)
        category_agents = [a for a in AGENT_CATALOG if a["category"] == category]
        if not category_agents:
            return AGENT_CATALOG[0]

        query_lower = query.lower()
        best_agent = None
        best_score = -1
        for agent in category_agents:
            desc_lower = agent["description"].lower()
            name_lower = agent["name"].lower()
            score = sum(1 for word in query_lower.split() if word in desc_lower or word in name_lower)
            if score > best_score:
                best_score = score
                best_agent = agent
        return best_agent or category_agents[0]


class AgentEngine:
    """Main agent execution engine using LangGraph supervisor pattern."""

    def __init__(self, api_key: Optional[str] = None):
        self.classifier = IntentClassifier()
        self.llm = MockLLM()
        self._api_key = api_key

    def get_agent_config(self, slug: str) -> Optional[dict]:
        for agent in AGENT_CATALOG:
            if agent["slug"] == slug:
                return agent
        return None

    def get_tools_for_agent(self, agent_config: dict) -> list:
        tool_names = agent_config.get("tools_config", [])
        return [ALL_TOOLS[name] for name in tool_names if name in ALL_TOOLS]

    def run_agent(self, slug: str, user_message: str) -> dict:
        agent_config = self.get_agent_config(slug)
        if not agent_config:
            return {"error": f"Agent '{slug}' not found", "response": None}

        tools = self.get_tools_for_agent(agent_config)

        tool_results = []
        if tools:
            primary_tool = tools[0]
            try:
                # Use inspect to check for 'query' param instead of deprecated .schema()
                import inspect
                tool_params = inspect.signature(primary_tool.func).parameters
                if "query" in tool_params:
                    result = primary_tool.invoke({"query": user_message})
                else:
                    result = primary_tool.invoke(user_message)
                tool_results.append({"tool": primary_tool.name, "result": result})
            except Exception as exc:
                logger.warning(
                    "Tool %r failed for agent %r: %s",
                    primary_tool.name,
                    slug,
                    exc,
                )
                tool_results.append({
                    "tool": primary_tool.name,
                    "error": str(exc),
                    "result": None,
                })

        response = self.llm.invoke(user_message, agent_config)

        return {
            "agent": agent_config["name"],
            "category": agent_config["category"],
            "response": response,
            "tool_results": tool_results,
            "slug": slug,
        }

    def route_query(self, user_message: str) -> dict:
        best_agent = self.classifier.find_best_agent(user_message)
        if not best_agent:
            return {"error": "No matching agent found", "response": None}
        return self.run_agent(best_agent["slug"], user_message)

    def list_agents_by_category(self, category: str) -> list[dict]:
        return [a for a in AGENT_CATALOG if a["category"] == category]


# Singleton for app-wide use
engine = AgentEngine()
