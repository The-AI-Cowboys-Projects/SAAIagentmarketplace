"""
ETL Pipeline for San Antonio AI Agent Marketplace.

Provides base ETL classes and specialized pipelines for ingesting
municipal, commercial, and public data sources into vector stores
for RAG-powered agent responses.
"""

import hashlib
from abc import abstractmethod
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class Document:
    """A document chunk ready for embedding and storage."""
    content: str
    metadata: dict = field(default_factory=dict)
    doc_id: str = ""

    def __post_init__(self):
        if not self.doc_id:
            self.doc_id = hashlib.sha256(self.content[:200].encode()).hexdigest()[:32]


class BaseETLPipeline:
    """Base class for all ETL pipelines."""

    def __init__(self, source_name: str):
        self.source_name = source_name
        self.documents: list[Document] = []
        self.last_run: Optional[datetime] = None

    @abstractmethod
    def extract(self) -> list[dict]:
        """Extract raw data from the source. Subclasses must implement this."""
        ...

    def transform(self, raw_data: list[dict]) -> list[Document]:
        documents = []
        for item in raw_data:
            content = item.get("content", str(item))
            metadata = {
                "source": self.source_name,
                "extracted_at": datetime.now(timezone.utc).isoformat(),
                "category": item.get("category", "general"),
            }
            metadata.update({k: v for k, v in item.items() if k != "content"})
            documents.append(Document(content=content, metadata=metadata))
        return documents

    def load(self, documents: list[Document], vector_store=None) -> int:
        self.documents.extend(documents)
        self.last_run = datetime.now(timezone.utc)
        if vector_store:
            vector_store.add_documents(documents)
        return len(documents)

    def run(self, vector_store=None) -> int:
        raw_data = self.extract()
        documents = self.transform(raw_data)
        return self.load(documents, vector_store)


class SAOpenDataPipeline(BaseETLPipeline):
    """ETL pipeline for San Antonio Open Data Portal."""

    def __init__(self):
        super().__init__("sa_open_data_portal")

    def extract(self) -> list[dict]:
        return [
            {"content": "311 Service Request: Pothole reported at 1200 Broadway, District 1. "
                       "Status: Under Review. Priority: Medium. Reported: 2026-05-01.",
             "category": "311", "district": 1, "type": "pothole"},
            {"content": "311 Service Request: Downed tree blocking sidewalk at 500 McCullough Ave. "
                       "Status: Dispatched. Priority: High. Reported: 2026-05-02.",
             "category": "311", "district": 2, "type": "downed_tree"},
            {"content": "Animal Care Services: Stray dog reported in 78207 ZIP. Colony of 5+ cats "
                       "documented near Mission Road. TNR coordinator notified.",
             "category": "acs", "zip": "78207", "type": "stray_report"},
            {"content": "Solid Waste: Free Landfill Day scheduled for June 15, 2026 at "
                       "Nelson Gardens Transfer Station. Accepts household items, no hazmat.",
             "category": "solid_waste", "type": "event"},
            {"content": "CPS Energy: Average residential rate $0.1124/kWh. Time-of-Use plan "
                       "available with off-peak rates starting at $0.0892/kWh.",
             "category": "utilities", "type": "rate_info"},
            {"content": "SAPD Community Crime Map: District 5 reports 12% decrease in property "
                       "crime Q1 2026. Burglary down 18%. Auto theft up 3%.",
             "category": "public_safety", "district": 5},
            {"content": "City Council Agenda Item: Resolution 2026-0089 - Allocate $4.2M for "
                       "District 3 sidewalk improvements. Public comment period open.",
             "category": "council", "district": 3},
            {"content": "VIA Metropolitan Transit: Route 88 schedule change effective June 1. "
                       "New express service to Medical Center from Stone Oak.",
             "category": "transit", "type": "schedule_change"},
            {"content": "Bexar County Property Records: 15,234 new commercial permits issued "
                       "Q1 2026. Median commercial property value: $450K.",
             "category": "property", "type": "market_data"},
            {"content": "San Antonio Municipal Court: Online payment portal now accepts Apple Pay. "
                       "Defensive Driving eligible for first-time traffic offenses under 25mph over.",
             "category": "court", "type": "service_update"},
        ]


class MunicipalDocPipeline(BaseETLPipeline):
    """ETL pipeline for municipal PDF documents and ordinances."""

    def __init__(self):
        super().__init__("municipal_documents")

    def extract(self) -> list[dict]:
        return [
            {"content": "San Antonio Property Maintenance Code Section 302.1: Exterior structure. "
                       "The exterior of a structure shall be maintained in good repair, structurally "
                       "sound and sanitary so as not to pose a threat to the public health, safety "
                       "or welfare.",
             "category": "property_code", "section": "302.1"},
            {"content": "San Antonio Unified Development Code: C-2 Commercial District permits "
                       "retail, office, restaurant, and personal service uses. Maximum building "
                       "height: 45 feet. Minimum lot size: 5,000 sq ft.",
             "category": "zoning", "district": "C-2"},
            {"content": "Pre-K 4 SA Eligibility: Child must be 4 years old by September 1. "
                       "Priority given to families at or below 200% FPL. All San Antonio "
                       "residents eligible regardless of income.",
             "category": "education", "program": "prek4sa"},
            {"content": "MIC3 Interstate Compact Article V: A transitioning military child "
                       "shall be enrolled immediately upon presentation of military orders, "
                       "regardless of documentation availability.",
             "category": "military_education", "article": "V"},
            {"content": "Metro Health District Food Establishment Regulations: All mobile food "
                       "vendors must maintain food temperatures above 135F for hot items and "
                       "below 41F for cold items. Annual inspection required.",
             "category": "health_regs", "type": "food_vendor"},
        ]


class VectorStoreManager:
    """Manages vector store collections for RAG capabilities."""

    def __init__(self):
        self.collections: dict[str, list[Document]] = {}

    def create_collection(self, name: str) -> None:
        if name not in self.collections:
            self.collections[name] = []

    def add_documents(self, documents: list[Document], collection: str = "default") -> int:
        self.create_collection(collection)
        self.collections[collection].extend(documents)
        return len(documents)

    def search(self, query: str, collection: str = "default", top_k: int = 5) -> list[Document]:
        if collection not in self.collections:
            return []
        query_terms = set(query.lower().split())
        scored = []
        for doc in self.collections[collection]:
            doc_terms = set(doc.content.lower().split())
            overlap = len(query_terms & doc_terms)
            if overlap > 0:
                scored.append((overlap, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored[:top_k]]

    def get_stats(self) -> dict:
        return {
            "collections": list(self.collections.keys()),
            "total_documents": sum(len(docs) for docs in self.collections.values()),
            "per_collection": {name: len(docs) for name, docs in self.collections.items()},
        }


# Singleton vector store
vector_store = VectorStoreManager()


def run_all_pipelines() -> dict:
    """Run all ETL pipelines and load into the vector store."""
    results = {}

    sa_pipeline = SAOpenDataPipeline()
    results["sa_open_data"] = sa_pipeline.run(vector_store)

    doc_pipeline = MunicipalDocPipeline()
    results["municipal_docs"] = doc_pipeline.run(vector_store)

    results["total_documents"] = sum(results.values())
    results["vector_store_stats"] = vector_store.get_stats()
    return results
