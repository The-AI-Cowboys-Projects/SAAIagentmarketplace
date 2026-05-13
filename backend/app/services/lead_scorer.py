from __future__ import annotations

"""Lead scoring for SA AI Agent Marketplace.

Scoring is additive across four dimensions:
  - company_size   0-30 pts
  - industry       0-25 pts
  - keywords       0-25 pts
  - completeness   0-20 pts

Priority bands:
  critical  >= 80
  high      >= 60
  medium    >= 40
  low        < 40
"""

from dataclasses import dataclass
from typing import Optional


# ---------------------------------------------------------------------------
# Lookup tables  (SA-specific)
# ---------------------------------------------------------------------------

# Points per company-size band
_COMPANY_SIZE_SCORES: dict[str, int] = {
    "enterprise_500+": 30,
    "mid_market_100_499": 25,
    "smb_20_99": 18,
    "small_5_19": 10,
    "startup_1_4": 5,
    "solo": 2,
}

# Industry attractiveness for SA market
_INDUSTRY_SCORES: dict[str, int] = {
    # Defence / government — SA priority sectors
    "defense": 25,
    "defence": 25,
    "government": 22,
    "federal_government": 22,
    "state_government": 20,
    "local_government": 18,
    # Critical infrastructure
    "energy": 22,
    "utilities": 20,
    "mining": 20,
    "oil_gas": 20,
    # High-value commercial
    "financial_services": 20,
    "banking": 20,
    "insurance": 18,
    "healthcare": 18,
    "pharmaceutical": 18,
    "aerospace": 20,
    "manufacturing": 16,
    # Professional services
    "consulting": 15,
    "legal": 14,
    "accounting": 12,
    "real_estate": 10,
    # Education / research
    "education": 10,
    "research": 12,
    # Retail / hospitality / other
    "retail": 8,
    "hospitality": 6,
    "nonprofit": 5,
}

# High-value keyword signals (case-insensitive substring match)
_KEYWORD_SIGNALS: dict[str, int] = {
    # Budget / procurement intent
    "budget": 8,
    "procurement": 8,
    "rfp": 10,
    "rfq": 10,
    "contract": 7,
    "pilot": 7,
    # Urgency signals
    "urgent": 9,
    "immediate": 9,
    "asap": 9,
    "this quarter": 8,
    "q1": 6,
    "q2": 6,
    "q3": 6,
    "q4": 6,
    # AI / automation intent
    "automate": 7,
    "automation": 7,
    "ai agent": 8,
    "llm": 7,
    "workflow": 6,
    "integration": 5,
    # Decision-maker signals
    "cto": 8,
    "cio": 8,
    "ceo": 8,
    "director": 7,
    "head of": 7,
    "vp ": 7,
    "chief": 7,
    # SA-specific
    "san antonio": 5,
    "texas": 4,
    "dod": 9,
    "army": 8,
    "navy": 8,
    "air force": 8,
    "jbsa": 9,
    "fort sam": 8,
    "lackland": 8,
    "randolph": 8,
    "cybercmd": 10,
    "cybercom": 10,
    "cleared": 9,
    "clearance": 9,
}

# Maximum keyword score cap
_KEYWORD_MAX = 25


# ---------------------------------------------------------------------------
# Dataclass / result
# ---------------------------------------------------------------------------


@dataclass
class ScoreResult:
    score: int
    priority: str
    breakdown: dict[str, int]


# ---------------------------------------------------------------------------
# Scorer
# ---------------------------------------------------------------------------


class LeadScorer:
    """Score an incoming lead and return a :class:`ScoreResult`."""

    def score(
        self,
        *,
        company_size: Optional[str] = None,
        industry: Optional[str] = None,
        use_case: Optional[str] = None,
        search_keywords: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        organization: Optional[str] = None,
    ) -> ScoreResult:
        breakdown: dict[str, int] = {}

        # 1. Company size (0-30)
        size_score = self._score_company_size(company_size)
        breakdown["company_size"] = size_score

        # 2. Industry (0-25)
        industry_score = self._score_industry(industry)
        breakdown["industry"] = industry_score

        # 3. Keywords from use_case + search_keywords (0-25)
        combined_text = " ".join(
            filter(None, [use_case or "", search_keywords or ""])
        ).lower()
        keyword_score = self._score_keywords(combined_text)
        breakdown["keywords"] = keyword_score

        # 4. Completeness (0-20)
        completeness_score = self._score_completeness(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            organization=organization,
            company_size=company_size,
            industry=industry,
            use_case=use_case,
        )
        breakdown["completeness"] = completeness_score

        total = size_score + industry_score + keyword_score + completeness_score
        total = min(total, 100)  # hard cap at 100

        priority = self._priority_band(total)

        return ScoreResult(score=total, priority=priority, breakdown=breakdown)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _score_company_size(self, company_size: Optional[str]) -> int:
        if not company_size:
            return 0
        normalised = company_size.lower().strip().replace(" ", "_").replace("-", "_")
        # Try exact match first
        if normalised in _COMPANY_SIZE_SCORES:
            return _COMPANY_SIZE_SCORES[normalised]
        # Partial match
        for key, pts in _COMPANY_SIZE_SCORES.items():
            if key in normalised or normalised in key:
                return pts
        return 0

    def _score_industry(self, industry: Optional[str]) -> int:
        if not industry:
            return 0
        normalised = industry.lower().strip().replace(" ", "_").replace("-", "_")
        if normalised in _INDUSTRY_SCORES:
            return _INDUSTRY_SCORES[normalised]
        # Partial match — pick highest
        best = 0
        for key, pts in _INDUSTRY_SCORES.items():
            if key in normalised or normalised in key:
                best = max(best, pts)
        return best

    def _score_keywords(self, text: str) -> int:
        if not text:
            return 0
        accumulated = 0
        for keyword, pts in _KEYWORD_SIGNALS.items():
            if keyword in text:
                accumulated += pts
        return min(accumulated, _KEYWORD_MAX)

    def _score_completeness(
        self,
        *,
        first_name: Optional[str],
        last_name: Optional[str],
        email: Optional[str],
        phone: Optional[str],
        organization: Optional[str],
        company_size: Optional[str],
        industry: Optional[str],
        use_case: Optional[str],
    ) -> int:
        """Award points for each non-empty field up to a max of 20."""
        fields = [
            first_name,
            last_name,
            email,
            phone,
            organization,
            company_size,
            industry,
            use_case,
        ]
        filled = sum(1 for f in fields if f and str(f).strip())
        total_fields = len(fields)
        # Linear interpolation: all 8 fields = 20 pts
        return round((filled / total_fields) * 20)

    @staticmethod
    def _priority_band(score: int) -> str:
        if score >= 80:
            return "critical"
        if score >= 60:
            return "high"
        if score >= 40:
            return "medium"
        return "low"
