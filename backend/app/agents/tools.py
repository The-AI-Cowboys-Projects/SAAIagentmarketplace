"""
San Antonio AI Agent Marketplace - LangChain Tool Definitions

Each tool has exhaustive docstrings specifying exactly when the LLM should
and should not invoke it. All tools return mock data for demo purposes.
"""

import json
import hashlib
import random
from datetime import datetime, timedelta, timezone
from langchain_core.tools import tool


def _ticket_id(prefix: str, seed: str) -> str:
    return f"{prefix}-{int(hashlib.md5(seed.encode()).hexdigest()[:8], 16) % 100000:05d}"


def _future_date(days_min: int = 3, days_max: int = 14) -> str:
    d = datetime.now(timezone.utc) + timedelta(days=random.randint(days_min, days_max))
    return d.strftime("%Y-%m-%d")


# =============================================================================
# CATEGORY 1: CIVIC — Unified Resident Experience (10 tools)
# =============================================================================

@tool
def search_sa_311_infrastructure(query: str, category: str = "pothole", location: str = "") -> str:
    """Search and file San Antonio 311 infrastructure service requests.

    USE THIS TOOL WHEN: The user reports a pothole, downed tree, broken sidewalk,
    traffic signal outage, or street light failure within San Antonio city limits.
    DO NOT USE WHEN: The issue is on private property, outside Bexar County,
    or relates to utilities (use CPS Energy tools instead).

    Args:
        query: Description of the infrastructure issue
        category: One of: pothole, sidewalk, traffic_signal, downed_tree, street_light
        location: Street address or intersection in San Antonio

    Returns:
        JSON with ticket_id, estimated_repair_date, severity_grade, and tracking_url
    """
    return json.dumps({
        "ticket_id": _ticket_id("SA311", query),
        "category": category,
        "location": location or "San Antonio, TX",
        "severity_grade": random.choice(["Low", "Medium", "High", "Critical"]),
        "estimated_repair_date": _future_date(3, 21),
        "status": "Submitted",
        "tracking_url": f"https://311.sanantonio.gov/track/{_ticket_id('SA311', query)}",
        "assigned_crew": f"District {random.randint(1, 10)} Public Works"
    })


@tool
def optimize_cps_energy_rate(monthly_kwh: float, current_plan: str = "standard", has_solar: bool = False) -> str:
    """Analyze CPS Energy consumption and recommend optimal rate plans.

    USE THIS TOOL WHEN: A San Antonio resident wants to reduce their electricity
    bill, compare CPS Energy rate plans, or optimize smart thermostat schedules.
    DO NOT USE WHEN: The user is outside the CPS Energy service area or asking
    about natural gas rates specifically.

    Args:
        monthly_kwh: Average monthly electricity usage in kilowatt-hours
        current_plan: Current CPS rate plan (standard, time_of_use, solar_buyback)
        has_solar: Whether the residence has solar panels

    Returns:
        JSON with recommended plan, projected savings, and thermostat schedule
    """
    plans = {
        "standard": {"rate": 0.1124, "name": "Standard Residential"},
        "time_of_use": {"rate": 0.0892, "name": "Time-of-Use Saver"},
        "solar_buyback": {"rate": 0.0975, "name": "Solar Buyback Program"},
    }
    best = "time_of_use" if monthly_kwh > 1000 else "standard"
    if has_solar:
        best = "solar_buyback"
    savings = abs(plans[current_plan]["rate"] - plans[best]["rate"]) * monthly_kwh

    return json.dumps({
        "current_plan": plans.get(current_plan, plans["standard"]),
        "recommended_plan": plans[best],
        "monthly_kwh": monthly_kwh,
        "projected_monthly_savings": round(savings, 2),
        "projected_annual_savings": round(savings * 12, 2),
        "thermostat_schedule": {
            "summer_peak_avoid": "2:00 PM - 7:00 PM (set to 78F)",
            "winter_off_peak": "10:00 PM - 6:00 AM (set to 65F)",
            "weekend_optimization": "Reduce by 2F during peak hours"
        }
    })


@tool
def check_sa_property_code(address: str, condition_description: str) -> str:
    """Check San Antonio Property Maintenance Code compliance for a specific property.

    USE THIS TOOL WHEN: A user wants to know if a property condition violates
    San Antonio municipal code, or wants to report overgrown lots, junk vehicles,
    graffiti, or deteriorating structures within city limits.
    DO NOT USE WHEN: The inquiry is about building permits (use BuildSA tool),
    or the property is outside San Antonio city limits.

    Args:
        address: Street address of the property in San Antonio
        condition_description: Description of the property condition in question

    Returns:
        JSON with potential violations, code sections, and reporting options
    """
    violations = [
        {"code": "SA-PMC-302.1", "title": "Exterior Structure", "risk": "Medium"},
        {"code": "SA-PMC-308.1", "title": "Rubbish and Garbage", "risk": "High"},
        {"code": "SA-PMC-302.7", "title": "Accessory Structures", "risk": "Low"},
        {"code": "SA-PMC-304.14", "title": "Insect Screens", "risk": "Low"},
    ]
    matched = random.sample(violations, k=random.randint(1, 3))
    return json.dumps({
        "address": address,
        "potential_violations": matched,
        "enforcement_action": "Code Enforcement inspection within 5-10 business days",
        "report_url": "https://311.sanantonio.gov/report/property-maintenance",
        "appeal_process": "Administrative hearing available within 30 days of citation"
    })


@tool
def triage_dangerous_animal(incident_description: str, animal_type: str = "dog", location: str = "") -> str:
    """Triage dangerous animal incidents using ACS dangerous dog registry.

    USE THIS TOOL WHEN: A San Antonio resident reports an aggressive, loose, or
    dangerous animal, a dog bite incident, or needs to file a dangerous animal affidavit.
    DO NOT USE WHEN: The user is asking about pet adoption, stray TNR programs,
    or routine animal welfare questions.

    Args:
        incident_description: Detailed description of the animal incident
        animal_type: Type of animal (dog, cat, other)
        location: Location of the incident

    Returns:
        JSON with triage priority, required forms, ACS contact info, and legal guidance
    """
    return json.dumps({
        "triage_priority": random.choice(["Immediate", "Urgent", "Standard"]),
        "case_number": _ticket_id("ACS-DA", incident_description),
        "required_forms": [
            "Dangerous Animal Affidavit (Form ACS-DA-01)",
            "Bite Report (if applicable, Form ACS-BR-01)"
        ],
        "acs_contact": {"phone": "(210) 207-4738", "address": "4710 TX-151, San Antonio, TX 78227"},
        "legal_steps": [
            "File affidavit with ACS within 72 hours of incident",
            "Animal Control officer will investigate within 24-48 hours",
            "Hearing scheduled within 10 business days if animal deemed dangerous"
        ],
        "nearby_registry_matches": random.randint(0, 3)
    })


@tool
def coordinate_tnr_program(zip_code: str, colony_size: int = 1) -> str:
    """Coordinate Trap-Neuter-Return activities for feral cats in San Antonio.

    USE THIS TOOL WHEN: A caretaker needs TNR scheduling, free microchip/vaccination
    event info, or spay/neuter clinic appointments for community cats.
    DO NOT USE WHEN: The user is reporting a dangerous animal (use triage tool)
    or asking about pet adoption services.

    Args:
        zip_code: San Antonio ZIP code of the feral cat colony
        colony_size: Estimated number of cats in the colony

    Returns:
        JSON with upcoming events, clinic appointments, and TNR resources
    """
    return json.dumps({
        "zip_code": zip_code,
        "colony_size": colony_size,
        "upcoming_events": [
            {"event": "Free Microchip & Vaccine Clinic", "date": _future_date(5, 15),
             "location": "ACS Campus, 4710 TX-151"},
            {"event": "Community Cat Workshop", "date": _future_date(10, 25),
             "location": "Brackenridge Park"}
        ],
        "clinic_slots": [
            {"clinic": "SA Humane Society", "next_available": _future_date(2, 7),
             "cost": "Free (community cat program)"},
            {"clinic": "SNIPSA", "next_available": _future_date(1, 5),
             "cost": "$25 per cat"}
        ],
        "trap_loan_available": True,
        "acs_tnr_hotline": "(210) 207-6666"
    })


@tool
def resolve_municipal_citation(citation_number: str, violation_type: str = "traffic") -> str:
    """Evaluate SA Municipal Court citations for resolution options.

    USE THIS TOOL WHEN: A resident has received a traffic ticket, parking violation,
    or municipal citation and wants to know their legal options including
    Defensive Driving and Deferred Disposition eligibility.
    DO NOT USE WHEN: The citation is from a state or federal court, or involves
    criminal charges beyond Class C misdemeanors.

    Args:
        citation_number: The citation or case number
        violation_type: One of: traffic, parking, code_violation, noise

    Returns:
        JSON with eligibility analysis, payment options, and hearing schedule
    """
    return json.dumps({
        "citation_number": citation_number,
        "violation_type": violation_type,
        "defensive_driving_eligible": violation_type == "traffic",
        "deferred_disposition_eligible": True,
        "fine_amount": random.choice([150, 200, 250, 300, 350]),
        "payment_options": ["Online portal", "In-person at Municipal Court",
                            "Payment plan available"],
        "next_hearing_dates": [_future_date(14, 30), _future_date(30, 45)],
        "court_address": "401 S Frio St, San Antonio, TX 78207",
        "online_portal": "https://www.sanantonio.gov/Municipal-Court"
    })


@tool
def check_prek4sa_eligibility(child_age: int, zip_code: str, household_income: int, household_size: int) -> str:
    """Check eligibility for San Antonio Pre-K 4 SA program.

    USE THIS TOOL WHEN: A parent wants to determine if their child qualifies for
    Pre-K 4 SA, needs help with the application, or wants to find their assigned center.
    DO NOT USE WHEN: The child is not turning 4 by September 1 of the enrollment year,
    or the family lives outside San Antonio city limits.

    Args:
        child_age: Child's age (must be 4 by Sept 1)
        zip_code: Family's residential ZIP code in San Antonio
        household_income: Annual household income in dollars
        household_size: Number of people in household

    Returns:
        JSON with eligibility status, nearest centers, and application checklist
    """
    income_limit = {1: 28000, 2: 38000, 3: 48000, 4: 58000, 5: 68000}
    limit = income_limit.get(household_size, 78000)
    eligible = child_age == 4 or (child_age == 3 and household_income < limit)

    return json.dumps({
        "eligible": eligible,
        "child_age": child_age,
        "income_within_limit": household_income < limit,
        "income_limit_for_household": limit,
        "nearest_centers": [
            {"name": "Pre-K 4 SA North", "address": "3635 Medical Dr"},
            {"name": "Pre-K 4 SA South", "address": "7031 S New Braunfels Ave"},
            {"name": "Pre-K 4 SA East", "address": "5230 Eisenhauer Rd"},
            {"name": "Pre-K 4 SA West", "address": "1235 Enrique M Barrera Pkwy"}
        ],
        "required_documents": [
            "Child's birth certificate", "Proof of SA residency",
            "Proof of income (last 30 days)", "Immunization records",
            "Parent/guardian photo ID"
        ],
        "application_url": "https://prek4sa.com/enroll"
    })


@tool
def optimize_via_transit_route(origin: str, destination: str, departure_time: str = "now") -> str:
    """Calculate optimal multi-modal transit routes using VIA Metropolitan Transit.

    USE THIS TOOL WHEN: A San Antonio resident needs public transit directions,
    wants to compare bus routes, or needs multi-modal routing including VIA buses,
    scooters, and walking paths.
    DO NOT USE WHEN: The user needs intercity travel (use Greyhound/Amtrak),
    or the origin/destination is outside the VIA service area.

    Args:
        origin: Starting address or intersection in San Antonio
        destination: Destination address or intersection
        departure_time: Departure time (ISO format or 'now')

    Returns:
        JSON with route options, transfer points, and estimated travel times
    """
    return json.dumps({
        "routes": [
            {
                "type": "Bus Only",
                "route_numbers": [f"Route {random.randint(1, 100)}"],
                "total_time_minutes": random.randint(25, 55),
                "transfers": random.randint(0, 2),
                "fare": "$1.30",
                "walk_time_minutes": random.randint(3, 12)
            },
            {
                "type": "Bus + Scooter",
                "route_numbers": [f"Route {random.randint(1, 100)}"],
                "total_time_minutes": random.randint(18, 40),
                "transfers": 1,
                "fare": "$1.30 + ~$3.50 scooter",
                "scooter_availability": random.randint(2, 8)
            }
        ],
        "origin": origin,
        "destination": destination,
        "via_real_time_url": "https://www.viainfo.net/plan-your-trip/"
    })


@tool
def track_solid_waste_schedule(address: str) -> str:
    """Track Solid Waste Management collection schedules for a SA address.

    USE THIS TOOL WHEN: A resident needs their garbage, recycling, or brush
    collection schedule, wants info on bulky item pickup, or upcoming Free
    Landfill Days.
    DO NOT USE WHEN: The inquiry is about illegal dumping (file 311 report)
    or commercial waste services.

    Args:
        address: Residential street address in San Antonio

    Returns:
        JSON with collection schedule, upcoming events, and special pickup info
    """
    return json.dumps({
        "address": address,
        "garbage_day": random.choice(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
        "recycling_day": random.choice(["Monday", "Wednesday", "Friday"]),
        "next_brush_pickup": _future_date(7, 30),
        "bulky_item_pickup": {
            "next_available": _future_date(3, 14),
            "items_allowed": 4,
            "schedule_url": "https://www.sanantonio.gov/swmd/bulky"
        },
        "upcoming_events": [
            {"event": "Free Landfill Day", "date": _future_date(10, 45),
             "location": "Nelson Gardens Transfer Station"}
        ]
    })


@tool
def synthesize_sa_policy(topic: str, council_district: int = 0) -> str:
    """Synthesize San Antonio City Council agendas and SASpeakUp survey data.

    USE THIS TOOL WHEN: A neighborhood association leader or engaged citizen
    wants summarized legislative updates, council agenda highlights, or
    public survey results from SASpeakUp.
    DO NOT USE WHEN: The user needs legal advice or is asking about
    state/federal legislation.

    Args:
        topic: Policy topic to search (e.g., 'zoning', 'budget', 'transit')
        council_district: Optional council district number (1-10, 0 for all)

    Returns:
        JSON with policy summaries, upcoming votes, and community sentiment
    """
    return json.dumps({
        "topic": topic,
        "council_district": council_district or "All Districts",
        "recent_agenda_items": [
            {"date": _future_date(-7, -1), "item": f"Resolution on {topic} improvements",
             "status": "Passed (8-3)", "impact": "Citywide"},
            {"date": _future_date(-14, -7), "item": f"Budget amendment for {topic}",
             "status": "Committee Review", "impact": f"District {council_district or 'All'}"}
        ],
        "saspeakup_sentiment": {
            "support": f"{random.randint(55, 85)}%",
            "oppose": f"{random.randint(10, 30)}%",
            "total_responses": random.randint(200, 2000)
        },
        "three_bullet_summary": [
            f"Council allocated ${random.randint(1, 15)}M for {topic} improvements",
            f"Public comment period open until {_future_date(14, 30)}",
            f"Next vote scheduled for {_future_date(7, 21)} regular session"
        ]
    })


# =============================================================================
# CATEGORY 2: BUSINESS — Small Business & Economic Development (10 tools)
# =============================================================================

@tool
def match_sbeda_procurement(business_type: str, certifications: list[str] = None, industry: str = "") -> str:
    """Match minority/women-owned businesses with SA municipal RFPs via SBEDA.

    USE THIS TOOL WHEN: A certified small, minority, or women-owned business
    in San Antonio wants to find matching municipal procurement opportunities.
    DO NOT USE WHEN: The business is not located in San Antonio or is seeking
    federal contracts (use SAM.gov instead).

    Args:
        business_type: Type of business (e.g., 'construction', 'IT', 'catering')
        certifications: List of certifications (SMWBE, ESBE, HUB, etc.)
        industry: NAICS industry code or description

    Returns:
        JSON with matching RFPs, bid deadlines, and template suggestions
    """
    return json.dumps({
        "matching_rfps": [
            {"rfp_id": f"CoSA-{random.randint(2025, 2026)}-{random.randint(100, 999)}",
             "title": f"Municipal {business_type.title()} Services Contract",
             "deadline": _future_date(14, 45),
             "estimated_value": f"${random.randint(50, 500)}K",
             "sbeda_goal": f"{random.randint(10, 30)}% subcontracting"},
            {"rfp_id": f"CoSA-{random.randint(2025, 2026)}-{random.randint(100, 999)}",
             "title": f"District {random.randint(1, 10)} {business_type.title()} Project",
             "deadline": _future_date(21, 60),
             "estimated_value": f"${random.randint(25, 250)}K",
             "sbeda_goal": f"{random.randint(15, 35)}% subcontracting"}
        ],
        "vendor_registry_url": "https://www.sanantonio.gov/edo/BidOpportunities"
    })


@tool
def draft_revitalize_sa_grant(business_name: str, project_description: str, requested_amount: int) -> str:
    """Draft RevitalizeSA grant applications for corridor businesses.

    USE THIS TOOL WHEN: A San Antonio small business owner needs help writing
    a grant application for the Corridor Leadership Program, construction
    mitigation grants, or other RevitalizeSA funding opportunities.
    DO NOT USE WHEN: The business is seeking federal SBA loans or private financing.

    Args:
        business_name: Name of the business
        project_description: Description of the improvement project
        requested_amount: Requested grant amount in dollars

    Returns:
        JSON with draft narrative, required attachments, and submission info
    """
    return json.dumps({
        "business_name": business_name,
        "grant_program": "RevitalizeSA Corridor Leadership Program",
        "draft_narrative": f"{business_name} seeks ${requested_amount:,} to {project_description}. "
                          f"This project will create approximately {random.randint(2, 15)} jobs and "
                          f"generate an estimated ${requested_amount * 3:,} in economic impact for "
                          f"the surrounding corridor over 24 months.",
        "required_attachments": [
            "Business plan or executive summary", "Proof of SA business location",
            "2 years of financial statements", "Project timeline and milestones",
            "Contractor bids (if construction)"
        ],
        "submission_deadline": _future_date(30, 90),
        "contact": "Economic Development Department, (210) 207-8080"
    })


@tool
def navigate_buildsa_permits(project_type: str, property_address: str, scope: str = "") -> str:
    """Determine required commercial permits from SA Development Services Dept.

    USE THIS TOOL WHEN: A developer or business owner needs to know which
    permits are required for construction, renovation, or change of use in
    San Antonio. Analyzes zoning compatibility and permit requirements.
    DO NOT USE WHEN: The project is residential-only (use Property Code tool)
    or outside San Antonio city limits.

    Args:
        project_type: Type of project (new_construction, renovation, change_of_use, signage)
        property_address: Address of the commercial property
        scope: Description of the scope of work

    Returns:
        JSON with required permits, estimated fees, timeline, and DSD contact
    """
    permits = {
        "new_construction": ["Building Permit", "Plumbing Permit", "Electrical Permit",
                            "Mechanical Permit", "Fire Alarm Permit"],
        "renovation": ["Building Permit", "Mechanical Permit"],
        "change_of_use": ["Certificate of Occupancy", "Zoning Verification"],
        "signage": ["Sign Permit", "Electrical Permit (if illuminated)"]
    }
    return json.dumps({
        "property_address": property_address,
        "zoning_district": random.choice(["C-2 Commercial", "C-3 General Commercial",
                                          "MF-33 Mixed Use", "I-1 Light Industrial"]),
        "required_permits": permits.get(project_type, permits["renovation"]),
        "estimated_fees": f"${random.randint(500, 5000)}",
        "estimated_review_time": f"{random.randint(2, 8)} weeks",
        "dsd_portal": "https://www.sanantonio.gov/DSD/Online-Services",
        "pre_development_meeting": "Recommended for projects over $500K"
    })


@tool
def check_historic_preservation(address: str, proposed_work: str) -> str:
    """Check OHP historic designation and rehab requirements for SA properties.

    USE THIS TOOL WHEN: A property developer wants to know if a building is
    historically designated, needs OHP approval for renovations, or wants to
    calculate historic tax incentives.
    DO NOT USE WHEN: The property is not within a San Antonio historic district.

    Args:
        address: Property address
        proposed_work: Description of proposed renovation work

    Returns:
        JSON with historic status, compliance requirements, and tax incentives
    """
    return json.dumps({
        "address": address,
        "historic_district": random.choice(["King William", "Monte Vista",
                                            "Lavaca", "Dignowity Hill", "None"]),
        "landmark_status": random.choice([True, False]),
        "ohp_review_required": True,
        "compliant_materials": ["Original wood siding repair", "Lime-based mortar",
                                "Period-appropriate windows"],
        "tax_incentives": {
            "federal_htc": "20% of qualified rehab expenses",
            "texas_htc": "25% of eligible costs (state credit)",
            "city_tax_freeze": "10-year property tax freeze available"
        },
        "ohp_contact": "(210) 207-0035"
    })


@tool
def prepare_vita_taxes(annual_revenue: float, expenses: dict = None) -> str:
    """Categorize expenses and format data for VITA tax preparation.

    USE THIS TOOL WHEN: A San Antonio sole proprietor or micro-business owner
    earning under $64,000 needs help preparing their tax documents for the
    Volunteer Income Tax Assistance (VITA) program.
    DO NOT USE WHEN: The business has revenue over $64,000, has employees,
    or needs corporate tax filing.

    Args:
        annual_revenue: Total annual business revenue
        expenses: Dictionary of expense categories and amounts

    Returns:
        JSON with categorized expenses, Schedule C preview, and VITA locations
    """
    if expenses is None:
        expenses = {"supplies": 1200, "vehicle": 3500, "utilities": 2400}
    total_expenses = sum(expenses.values())
    return json.dumps({
        "schedule_c_preview": {
            "gross_revenue": annual_revenue,
            "total_expenses": total_expenses,
            "net_profit": annual_revenue - total_expenses,
            "se_tax_estimate": round((annual_revenue - total_expenses) * 0.153, 2)
        },
        "categorized_expenses": expenses,
        "vita_locations": [
            {"name": "VITA at Westside Education Center", "address": "1500 Castroville Rd"},
            {"name": "VITA at SA Public Library", "address": "600 Soledad St"}
        ],
        "required_documents": ["Photo ID", "SSN/ITIN", "1099 forms",
                               "Business expense receipts", "Prior year return"]
    })


@tool
def analyze_bexar_commercial_realestate(zip_code: str, property_type: str = "retail", max_rent: int = 5000) -> str:
    """Analyze commercial real estate in Bexar County with demographic data.

    USE THIS TOOL WHEN: An entrepreneur needs to find optimal retail, office,
    or restaurant locations in San Antonio using zoning, foot traffic, and
    demographic analysis.
    DO NOT USE WHEN: The user is looking for residential properties or
    properties outside Bexar County.

    Args:
        zip_code: Target ZIP code in San Antonio
        property_type: Property type (retail, office, restaurant, warehouse)
        max_rent: Maximum monthly rent budget

    Returns:
        JSON with available properties, demographic data, and foot traffic analysis
    """
    return json.dumps({
        "zip_code": zip_code,
        "available_properties": [
            {"address": f"{random.randint(100, 9999)} {random.choice(['Broadway', 'Houston St', 'Fredericksburg Rd', 'Bandera Rd'])}",
             "sqft": random.randint(800, 5000),
             "monthly_rent": random.randint(1500, max_rent),
             "zoning": "C-2 Commercial"}
        ],
        "demographics": {
            "median_household_income": f"${random.randint(35, 85)}K",
            "population_density": f"{random.randint(1000, 8000)} per sq mi",
            "daily_foot_traffic": random.randint(500, 15000)
        },
        "bexar_appraisal_url": "https://bexar.trueautomation.com"
    })


@tool
def generate_b2b_leads(industry: str, location: str = "San Antonio", count: int = 5) -> str:
    """Generate B2B leads from San Antonio business directories.

    USE THIS TOOL WHEN: A sales professional needs enriched contact profiles
    of San Antonio businesses for outbound sales campaigns.
    DO NOT USE WHEN: The user needs residential contacts or contacts outside
    the San Antonio metro area.

    Args:
        industry: Target industry (e.g., 'healthcare', 'hospitality', 'construction')
        location: Target location (default: San Antonio)
        count: Number of leads to generate (max 10)

    Returns:
        JSON with enriched business profiles and contact information
    """
    leads = []
    for i in range(min(count, 10)):
        leads.append({
            "company": f"SA {industry.title()} Solutions {chr(65 + i)}",
            "industry": industry,
            "employee_count": random.randint(10, 500),
            "estimated_revenue": f"${random.randint(1, 50)}M",
            "contact_name": f"Contact {chr(65 + i)}",
            "contact_title": random.choice(["CEO", "COO", "VP Operations", "Director"]),
            "lead_score": random.randint(60, 95)
        })
    return json.dumps({"leads": leads, "total_found": random.randint(count, count * 5)})


@tool
def check_food_truck_compliance(cuisine_type: str, operating_zone: str = "downtown") -> str:
    """Check mobile vending compliance for SA food trucks.

    USE THIS TOOL WHEN: A food truck operator needs to verify Metro Health
    District regulations, FireSafeSA inspections, or designated parking zones.
    DO NOT USE WHEN: The user is opening a brick-and-mortar restaurant.

    Args:
        cuisine_type: Type of cuisine being served
        operating_zone: Target operating zone (downtown, northside, southside, etc.)

    Returns:
        JSON with required permits, inspection schedule, and approved zones
    """
    return json.dumps({
        "required_permits": [
            "Mobile Food Vendor Permit ($300/year)",
            "Metro Health District Inspection (annual)",
            "Fire Department Inspection",
            "Sales Tax Permit (Texas Comptroller)"
        ],
        "approved_parking_zones": [
            "Hemisfair Park (permit required)",
            "Pearl Brewery District (weekends)",
            f"{operating_zone.title()} designated food truck parks"
        ],
        "next_inspection_slots": [_future_date(7, 21)],
        "metro_health_contact": "(210) 207-8853"
    })


@tool
def find_disaster_recovery_funding(disaster_type: str, business_size: str = "micro") -> str:
    """Locate disaster recovery funding for Texas micro-businesses.

    USE THIS TOOL WHEN: A small business in San Antonio has been affected by
    a natural disaster (flood, freeze, hurricane) and needs emergency funding,
    SBA disaster loans, or CDFI low-interest loans.
    DO NOT USE WHEN: The business is seeking standard business loans unrelated
    to disaster recovery.

    Args:
        disaster_type: Type of disaster (flood, freeze, hurricane, tornado)
        business_size: micro (0-5 employees), small (6-50), medium (51-250)

    Returns:
        JSON with available funding sources, eligibility, and application links
    """
    return json.dumps({
        "funding_sources": [
            {"program": "SBA Physical Disaster Loan", "max_amount": "$2M",
             "rate": "4%", "term": "30 years"},
            {"program": "SBA EIDL", "max_amount": "$500K",
             "rate": "3.75%", "term": "30 years"},
            {"program": "LiftFund CDFI Emergency Loan", "max_amount": "$50K",
             "rate": "5.5%", "term": "5 years"},
            {"program": "Governor's Office Small Business Grant", "max_amount": "$25K",
             "rate": "0% (grant)", "term": "N/A"}
        ],
        "application_url": "https://gov.texas.gov/small-business",
        "local_assistance": "Workforce Solutions Alamo, (210) 272-3260"
    })


@tool
def generate_social_commerce_catalog(products: list[dict] = None, platform: str = "instagram") -> str:
    """Generate SEO-optimized product listings for social commerce platforms.

    USE THIS TOOL WHEN: A San Antonio local business wants to create Instagram
    or TikTok product listings with localized, SEO-optimized descriptions.
    DO NOT USE WHEN: The business needs a full e-commerce website build.

    Args:
        products: List of product dicts with name, price, description
        platform: Target platform (instagram, tiktok, facebook)

    Returns:
        JSON with optimized listings, hashtags, and posting schedule
    """
    if products is None:
        products = [{"name": "Sample Product", "price": 29.99}]
    listings = []
    for p in products:
        listings.append({
            "original": p,
            "optimized_title": f"{p['name']} | San Antonio Local",
            "seo_description": f"Handcrafted {p['name']} from San Antonio's finest. "
                              f"Shop local Texas-made products. Free SA metro delivery.",
            "hashtags": [f"#SanAntonio", "#ShopLocal", "#TexasMade",
                        "#SATXBusiness", f"#{platform}Shop"],
            "best_post_time": "Tuesday/Thursday 6-8 PM CST"
        })
    return json.dumps({"listings": listings, "platform": platform})


# =============================================================================
# CATEGORY 3: MILITARY — Military Transition & JBSA (10 tools)
# =============================================================================

@tool
def translate_military_resume(military_branch: str, rank: str, mos_code: str, years_service: int) -> str:
    """Translate military evaluations (NCOER/FITREP/OPR) to civilian resumes.

    USE THIS TOOL WHEN: A transitioning service member from JBSA needs to
    convert military performance evaluations, MOS codes, and tactical jargon
    into civilian-equivalent corporate competencies.
    DO NOT USE WHEN: The user is building a federal resume (use USAJOBS tool)
    or is not a military service member.

    Args:
        military_branch: Branch of service (Army, Navy, Air Force, Marines, Space Force)
        rank: Military rank (e.g., 'E-7/SFC', 'O-3/Captain')
        mos_code: Military Occupational Specialty code
        years_service: Total years of military service

    Returns:
        JSON with translated competencies, resume sections, and salary benchmarks
    """
    mos_map = {
        "25B": {"civilian": "IT Specialist / Systems Administrator", "salary": "$65K-$95K"},
        "68W": {"civilian": "Emergency Medical Technician / Paramedic", "salary": "$40K-$65K"},
        "11B": {"civilian": "Security Specialist / Operations Manager", "salary": "$50K-$80K"},
        "35F": {"civilian": "Intelligence Analyst / Data Analyst", "salary": "$60K-$90K"},
        "92Y": {"civilian": "Supply Chain Manager / Logistics Coordinator", "salary": "$55K-$75K"},
    }
    mapped = mos_map.get(mos_code, {"civilian": "Operations Manager", "salary": "$55K-$85K"})
    return json.dumps({
        "military_profile": {"branch": military_branch, "rank": rank, "mos": mos_code},
        "civilian_equivalent": mapped,
        "translated_competencies": [
            "Cross-functional team leadership (managed teams of 10-50 personnel)",
            "Operations management under high-pressure, time-critical conditions",
            "Strategic planning and resource allocation",
            "Risk assessment and mitigation protocols",
            f"{years_service} years of progressive leadership experience"
        ],
        "sa_employers_hiring": ["USAA", "Booz Allen Hamilton", "H-E-B",
                                "Rackspace Technology", "Valero Energy"]
    })


@tool
def draft_va_nexus_letter(condition: str, service_dates: str, service_connection: str) -> str:
    """Draft VA disability claim nexus letters from military medical records.

    USE THIS TOOL WHEN: A veteran needs help crafting a medical nexus letter
    connecting a current disability to military service for VA compensation claims.
    DO NOT USE WHEN: The veteran needs actual medical diagnosis (refer to VA
    healthcare) or legal representation.

    Args:
        condition: Medical condition for the claim
        service_dates: Period of military service
        service_connection: Description of how condition relates to service

    Returns:
        JSON with draft nexus letter, required evidence, and VA contact info
    """
    return json.dumps({
        "draft_nexus_summary": f"It is at least as likely as not (50% or greater probability) "
                               f"that the veteran's {condition} is etiologically related to "
                               f"their military service during {service_dates}. {service_connection}",
        "required_evidence": [
            "Service Treatment Records (STRs)",
            "Current diagnosis from licensed physician",
            "Buddy statements from fellow service members",
            "VA medical center treatment records"
        ],
        "va_regional_office": "San Antonio VA Regional Office, 8900 Lakes at 610 Dr",
        "claim_filing_url": "https://www.va.gov/disability/file-disability-claim-form-21-526ez/",
        "local_vso": "Texas Veterans Commission, (210) 699-5087"
    })


@tool
def match_workforce_solutions(military_skills: list[str], education_level: str, preferred_industry: str = "") -> str:
    """Match veterans with SA: Ready to Work upskilling programs.

    USE THIS TOOL WHEN: A transitioning service member or veteran needs to
    find training programs, paid apprenticeships, or upskilling opportunities
    through Workforce Solutions Alamo in San Antonio.
    DO NOT USE WHEN: The user is seeking active-duty training (use SkillBridge tool).

    Args:
        military_skills: List of military skills or MOS descriptions
        education_level: Highest education level
        preferred_industry: Preferred civilian industry

    Returns:
        JSON with matching programs, funding availability, and enrollment info
    """
    return json.dumps({
        "matching_programs": [
            {"program": "SA: Ready to Work IT Certification",
             "duration": "16 weeks", "funding": "Fully funded ($49.5M program)",
             "certification": "CompTIA A+, Network+, Security+"},
            {"program": "Alamo Colleges Welding Technology",
             "duration": "12 weeks", "funding": "GI Bill + Ready to Work",
             "certification": "AWS Certified Welder"},
            {"program": "Project Quest Healthcare Pathway",
             "duration": "24 weeks", "funding": "Scholarship available",
             "certification": "CNA/CMA"}
        ],
        "enrollment_contact": "Workforce Solutions Alamo, (210) 272-3260",
        "career_navigator_url": "https://www.wsalamo.com/career-navigator"
    })


@tool
def build_military_spouse_resume(experience: list[str], relocations: int, volunteer_work: str = "") -> str:
    """Build USAJOBS-formatted federal resumes for military spouses.

    USE THIS TOOL WHEN: A military spouse needs help articulating frequent
    relocations and volunteer work into a competitive federal resume formatted
    for the USAJOBS system at the GS scale.
    DO NOT USE WHEN: The spouse is seeking private sector employment
    (use standard resume translator).

    Args:
        experience: List of work experience descriptions
        relocations: Number of PCS moves
        volunteer_work: Description of volunteer experience

    Returns:
        JSON with formatted resume sections and USAJOBS tips
    """
    return json.dumps({
        "resume_format": "USAJOBS Federal Resume",
        "key_sections": {
            "professional_summary": f"Adaptable professional with experience across "
                                   f"{relocations} geographic relocations, demonstrating "
                                   f"exceptional resilience and rapid organizational integration.",
            "experience_entries": [{"title": exp, "hours_per_week": 40,
                                   "gs_equivalent": f"GS-{random.randint(5, 12)}"} for exp in experience],
            "volunteer_section": volunteer_work or "Community leadership roles across installations"
        },
        "military_spouse_preference": "EO 13473 - Military Spouse Hiring Authority (eligible)",
        "usajobs_tips": [
            "Include ALL experience hours per week",
            "Mirror the job announcement language exactly",
            "List volunteer work with supervisor contact info"
        ]
    })


@tool
def compare_tricare_plans(tricare_plan: str, employer_plan_details: dict = None) -> str:
    """Compare TRICARE benefits to civilian employer healthcare plans.

    USE THIS TOOL WHEN: A retiring service member or veteran needs to evaluate
    whether to keep TRICARE or switch to an employer plan, calculating
    long-term out-of-pocket cost differences.
    DO NOT USE WHEN: The user is active duty (TRICARE Prime is mandatory).

    Args:
        tricare_plan: Current TRICARE plan (Prime, Select, For Life, Young Adult)
        employer_plan_details: Dict with deductible, premium, copay info

    Returns:
        JSON with cost comparison and recommendation
    """
    if employer_plan_details is None:
        employer_plan_details = {"monthly_premium": 450, "deductible": 2000, "copay": 40}
    tricare_costs = {
        "Prime": {"monthly": 0, "deductible": 0, "copay": 15},
        "Select": {"monthly": 50, "deductible": 150, "copay": 25},
        "For Life": {"monthly": 0, "deductible": 150, "copay": 20},
    }
    tc = tricare_costs.get(tricare_plan, tricare_costs["Select"])
    emp = employer_plan_details
    return json.dumps({
        "tricare_annual_cost": tc["monthly"] * 12 + tc["deductible"],
        "employer_annual_cost": emp["monthly_premium"] * 12 + emp["deductible"],
        "annual_savings_with_tricare": (emp["monthly_premium"] * 12 + emp["deductible"]) -
                                       (tc["monthly"] * 12 + tc["deductible"]),
        "recommendation": f"Keep TRICARE {tricare_plan} - saves ${(emp['monthly_premium'] * 12 + emp['deductible']) - (tc['monthly'] * 12 + tc['deductible']):,.0f}/year",
        "sa_tricare_office": "Brooke Army Medical Center, (210) 916-4141"
    })


@tool
def match_clearance_jobs(clearance_level: str, skills: list[str] = None) -> str:
    """Match cleared personnel with SA defense contractor job openings.

    USE THIS TOOL WHEN: A veteran or transitioning service member with an active
    security clearance (Secret, TS, TS-SCI) needs to find matching defense
    contractor positions in the San Antonio area.
    DO NOT USE WHEN: The user's clearance has expired or they need non-cleared positions.

    Args:
        clearance_level: Active clearance (Secret, Top_Secret, TS_SCI)
        skills: List of relevant skills

    Returns:
        JSON with matching job openings at SA defense contractors
    """
    contractors = ["Boeing SA", "Lockheed Martin Cyber", "Booz Allen Hamilton",
                   "CACI International", "Leidos", "Raytheon (Port SA)"]
    jobs = []
    for c in random.sample(contractors, min(4, len(contractors))):
        jobs.append({
            "company": c,
            "title": f"{random.choice(['Cyber', 'Intel', 'Systems', 'Network'])} "
                    f"{random.choice(['Analyst', 'Engineer', 'Architect'])}",
            "clearance_required": clearance_level,
            "salary_range": f"${random.randint(80, 140)}K",
            "location": "San Antonio, TX"
        })
    return json.dumps({"matching_jobs": jobs, "total_positions": len(jobs)})


@tool
def generate_mic3_waiver(child_name: str, sending_state: str, receiving_district: str = "SAISD") -> str:
    """Generate MIC3 interstate compact waivers for military dependent transfers.

    USE THIS TOOL WHEN: A military family is PCSing to JBSA and needs to
    facilitate their child's school transfer under the Interstate Compact on
    Educational Opportunity for Military Children (MIC3).
    DO NOT USE WHEN: The family is not military or the transfer is within Texas.

    Args:
        child_name: Name of the military dependent
        sending_state: State the family is transferring from
        receiving_district: SA school district (SAISD, NEISD, NISD, etc.)

    Returns:
        JSON with waiver documentation, required records, and district contacts
    """
    return json.dumps({
        "waiver_type": "MIC3 Interstate Compact Transfer",
        "child_name": child_name,
        "sending_state": sending_state,
        "receiving_district": receiving_district,
        "required_documents": [
            "Military orders (PCS/TDY)", "Unofficial transcript from sending school",
            "Immunization records", "IEP/504 plan (if applicable)",
            "Parent military ID"
        ],
        "district_liaison": {
            "SAISD": "(210) 554-2200", "NEISD": "(210) 407-0000",
            "NISD": "(210) 397-8500", "JUDSON ISD": "(210) 945-5100"
        },
        "enrollment_timeline": "Immediate enrollment required under MIC3 Article V"
    })


@tool
def draft_skillbridge_application(duty_station: str, target_company: str, program_dates: str) -> str:
    """Draft DOD SkillBridge command approval memos and applications.

    USE THIS TOOL WHEN: An active-duty service member at JBSA wants to apply
    for the DOD SkillBridge program and needs help with the command approval
    memorandum and identifying local corporate sponsors.
    DO NOT USE WHEN: The member has already separated from active duty.

    Args:
        duty_station: Current duty station (e.g., 'JBSA-Lackland')
        target_company: Desired SkillBridge employer
        program_dates: Proposed program dates

    Returns:
        JSON with draft memo, sponsor list, and application steps
    """
    return json.dumps({
        "draft_memo_sections": {
            "subject": f"Request for DOD SkillBridge Participation - {target_company}",
            "purpose": f"Request approval for SkillBridge internship at {target_company} "
                      f"during terminal leave period, {program_dates}",
            "justification": "This program supports successful military-to-civilian transition "
                           "while maintaining unit readiness standards."
        },
        "sa_skillbridge_sponsors": [
            "USAA", "Rackspace Technology", "H-E-B", "Frost Bank",
            "Southwest Research Institute (SwRI)", target_company
        ],
        "application_steps": [
            "1. Identify approved SkillBridge employer",
            "2. Draft command approval memo (template provided)",
            "3. Submit to first O-5 in chain of command",
            "4. Complete TAP requirements",
            "5. Begin SkillBridge (180 days max before ETS)"
        ]
    })


@tool
def optimize_gi_bill_hazelwood(remaining_gi_months: int, target_school: str = "UTSA", credits_needed: int = 60) -> str:
    """Calculate optimal GI Bill + Hazelwood Act benefit stacking for SA schools.

    USE THIS TOOL WHEN: A Texas veteran wants to maximize education benefits
    by combining Post-9/11 GI Bill with the Texas Hazelwood Act at UTSA,
    Alamo Colleges, or other San Antonio institutions.
    DO NOT USE WHEN: The veteran is not a Texas resident or is attending
    school outside Texas.

    Args:
        remaining_gi_months: Remaining Post-9/11 GI Bill months
        target_school: Target institution in San Antonio
        credits_needed: Total credit hours needed for degree

    Returns:
        JSON with optimal stacking strategy and cost breakdown
    """
    gi_bill_per_credit = 500
    gi_credits = remaining_gi_months * 4
    hazelwood_credits = max(0, credits_needed - gi_credits)
    return json.dumps({
        "strategy": "Use GI Bill first, then Hazelwood for remaining credits",
        "gi_bill": {
            "remaining_months": remaining_gi_months,
            "credits_covered": min(gi_credits, credits_needed),
            "bah_rate": "$1,785/month (San Antonio E-5 rate)",
            "book_stipend": "$1,000/year"
        },
        "hazelwood": {
            "credits_remaining": hazelwood_credits,
            "covers": "Tuition and fees only (150 credit hours max)",
            "eligibility": "Texas veteran with honorable discharge"
        },
        "total_out_of_pocket": "$0 (full coverage with stacking)",
        "school_contacts": {
            "UTSA": "Veterans Center, (210) 458-7969",
            "Alamo Colleges": "Veterans Affairs, (210) 486-0000"
        }
    })


@tool
def simulate_supply_chain_transition(military_mos: str, civilian_industry: str = "logistics") -> str:
    """Translate military supply chain experience to civilian warehousing roles.

    USE THIS TOOL WHEN: A transitioning logistics officer or NCO from JBSA
    wants to apply military predictive maintenance and provisioning skills
    to civilian supply chain management positions.
    DO NOT USE WHEN: The user has no military logistics background.

    Args:
        military_mos: Military logistics MOS/AFSC code
        civilian_industry: Target civilian industry

    Returns:
        JSON with skill mapping, certifications, and SA employer matches
    """
    return json.dumps({
        "military_skills_translated": {
            "PPBE Planning": "Annual Operating Plan / P&L Management",
            "Predictive Maintenance": "Asset Lifecycle Management / IoT Analytics",
            "Force Deployment": "Multi-site Distribution / JIT Inventory",
            "Battle Damage Assessment": "Root Cause Analysis / Six Sigma"
        },
        "recommended_certifications": [
            "APICS CSCP (Certified Supply Chain Professional)",
            "PMP (Project Management Professional)",
            "Lean Six Sigma Green Belt"
        ],
        "sa_employers": [
            {"company": "Toyota SA Plant", "role": "Supply Chain Manager", "salary": "$85K-$110K"},
            {"company": "H-E-B Distribution", "role": "Logistics Director", "salary": "$90K-$120K"},
            {"company": "Amazon SAT Fulfillment", "role": "Area Manager", "salary": "$70K-$95K"}
        ]
    })


# =============================================================================
# CATEGORY 4: HEALTHCARE — Healthcare Administration & STMC (10 tools)
# =============================================================================

@tool
def format_clinical_notes(transcript: str, note_format: str = "SOAP") -> str:
    """Format audio transcripts into structured clinical notes.

    USE THIS TOOL WHEN: A healthcare provider in the SA Medical Center needs
    to convert patient-doctor conversation transcripts into structured SOAP
    notes, H&P notes, or progress notes for EHR documentation.
    DO NOT USE WHEN: The content contains actual PHI (use HIPAA synthesizer
    tool first) or the user needs medical diagnosis.

    Args:
        transcript: Text transcript of clinical encounter
        note_format: Note format (SOAP, HP, progress_note)

    Returns:
        JSON with structured clinical note in requested format
    """
    return json.dumps({
        "format": note_format,
        "structured_note": {
            "subjective": "Patient presents with chief complaint as described in encounter.",
            "objective": "Vital signs within normal limits. Physical exam findings documented.",
            "assessment": "Working diagnosis based on clinical presentation and history.",
            "plan": "Treatment plan with follow-up as clinically indicated."
        },
        "ehr_compatible": True,
        "coding_suggestions": ["99213 - Office Visit, Est. Patient, Level 3",
                               "99214 - Office Visit, Est. Patient, Level 4"],
        "disclaimer": "AI-generated note requires physician review and attestation"
    })


@tool
def process_insurance_referral(referral_source: str, patient_id: str, insurance_payer: str) -> str:
    """Process incoming insurance referrals and verify payer eligibility.

    USE THIS TOOL WHEN: A clinic administrator needs to process a new patient
    referral, verify insurance eligibility, and update scheduling systems.
    DO NOT USE WHEN: The referral is for emergency services (call 911).

    Args:
        referral_source: Referring provider or facility
        patient_id: Internal patient identifier
        insurance_payer: Insurance company name

    Returns:
        JSON with eligibility status, authorization requirements, and scheduling
    """
    return json.dumps({
        "referral_status": "Received and Verified",
        "patient_id": patient_id,
        "insurance_verification": {
            "payer": insurance_payer,
            "eligible": True,
            "coverage_active": True,
            "copay": f"${random.randint(20, 50)}",
            "prior_auth_required": random.choice([True, False])
        },
        "scheduling_recommendation": {
            "urgency": random.choice(["Routine (14 days)", "Urgent (48 hours)", "Stat (24 hours)"]),
            "next_available": _future_date(2, 14)
        }
    })


@tool
def validate_medical_codes(diagnosis_description: str, procedure_description: str = "") -> str:
    """Suggest and validate ICD-10 and CPT codes for clinical documentation.

    USE THIS TOOL WHEN: A medical coder or clinic administrator needs to
    identify the most accurate, highest-specificity ICD-10/CPT codes for
    a clinical encounter to reduce claim denial rates.
    DO NOT USE WHEN: The user needs actual clinical diagnosis or treatment advice.

    Args:
        diagnosis_description: Clinical diagnosis description
        procedure_description: Procedure performed (if any)

    Returns:
        JSON with suggested codes, confidence levels, and denial risk assessment
    """
    return json.dumps({
        "icd10_suggestions": [
            {"code": "E11.9", "description": "Type 2 DM without complications",
             "specificity": "High", "confidence": 0.92},
            {"code": "E11.65", "description": "Type 2 DM with hyperglycemia",
             "specificity": "Higher", "confidence": 0.85}
        ],
        "cpt_suggestions": [
            {"code": "99214", "description": "Office visit, est. patient, moderate",
             "rvu": 2.10},
            {"code": "99215", "description": "Office visit, est. patient, high",
             "rvu": 3.05}
        ],
        "denial_risk": "Low (12% historical denial rate for these codes)",
        "documentation_requirements": [
            "Medical necessity clearly stated",
            "Time-based or complexity-based documentation",
            "Assessment and plan documented"
        ]
    })


@tool
def triage_patient_intake(symptoms: list[str], age: int, existing_conditions: list[str] = None) -> str:
    """Pre-appointment patient triage and intake screening.

    USE THIS TOOL WHEN: A patient is completing pre-visit intake and needs
    symptom screening, medical history collection, or urgency flagging
    before their scheduled appointment.
    DO NOT USE WHEN: The patient reports emergency symptoms (chest pain,
    difficulty breathing, severe bleeding) - direct to 911.

    Args:
        symptoms: List of reported symptoms
        age: Patient age
        existing_conditions: List of pre-existing conditions

    Returns:
        JSON with triage priority, intake summary, and clinical flags
    """
    emergency_keywords = ["chest pain", "difficulty breathing", "severe bleeding",
                          "loss of consciousness", "stroke"]
    is_emergency = any(kw in " ".join(symptoms).lower() for kw in emergency_keywords)
    return json.dumps({
        "triage_priority": "EMERGENCY - CALL 911" if is_emergency else
                          random.choice(["Low", "Medium", "High"]),
        "intake_summary": {
            "age": age,
            "reported_symptoms": symptoms,
            "existing_conditions": existing_conditions or [],
            "allergies_verified": False
        },
        "clinical_flags": ["Review medication interactions"] if existing_conditions else [],
        "estimated_wait": "N/A" if is_emergency else f"{random.randint(10, 45)} minutes"
    })


@tool
def match_clinical_trials(condition: str, age: int, location: str = "San Antonio") -> str:
    """Match patients with active clinical trials at UT Health San Antonio.

    USE THIS TOOL WHEN: A patient or physician wants to find eligible clinical
    trials for a specific condition at South Texas Medical Center institutions.
    DO NOT USE WHEN: The user needs treatment advice or medication recommendations.

    Args:
        condition: Medical condition for trial matching
        age: Patient age
        location: Preferred location (default: San Antonio)

    Returns:
        JSON with matching trials, eligibility criteria, and enrollment contact
    """
    return json.dumps({
        "matching_trials": [
            {"trial_id": f"NCT{random.randint(10000000, 99999999)}",
             "title": f"Phase {random.choice(['II', 'III'])} Study of Novel {condition} Treatment",
             "institution": "UT Health San Antonio",
             "status": "Actively Recruiting",
             "phase": random.choice(["Phase II", "Phase III"]),
             "compensation": f"${random.randint(50, 500)} per visit"}
        ],
        "enrollment_contact": "UT Health Clinical Trials Office, (210) 567-1940",
        "clinicaltrials_gov_url": "https://clinicaltrials.gov"
    })


@tool
def anonymize_phi_data(data_description: str, record_count: int = 100) -> str:
    """Anonymize and scrub Protected Health Information from datasets.

    USE THIS TOOL WHEN: A hospital data team needs to de-identify patient
    datasets for secondary AI training, research, or operational analytics
    in compliance with HIPAA Safe Harbor or Expert Determination methods.
    DO NOT USE WHEN: The data contains real PHI being processed - this tool
    provides methodology guidance only.

    Args:
        data_description: Description of the dataset to be anonymized
        record_count: Number of records in the dataset

    Returns:
        JSON with anonymization plan, HIPAA compliance checklist, and tools
    """
    return json.dumps({
        "anonymization_method": "HIPAA Safe Harbor (18 identifiers removed)",
        "identifiers_to_remove": [
            "Names", "Geographic data (below state level)", "Dates (except year)",
            "Phone/fax numbers", "Email addresses", "SSN", "MRN",
            "Health plan numbers", "Account numbers", "Certificate/license numbers",
            "Vehicle identifiers", "Device identifiers", "URLs", "IP addresses",
            "Biometric identifiers", "Full-face photos", "Any unique identifier"
        ],
        "record_count": record_count,
        "estimated_processing_time": f"{max(1, record_count // 1000)} minutes",
        "compliance_checklist": ["Remove all 18 HIPAA identifiers",
                                 "Apply k-anonymity (k >= 5)",
                                 "Document de-identification methodology",
                                 "Retain re-identification key in secure vault"]
    })


@tool
def predict_hospital_bed_availability(facility: str = "BAMC", time_horizon_hours: int = 24) -> str:
    """Predict ICU and acute bed availability at SA Level 1 Trauma Centers.

    USE THIS TOOL WHEN: Hospital administrators need real-time bed availability
    predictions for Brooke Army Medical Center or other SA trauma centers
    to optimize patient flow and discharge planning.
    DO NOT USE WHEN: A patient needs emergency placement (call facility directly).

    Args:
        facility: Hospital facility code (BAMC, UHS, Methodist)
        time_horizon_hours: Prediction horizon in hours (max 72)

    Returns:
        JSON with bed predictions, occupancy trends, and discharge forecasts
    """
    return json.dumps({
        "facility": facility,
        "current_occupancy": {
            "icu_beds": {"total": 40, "occupied": random.randint(28, 38),
                        "available": random.randint(2, 12)},
            "acute_beds": {"total": 200, "occupied": random.randint(150, 190),
                          "available": random.randint(10, 50)}
        },
        "prediction": {
            "horizon_hours": time_horizon_hours,
            "predicted_discharges": random.randint(8, 25),
            "predicted_admissions": random.randint(5, 20),
            "confidence": 0.85
        }
    })


@tool
def track_medicare_diabetes(patient_a1c: float, zip_code: str = "78229") -> str:
    """Track Medicare diabetes management against SA CHNA benchmarks.

    USE THIS TOOL WHEN: A care coordinator needs to identify high-risk Medicare
    beneficiaries with diabetes in San Antonio, compare against Community Health
    Needs Assessment metrics, or plan proactive interventions.
    DO NOT USE WHEN: The patient needs immediate medical care.

    Args:
        patient_a1c: Patient's most recent A1C value
        zip_code: Patient's ZIP code for CHNA comparison

    Returns:
        JSON with risk assessment, CHNA benchmarks, and intervention plan
    """
    risk = "High" if patient_a1c > 9.0 else "Medium" if patient_a1c > 7.5 else "Low"
    return json.dumps({
        "patient_a1c": patient_a1c,
        "risk_level": risk,
        "chna_benchmark": {
            "sa_diabetes_prevalence": "14.2%",
            "sa_a1c_average": 7.8,
            "national_average": 7.2
        },
        "intervention_plan": [
            "Monthly A1C monitoring" if risk == "High" else "Quarterly A1C monitoring",
            "Diabetes self-management education referral",
            "Nutritionist consultation",
            "Medication therapy management review"
        ] if risk != "Low" else ["Continue current management", "Annual screening"],
        "local_resources": ["SA Diabetes Association", "University Health Diabetes Clinic"]
    })


@tool
def route_telehealth_whim(symptoms: list[str], urgency: str = "routine", location: str = "rural") -> str:
    """Route non-emergent patients to telehealth via WHIM model.

    USE THIS TOOL WHEN: A patient in the SA metro or surrounding rural area
    has non-emergent symptoms that can be handled via telehealth, reducing
    unnecessary ER visits and uncompensated care.
    DO NOT USE WHEN: The patient has emergency symptoms requiring in-person care.

    Args:
        symptoms: List of patient symptoms
        urgency: Urgency level (routine, semi_urgent, urgent)
        location: Patient location context (urban, suburban, rural)

    Returns:
        JSON with routing decision, telehealth provider, and appointment scheduling
    """
    return json.dumps({
        "routing_decision": "Telehealth" if urgency != "urgent" else "In-Person",
        "telehealth_provider": {
            "service": "University Health Telehealth",
            "next_available": f"Today, {random.randint(1, 4)} hours",
            "cost": "$0-$25 copay (most insurance accepted)"
        },
        "estimated_er_savings": "$1,200-$2,800 per diverted visit",
        "follow_up": "PCP follow-up within 48 hours if symptoms persist"
    })


@tool
def optimize_nursing_schedule(unit: str, census_forecast: int, staff_available: int) -> str:
    """Generate optimized nursing shift schedules based on patient census.

    USE THIS TOOL WHEN: A nurse manager needs to create shift schedules based
    on predicted patient volumes, ensuring adequate coverage while preventing
    staff burnout at SA healthcare facilities.
    DO NOT USE WHEN: The unit is in crisis staffing mode (contact staffing agency).

    Args:
        unit: Hospital unit name (ICU, Med-Surg, ED, etc.)
        census_forecast: Predicted patient census for the period
        staff_available: Number of nursing staff available

    Returns:
        JSON with optimized schedule, ratios, and burnout risk assessment
    """
    ratio = round(census_forecast / max(staff_available, 1), 1)
    safe_ratio = {"ICU": 2.0, "Med-Surg": 5.0, "ED": 4.0}.get(unit, 4.0)
    return json.dumps({
        "unit": unit,
        "schedule": {
            "day_shift": {"staff": staff_available // 2, "hours": "0700-1900"},
            "night_shift": {"staff": staff_available - staff_available // 2, "hours": "1900-0700"}
        },
        "nurse_patient_ratio": ratio,
        "safe_ratio_target": safe_ratio,
        "ratio_status": "SAFE" if ratio <= safe_ratio else "UNSAFE - Request Float",
        "burnout_risk": "Low" if ratio <= safe_ratio else "High",
        "recommendation": "Adequate staffing" if ratio <= safe_ratio
                         else f"Request {int((census_forecast / safe_ratio) - staff_available)} additional staff"
    })


# =============================================================================
# CATEGORY 5: TOURISM — Tourism, Hospitality & Events (10 tools)
# =============================================================================

@tool
def handle_hotel_inquiry(inquiry_type: str, guest_name: str = "Guest") -> str:
    """Handle routine hotel guest inquiries as virtual concierge.

    USE THIS TOOL WHEN: A hotel guest at a San Antonio property asks about
    checkout times, pool hours, restaurant recommendations, River Walk
    directions, or other standard hospitality inquiries.
    DO NOT USE WHEN: The guest reports an emergency, security issue, or
    maintenance problem requiring immediate human attention.

    Args:
        inquiry_type: Type of inquiry (checkout, pool, dining, riverwalk, parking, wifi)
        guest_name: Guest name for personalization

    Returns:
        JSON with response, recommendations, and follow-up options
    """
    responses = {
        "checkout": {"answer": "Checkout time is 11:00 AM. Late checkout until 2:00 PM available for $50.",
                    "action": "Would you like me to arrange late checkout?"},
        "pool": {"answer": "Pool hours are 7:00 AM - 10:00 PM. Towels available at poolside.",
                "action": "The hot tub closes at 9:00 PM."},
        "dining": {"answer": "Top nearby restaurants on the River Walk: Biga on the Banks, "
                           "Fig Tree, The Esquire Tavern.",
                  "action": "Shall I make a reservation?"},
        "riverwalk": {"answer": "The River Walk is accessible from the hotel lobby level. "
                              "Walk south 2 blocks to reach the main tourist section.",
                     "action": "Rio San Antonio Cruises depart every 20 minutes nearby."},
    }
    resp = responses.get(inquiry_type, {"answer": "Let me connect you with the front desk.",
                                         "action": "Transferring..."})
    return json.dumps({"guest": guest_name, **resp,
                       "satisfaction_survey": "Rate this interaction: 1-5"})


@tool
def optimize_hotel_pricing(event_data: dict = None, competitor_rates: list[float] = None, weather: str = "clear") -> str:
    """Dynamically adjust hotel room rates based on events, weather, and demand.

    USE THIS TOOL WHEN: A hotel revenue manager needs real-time pricing
    recommendations based on local events, competitor rates, and weather
    forecasts in San Antonio.
    DO NOT USE WHEN: The hotel has fixed-rate contracts in place.

    Args:
        event_data: Dict with event name and expected attendance
        competitor_rates: List of competitor room rates
        weather: Weather forecast (clear, rain, severe)

    Returns:
        JSON with pricing recommendation, demand forecast, and yield analysis
    """
    if event_data is None:
        event_data = {"event": "Fiesta San Antonio", "attendance": 75000}
    base_rate = 149
    event_multiplier = 1.0 + (event_data.get("attendance", 0) / 100000)
    weather_adj = 0.9 if weather == "severe" else 1.0
    recommended = round(base_rate * event_multiplier * weather_adj, 2)
    return json.dumps({
        "base_rate": base_rate,
        "recommended_rate": recommended,
        "multiplier_breakdown": {
            "event_impact": f"+{(event_multiplier - 1) * 100:.0f}%",
            "weather_impact": f"{(weather_adj - 1) * 100:+.0f}%"
        },
        "demand_forecast": "High" if event_multiplier > 1.3 else "Medium",
        "competitor_avg": f"${sum(competitor_rates or [159, 175, 189]) / len(competitor_rates or [159, 175, 189]):.0f}"
    })


@tool
def orchestrate_convention_event(event_name: str, attendees: int, days: int = 1) -> str:
    """Orchestrate events at the Henry B. Gonzalez Convention Center.

    USE THIS TOOL WHEN: An event planner needs help with floor plans, AV
    scheduling, vendor logistics, or room configurations at the SA Convention Center.
    DO NOT USE WHEN: The event is at a private venue or outside San Antonio.

    Args:
        event_name: Name of the event
        attendees: Expected number of attendees
        days: Number of event days

    Returns:
        JSON with floor plan recommendations, AV needs, and vendor assignments
    """
    halls = ["Stars at Night Ballroom", "Hemisfair Ballroom", "Lila Cockrell Theatre"]
    recommended_hall = halls[0] if attendees > 3000 else halls[1] if attendees > 500 else halls[2]
    return json.dumps({
        "event_name": event_name,
        "recommended_venue": recommended_hall,
        "capacity": attendees,
        "floor_plan": {
            "layout": "Theater" if attendees > 1000 else "Banquet",
            "breakout_rooms": max(1, attendees // 200),
            "registration_area": "Main Lobby"
        },
        "av_requirements": {
            "main_stage": "LED wall + PA system",
            "breakout_rooms": "Projector + wireless mic",
            "recording": "Available ($2,500/day)"
        },
        "estimated_cost": f"${attendees * random.randint(15, 45):,}",
        "contact": "Convention Center Events, (210) 207-8500"
    })


@tool
def rebook_delayed_flight(flight_number: str, delay_minutes: int, guest_hotel: str = "") -> str:
    """Autonomously rebook travel for delayed flights at SA International Airport.

    USE THIS TOOL WHEN: A traveler has a delayed or cancelled flight at
    San Antonio International Airport (SAT) and needs automatic rebooking,
    hotel extension, and rental car adjustments.
    DO NOT USE WHEN: The delay is under 30 minutes or the airport is not SAT.

    Args:
        flight_number: Flight number
        delay_minutes: Length of delay in minutes
        guest_hotel: Hotel name if stay extension needed

    Returns:
        JSON with rebooking options, hotel extension, and transportation adjustments
    """
    return json.dumps({
        "flight": flight_number,
        "delay_minutes": delay_minutes,
        "rebooking_options": [
            {"flight": f"AA{random.randint(1000, 9999)}", "departure": _future_date(0, 1),
             "status": "Available", "fare_difference": "$0 (same-day rebooking)"},
            {"flight": f"UA{random.randint(1000, 9999)}", "departure": _future_date(0, 1),
             "status": "Available", "fare_difference": "$75"}
        ],
        "hotel_extension": {"hotel": guest_hotel or "Marriott Rivercenter",
                           "extended_checkout": "Next day, 2:00 PM", "cost": "$0 (airline covered)"}
                           if delay_minutes > 240 else None,
        "airport_info": {"terminal": "Terminal B", "gate_changes": "Check monitors",
                        "sat_customer_service": "(210) 207-3411"}
    })


@tool
def recommend_gastronomy(cuisine_preference: str, budget: str = "moderate", language: str = "en") -> str:
    """Provide multilingual gastronomy recommendations for SA UNESCO Creative City.

    USE THIS TOOL WHEN: A tourist (including international visitors) wants
    culturally accurate, personalized dining recommendations in San Antonio,
    leveraging its UNESCO Creative City of Gastronomy designation.
    DO NOT USE WHEN: The user needs restaurant health inspection data
    (use health inspection tool).

    Args:
        cuisine_preference: Type of cuisine (Tex-Mex, BBQ, fine_dining, street_food, etc.)
        budget: Budget level (budget, moderate, upscale)
        language: Response language code (en, es, de, fr, ja, zh)

    Returns:
        JSON with restaurant recommendations and cultural context
    """
    restaurants = {
        "Tex-Mex": [{"name": "Mi Tierra Cafe", "area": "Market Square", "price": "$$"},
                    {"name": "La Gloria", "area": "Pearl", "price": "$$"}],
        "BBQ": [{"name": "2M Smokehouse", "area": "Southside", "price": "$$"},
                {"name": "The Granary", "area": "Pearl", "price": "$$$"}],
        "fine_dining": [{"name": "Mixtli", "area": "Southtown", "price": "$$$$"},
                       {"name": "Biga on the Banks", "area": "River Walk", "price": "$$$$"}],
    }
    picks = restaurants.get(cuisine_preference, restaurants["Tex-Mex"])
    return json.dumps({
        "recommendations": picks,
        "cultural_note": "San Antonio was designated a UNESCO Creative City of Gastronomy "
                        "in 2017, the first US city to receive this honor.",
        "language": language,
        "local_tip": "Visit the Pearl Farmers Market on Saturday mornings for the best local produce."
    })


@tool
def predict_housekeeping_maintenance(room_number: str, sensor_data: dict = None) -> str:
    """Predict room maintenance needs from IoT sensor data.

    USE THIS TOOL WHEN: A hotel maintenance manager needs to proactively
    identify rooms with potential HVAC, plumbing, or electrical issues
    before guests experience problems.
    DO NOT USE WHEN: There is an active emergency (fire, flood, gas leak).

    Args:
        room_number: Hotel room number
        sensor_data: Dict with HVAC temp, water flow, power consumption readings

    Returns:
        JSON with maintenance predictions and dispatch recommendations
    """
    if sensor_data is None:
        sensor_data = {"hvac_temp": 74, "water_flow_gpm": 2.1, "power_kwh": 1.2}
    issues = []
    if sensor_data.get("hvac_temp", 72) > 78:
        issues.append({"issue": "HVAC inefficiency", "priority": "Medium",
                       "action": "Schedule filter replacement"})
    if sensor_data.get("water_flow_gpm", 2.0) > 3.0:
        issues.append({"issue": "Abnormal water flow", "priority": "High",
                       "action": "Inspect for leaks immediately"})
    return json.dumps({
        "room": room_number,
        "sensor_readings": sensor_data,
        "predicted_issues": issues or [{"issue": "None detected", "priority": "Low"}],
        "maintenance_dispatch": bool(issues),
        "guest_impact_risk": "High" if issues else "None"
    })


@tool
def navigate_fiesta_events(event_type: str = "parade", date: str = "") -> str:
    """Navigate Fiesta San Antonio events, routes, and logistics.

    USE THIS TOOL WHEN: A tourist or resident needs information about
    Fiesta San Antonio events, parade routes, street closures, parking,
    or food vendor locations during the annual festival.
    DO NOT USE WHEN: Fiesta is not currently in season (typically April).

    Args:
        event_type: Type of Fiesta event (parade, food, music, art, river_parade)
        date: Specific date of interest

    Returns:
        JSON with event details, routes, parking, and tips
    """
    return json.dumps({
        "event_type": event_type,
        "featured_events": [
            {"name": "Battle of Flowers Parade", "route": "Broadway to Alamo Plaza",
             "date": "Friday of Fiesta Week 1", "tip": "Arrive by 8 AM for good seats"},
            {"name": "Fiesta Flambeau Parade", "route": "Broadway (nighttime)",
             "date": "Saturday of Fiesta Week 2", "tip": "Largest illuminated parade in US"},
            {"name": "NIOSA (Night in Old San Antonio)", "location": "La Villita",
             "date": "Tue-Fri of Fiesta Week 1", "tip": "Book tickets online in advance"}
        ],
        "parking": [
            {"lot": "Alamodome Lot", "price": "$20", "shuttle": True},
            {"lot": "VIA Park & Ride", "price": "$5", "shuttle": True}
        ],
        "street_closures": ["Broadway (8 AM - 6 PM)", "Commerce St (parade route)",
                           "Alamo Plaza (all day)"],
        "fiesta_url": "https://www.fiesta-sa.org"
    })


@tool
def generate_mission_tour(latitude: float, longitude: float, tour_style: str = "historical") -> str:
    """Generate GPS-aware audio tour content for SA Missions and the Alamo.

    USE THIS TOOL WHEN: A tourist wants a dynamic, location-aware historical
    tour of the Alamo, Mission San Jose, Mission Concepcion, or other
    San Antonio Missions World Heritage sites.
    DO NOT USE WHEN: The user is not physically near the missions.

    Args:
        latitude: User's GPS latitude
        longitude: User's GPS longitude
        tour_style: Tour style (historical, architectural, family_friendly)

    Returns:
        JSON with location-specific tour content and navigation to next stop
    """
    missions = [
        {"name": "The Alamo", "lat": 29.4260, "lon": -98.4861,
         "narrative": "Built in 1718 as Mission San Antonio de Valero, the Alamo "
                     "became the site of the legendary 1836 battle. The 13-day siege..."},
        {"name": "Mission San Jose", "lat": 29.3601, "lon": -98.4792,
         "narrative": "Founded in 1720, Mission San Jose is known as the 'Queen of "
                     "the Missions.' Its Rose Window is considered one of the finest..."},
        {"name": "Mission Concepcion", "lat": 29.3897, "lon": -98.4917,
         "narrative": "The oldest unrestored stone church in America, built in 1755. "
                     "The original frescos are still visible on the interior walls..."},
    ]
    closest = min(missions, key=lambda m: abs(m["lat"] - latitude) + abs(m["lon"] - longitude))
    return json.dumps({
        "current_location": {"lat": latitude, "lon": longitude},
        "nearest_mission": closest["name"],
        "audio_narrative": closest["narrative"],
        "tour_style": tour_style,
        "next_stop": missions[(missions.index(closest) + 1) % len(missions)]["name"],
        "unesco_note": "The San Antonio Missions were inscribed as a UNESCO World Heritage "
                      "Site in 2015, the first in Texas."
    })


@tool
def generate_vip_upsell(guest_profile: dict = None) -> str:
    """Generate personalized VIP upsell offers for hotel guests.

    USE THIS TOOL WHEN: A hotel revenue team wants to create personalized
    pre-arrival upsell emails based on guest booking history and demographics.
    DO NOT USE WHEN: The guest has opted out of marketing communications.

    Args:
        guest_profile: Dict with booking history, preferences, loyalty tier

    Returns:
        JSON with personalized upsell offers and email template
    """
    if guest_profile is None:
        guest_profile = {"loyalty_tier": "Gold", "past_stays": 3, "preferred_room": "King Suite"}
    offers = [
        {"offer": "River View Upgrade", "value": "$75/night",
         "conversion_rate": "34%"},
        {"offer": "Spa Package: Couples Massage", "value": "$250",
         "conversion_rate": "22%"},
        {"offer": "Late Checkout + Breakfast Bundle", "value": "$95",
         "conversion_rate": "45%"}
    ]
    return json.dumps({
        "guest_profile": guest_profile,
        "recommended_offers": offers[:2],
        "email_subject": f"Welcome Back! Your Exclusive {guest_profile.get('loyalty_tier', '')} Perks Await",
        "best_send_time": "3 days before arrival, 10:00 AM"
    })


@tool
def check_restaurant_inspection(restaurant_name: str, address: str = "") -> str:
    """Check Metro Health District inspection scores for SA restaurants.

    USE THIS TOOL WHEN: A tourist or resident wants to verify the cleanliness
    score and violation history of a San Antonio restaurant before dining.
    DO NOT USE WHEN: The restaurant is outside San Antonio city limits.

    Args:
        restaurant_name: Name of the restaurant
        address: Optional address for exact matching

    Returns:
        JSON with inspection score, violations, and health rating
    """
    score = random.randint(75, 100)
    violations = []
    if score < 90:
        violations = [
            {"type": "Temperature Control", "severity": "Minor",
             "corrected": True},
            {"type": "Surface Sanitization", "severity": "Minor",
             "corrected": True}
        ]
    return json.dumps({
        "restaurant": restaurant_name,
        "latest_inspection_date": _future_date(-30, -1),
        "health_score": score,
        "rating": "A" if score >= 90 else "B" if score >= 80 else "C",
        "violations": violations,
        "inspection_history": [
            {"date": _future_date(-180, -90), "score": random.randint(80, 100)},
            {"date": _future_date(-365, -180), "score": random.randint(78, 100)}
        ],
        "metro_health_url": "https://www.sanantonio.gov/Health/FoodLicensing"
    })


# =============================================================================
# Connect-360 / SmartSA Partner Tools
# =============================================================================


@tool
def search_sa_newcomer_resources(query: str, persona_type: str = "newcomer") -> str:
    """Search Connect-360 newcomer resources for people relocating to San Antonio.

    USE THIS TOOL WHEN: A user is moving to San Antonio and needs guidance on
    housing, utilities, schools, transit, business registration, or community resources.
    DO NOT USE WHEN: The user is already an established SA resident with a specific service issue.

    Args:
        query: The newcomer's question or need
        persona_type: newcomer, business_owner, parent, military, student

    Returns:
        JSON with relevant SmartSA partner resources and next steps
    """
    resources = {
        "newcomer": [
            {"partner": "City of San Antonio", "service": "311 Mobile App", "url": "https://www.sa.gov/311"},
            {"partner": "CPS Energy", "service": "New Service Application", "url": "https://www.cpsenergy.com"},
            {"partner": "SAWS", "service": "Water Service Setup", "url": "https://www.saws.org"},
            {"partner": "VIA Transit", "service": "Route Planning", "url": "https://www.viainfo.net"},
        ],
        "parent": [
            {"partner": "Pre-K 4 SA", "service": "Enrollment", "url": "https://www.prek4sa.com"},
            {"partner": "SAISD", "service": "School Finder", "url": "https://www.saisd.net"},
        ],
        "business_owner": [
            {"partner": "City of SA - DSD", "service": "Business Permits", "url": "https://www.sa.gov/DSD"},
            {"partner": "Bexar County", "service": "Tax Registration", "url": "https://www.bexar.org"},
        ],
    }
    return json.dumps({
        "query": query,
        "persona": persona_type,
        "smartsa_partners": ["City of SA", "CPS Energy", "SAWS", "VIA", "UTSA",
                             "Bexar County", "Edwards Aquifer", "Opportunity Home",
                             "SA River Authority", "Alamo Colleges"],
        "resources": resources.get(persona_type, resources["newcomer"]),
        "connect_360_profile_url": "https://connect360.sanantonio.gov/profile"
    })


@tool
def generate_onboarding_checklist(address: str, household_size: int = 1, has_children: bool = False, has_business: bool = False) -> str:
    """Generate a personalized relocation onboarding checklist for a new SA resident.

    USE THIS TOOL WHEN: A newcomer needs a comprehensive to-do list for moving to San Antonio.
    DO NOT USE WHEN: The user needs help with a single specific service, not broad onboarding.

    Args:
        address: New San Antonio address or ZIP code
        household_size: Number of people in household
        has_children: Whether household includes school-age children
        has_business: Whether the resident is also starting/moving a business

    Returns:
        JSON with prioritized checklist of onboarding tasks
    """
    checklist = [
        {"priority": 1, "task": "Set up CPS Energy service", "partner": "CPS Energy", "status": "pending"},
        {"priority": 2, "task": "Set up SAWS water service", "partner": "SAWS", "status": "pending"},
        {"priority": 3, "task": "Register for solid waste collection", "partner": "City of SA", "status": "pending"},
        {"priority": 4, "task": "Register to vote at new address", "partner": "Bexar County Elections", "status": "pending"},
        {"priority": 5, "task": "Update driver license to TX address", "partner": "TX DPS", "status": "pending"},
        {"priority": 6, "task": "File homestead exemption (if homeowner)", "partner": "BCAD", "status": "pending"},
    ]
    if has_children:
        checklist.insert(3, {"priority": 3, "task": "Enroll children in zoned school", "partner": "Local ISD", "status": "pending"})
    if has_business:
        checklist.append({"priority": 7, "task": "Register business with City of SA", "partner": "City of SA - DSD", "status": "pending"})
    return json.dumps({"address": address, "checklist": checklist, "estimated_completion": "5-7 business days"})


@tool
def analyze_saws_usage(account_id: str = "", address: str = "") -> str:
    """Analyze San Antonio Water System usage patterns and identify savings.

    USE THIS TOOL WHEN: A resident wants to understand their water bill, detect leaks,
    or compare SAWS rate plans.
    DO NOT USE WHEN: The question is about CPS Energy (electric/gas) rather than water.

    Args:
        account_id: SAWS account number
        address: Service address

    Returns:
        JSON with usage analysis, tier breakdown, and conservation recommendations
    """
    monthly_gallons = random.randint(3000, 12000)
    tier = "Tier 1" if monthly_gallons < 5000 else "Tier 2" if monthly_gallons < 9000 else "Tier 3"
    return json.dumps({
        "account": account_id or "SAWS-DEMO",
        "monthly_usage_gallons": monthly_gallons,
        "current_tier": tier,
        "monthly_estimate": round(monthly_gallons * 0.008 + 18.50, 2),
        "leak_detected": monthly_gallons > 10000,
        "conservation_tips": [
            "Install low-flow showerheads (SAWS rebate: $10 each)",
            "Convert to drought-resistant landscaping (WaterSaver coupon: up to $200)",
            "Fix running toilets (saves 200 gal/day)",
        ],
        "drought_stage": "Stage 1",
        "watering_days": "Once per week based on last digit of address"
    })


@tool
def check_drought_stage() -> str:
    """Check the current Edwards Aquifer drought stage and watering restrictions.

    USE THIS TOOL WHEN: A resident asks about watering restrictions, drought conditions,
    or Edwards Aquifer levels.
    DO NOT USE WHEN: The question is about general weather, not water restrictions.

    Returns:
        JSON with current aquifer level, drought stage, and restrictions
    """
    return json.dumps({
        "aquifer_level_ft": 665,
        "index_well": "J-17 (Bexar County)",
        "current_stage": "Stage 1 - Mild",
        "trigger_level": "660 ft (10-day avg)",
        "restrictions": [
            "Landscape watering: once per week on designated day",
            "No watering 10am-8pm",
            "Fountains must recirculate water",
            "Car washing: bucket or auto shutoff only"
        ],
        "next_stage_trigger": "Stage 2 at 650 ft",
        "eaa_url": "https://www.edwardsaquifer.org"
    })


@tool
def coordinate_utility_signup(address: str, services: list = None) -> str:
    """Coordinate simultaneous utility registrations for a new SA address.

    USE THIS TOOL WHEN: A newcomer needs to set up multiple utilities at once
    (CPS Energy, SAWS, solid waste, internet).
    DO NOT USE WHEN: The user only needs one specific utility.

    Args:
        address: The service address
        services: List of services needed (defaults to all)

    Returns:
        JSON with registration links, requirements, and estimated deposits
    """
    all_services = [
        {"utility": "CPS Energy", "type": "Electric & Gas", "deposit": 200,
         "url": "https://www.cpsenergy.com/newservice", "docs_needed": ["Photo ID", "Lease/deed"]},
        {"utility": "SAWS", "type": "Water & Wastewater", "deposit": 100,
         "url": "https://www.saws.org/service", "docs_needed": ["Photo ID", "Lease/deed"]},
        {"utility": "City of SA Solid Waste", "type": "Trash & Recycling", "deposit": 0,
         "url": "https://www.sa.gov/solidwaste", "docs_needed": ["Proof of residency"]},
    ]
    return json.dumps({
        "address": address,
        "services": all_services,
        "total_estimated_deposits": 300,
        "pro_tip": "CPS Energy and SAWS can often be started online in under 10 minutes each"
    })


@tool
def estimate_utility_costs(address: str, sqft: int = 1500, household_size: int = 2) -> str:
    """Estimate monthly utility costs for a San Antonio address.

    USE THIS TOOL WHEN: A prospective resident wants to budget for utility costs.

    Args:
        address: SA address or ZIP code
        sqft: Square footage of the home
        household_size: Number of residents

    Returns:
        JSON with estimated monthly costs by utility
    """
    electric = round(sqft * 0.08 + household_size * 15, 2)
    water = round(25 + household_size * 12, 2)
    gas = round(20 + sqft * 0.01, 2)
    waste = 26.74
    return json.dumps({
        "address": address,
        "estimates": {
            "cps_electric": electric, "cps_gas": gas,
            "saws_water": water, "solid_waste": waste,
            "total_monthly": round(electric + water + gas + waste, 2)
        },
        "note": "Estimates based on average SA consumption. Actual costs vary by usage and season."
    })


@tool
def find_schools_by_address(address: str, grade_level: str = "any") -> str:
    """Find zoned public schools for a San Antonio address.

    USE THIS TOOL WHEN: A parent needs to know which schools serve their address
    or wants to compare school options.
    DO NOT USE WHEN: The question is about Pre-K 4 SA (use check_prek4sa_eligibility).

    Args:
        address: Residential address in San Antonio
        grade_level: elementary, middle, high, or any

    Returns:
        JSON with zoned schools, ratings, and transfer options
    """
    return json.dumps({
        "address": address,
        "isd": "North East ISD",
        "schools": [
            {"name": "Example Elementary", "grades": "PK-5", "rating": "A", "distance_mi": 0.8,
             "programs": ["Dual Language", "GT"]},
            {"name": "Example Middle School", "grades": "6-8", "rating": "B+", "distance_mi": 1.2,
             "programs": ["STEM Academy", "Athletics"]},
            {"name": "Example High School", "grades": "9-12", "rating": "A", "distance_mi": 2.1,
             "programs": ["IB Programme", "CTE", "Dual Credit"]},
        ],
        "magnet_options": ["Health Careers HS", "CAST Tech HS", "Young Women's Leadership Academy"],
        "mic3_note": "Military families: MIC3 guarantees immediate enrollment with flexible documentation"
    })


@tool
def compare_school_ratings(school_names: list = None, zip_code: str = "") -> str:
    """Compare school ratings and performance metrics across SA ISDs.

    USE THIS TOOL WHEN: A parent is comparing multiple schools to choose the best fit.

    Args:
        school_names: List of school names to compare
        zip_code: ZIP code to find schools in the area

    Returns:
        JSON with comparative school data
    """
    return json.dumps({
        "comparison": [
            {"name": "School A (NEISD)", "tea_rating": "A", "student_teacher_ratio": "15:1",
             "college_readiness": "82%", "avg_sat": 1180},
            {"name": "School B (NISD)", "tea_rating": "A", "student_teacher_ratio": "18:1",
             "college_readiness": "78%", "avg_sat": 1150},
        ],
        "data_source": "Texas Education Agency (TEA) 2025 Accountability Ratings"
    })


@tool
def search_sa_neighborhoods(priorities: list = None, budget_max: int = 350000) -> str:
    """Search and rank SA neighborhoods by resident priorities.

    USE THIS TOOL WHEN: A newcomer wants to compare neighborhoods for housing.

    Args:
        priorities: List like ["good schools", "low crime", "short commute"]
        budget_max: Maximum home purchase price

    Returns:
        JSON with ranked neighborhood recommendations
    """
    neighborhoods = [
        {"name": "Alamo Heights", "median_price": 425000, "crime_score": "Low",
         "school_rating": "A+", "commute_downtown_min": 12, "walkability": 72},
        {"name": "Stone Oak", "median_price": 380000, "crime_score": "Low",
         "school_rating": "A", "commute_downtown_min": 25, "walkability": 35},
        {"name": "Helotes", "median_price": 340000, "crime_score": "Very Low",
         "school_rating": "A", "commute_downtown_min": 30, "walkability": 22},
        {"name": "Southtown/King William", "median_price": 350000, "crime_score": "Medium",
         "school_rating": "B+", "commute_downtown_min": 5, "walkability": 85},
        {"name": "Converse", "median_price": 260000, "crime_score": "Low",
         "school_rating": "B+", "commute_downtown_min": 22, "walkability": 28},
    ]
    filtered = [n for n in neighborhoods if n["median_price"] <= budget_max]
    return json.dumps({"budget": budget_max, "neighborhoods": filtered or neighborhoods[:3]})


@tool
def estimate_housing_costs(address: str = "", zip_code: str = "78209") -> str:
    """Estimate total housing costs including taxes, HOA, and insurance for an SA area.

    USE THIS TOOL WHEN: A buyer/renter wants full monthly cost estimates.

    Args:
        address: Specific address or general area
        zip_code: ZIP code for area estimates

    Returns:
        JSON with comprehensive housing cost breakdown
    """
    home_value = random.randint(200000, 500000)
    tax_rate = 2.45
    return json.dumps({
        "zip_code": zip_code,
        "median_home_value": home_value,
        "estimated_monthly": {
            "mortgage_30yr": round(home_value * 0.0055, 2),
            "property_tax": round(home_value * tax_rate / 100 / 12, 2),
            "homeowners_insurance": round(home_value * 0.004 / 12, 2),
            "hoa_typical": 75,
        },
        "median_rent_1br": 1100, "median_rent_2br": 1400, "median_rent_3br": 1800,
        "homestead_exemption_savings": round(home_value * 0.20 * tax_rate / 100 / 12, 2)
    })


@tool
def check_housing_eligibility(household_size: int = 1, annual_income: float = 35000) -> str:
    """Check eligibility for Opportunity Home SA affordable housing programs.

    USE THIS TOOL WHEN: A resident needs affordable housing assistance, Section 8,
    or public housing information.

    Args:
        household_size: Number of people in household
        annual_income: Total annual household income

    Returns:
        JSON with eligibility determination and available programs
    """
    ami_limits = {1: 46700, 2: 53350, 3: 60000, 4: 66650}
    limit = ami_limits.get(min(household_size, 4), 66650)
    eligible = annual_income <= limit
    return json.dumps({
        "eligible": eligible,
        "income_limit_80_ami": limit,
        "your_income": annual_income,
        "programs": [
            {"name": "Housing Choice Voucher (Section 8)", "waitlist": "Open - 6-12 month wait",
             "contact": "210-477-6000"},
            {"name": "Public Housing Communities", "waitlist": "Limited availability",
             "contact": "210-477-6000"},
            {"name": "Homebuyer Education Program", "waitlist": "Enrolling now",
             "contact": "210-477-6100"},
        ] if eligible else [],
        "opportunity_home_url": "https://www.opportunityhomesa.com"
    })


@tool
def search_affordable_housing(zip_code: str = "", bedrooms: int = 2) -> str:
    """Search available affordable housing units in San Antonio.

    USE THIS TOOL WHEN: A resident is looking for income-restricted housing options.

    Args:
        zip_code: Preferred ZIP code area
        bedrooms: Number of bedrooms needed

    Returns:
        JSON with available affordable housing listings
    """
    return json.dumps({
        "available_units": [
            {"property": "Wheatley Courts", "type": "Public Housing", "bedrooms": bedrooms,
             "rent": f"Income-based (30% of income)", "area": "East Side"},
            {"property": "Gardens of San Juan", "type": "Tax Credit", "bedrooms": bedrooms,
             "rent": "$875/mo", "area": "South Side"},
        ],
        "down_payment_assistance": [
            {"program": "City of SA DPAL", "amount": "Up to $15,000", "url": "https://www.sa.gov/NHSD"},
            {"program": "TSAHC", "amount": "Up to 5% of loan", "url": "https://www.tsahc.org"},
        ]
    })


@tool
def check_aquifer_level() -> str:
    """Check current Edwards Aquifer water levels and drought stage.

    USE THIS TOOL WHEN: A user asks about aquifer levels, water conservation mandates,
    or Edwards Aquifer Authority regulations.

    Returns:
        JSON with current aquifer data and conservation status
    """
    return json.dumps({
        "j17_level_ft": 665.2,
        "j27_level_ft": 875.8,
        "current_stage": "Stage 1",
        "stage_description": "Mild - Voluntary and mandatory conservation measures",
        "stage_thresholds": {
            "normal": "Above 660 ft", "stage_1": "660 ft",
            "stage_2": "650 ft", "stage_3": "640 ft",
            "stage_4": "630 ft", "stage_5": "620 ft"
        },
        "eaa_url": "https://www.edwardsaquifer.org/aquifer-levels"
    })


@tool
def lookup_conservation_rebates(rebate_type: str = "all") -> str:
    """Look up available water conservation rebates from SAWS and EAA.

    USE THIS TOOL WHEN: A resident wants to save money on water through rebates.

    Args:
        rebate_type: irrigation, fixtures, rainwater, or all

    Returns:
        JSON with available rebate programs
    """
    return json.dumps({
        "saws_rebates": [
            {"program": "WaterSaver Landscape Coupon", "amount": "Up to $200", "for": "Xeriscaping conversion"},
            {"program": "Irrigation System Checkup", "amount": "Free audit", "for": "Sprinkler efficiency"},
            {"program": "Pool Cover Rebate", "amount": "$100", "for": "Evaporation reduction"},
            {"program": "Rainwater Harvesting", "amount": "Up to $400", "for": "Collection systems"},
        ],
        "eaa_rebates": [
            {"program": "Agricultural Conservation", "amount": "Varies", "for": "Permit holders"},
        ],
        "apply_url": "https://www.saws.org/conservation"
    })


@tool
def check_flood_alerts(zip_code: str = "") -> str:
    """Check active San Antonio River Authority flood alerts and warnings.

    USE THIS TOOL WHEN: A resident asks about flooding, creek levels, or low-water crossings.

    Args:
        zip_code: ZIP code to check for localized alerts

    Returns:
        JSON with current flood status and warnings
    """
    return json.dumps({
        "active_alerts": [],
        "status": "No active flood warnings",
        "monitored_crossings": [
            {"location": "Olmos Basin", "status": "Normal", "level_ft": 2.1},
            {"location": "San Pedro Creek", "status": "Normal", "level_ft": 1.8},
            {"location": "Salado Creek at Southton Rd", "status": "Normal", "level_ft": 3.2},
        ],
        "turn_around_dont_drown": False,
        "sara_url": "https://www.sariverauthority.org/flood"
    })


@tool
def lookup_floodplain_status(address: str) -> str:
    """Determine if a San Antonio property is in a FEMA floodplain.

    USE THIS TOOL WHEN: A buyer or homeowner needs to know flood insurance requirements.

    Args:
        address: Property address to check

    Returns:
        JSON with floodplain determination and insurance guidance
    """
    zones = ["X (Minimal Risk)", "AE (100-year)", "A (100-year)", "X500 (500-year)"]
    zone = random.choice(zones)
    return json.dumps({
        "address": address,
        "fema_zone": zone,
        "flood_insurance_required": "AE" in zone or zone.startswith("A "),
        "estimated_annual_premium": "$450-$1,200" if "AE" in zone else "Not required (but recommended)",
        "last_firm_update": "2024-06-15",
        "sara_watershed": "San Antonio River Basin",
        "check_map_url": "https://msc.fema.gov/portal/search"
    })


@tool
def calculate_property_tax(property_value: float, address: str = "") -> str:
    """Calculate estimated property taxes for a Bexar County property.

    USE THIS TOOL WHEN: A homeowner or buyer wants to know their property tax obligation
    across all overlapping taxing jurisdictions.

    Args:
        property_value: Appraised or market value of the property
        address: Property address for jurisdiction lookup

    Returns:
        JSON with tax breakdown by jurisdiction
    """
    jurisdictions = [
        {"entity": "City of San Antonio", "rate": 0.5581},
        {"entity": "Bexar County", "rate": 0.2685},
        {"entity": "NEISD", "rate": 1.2042},
        {"entity": "Alamo Colleges", "rate": 0.1490},
        {"entity": "University Health", "rate": 0.2276},
        {"entity": "SA River Authority", "rate": 0.0188},
    ]
    total_rate = sum(j["rate"] for j in jurisdictions)
    total_tax = round(property_value * total_rate / 100, 2)
    homestead_savings = round(property_value * 0.20 * total_rate / 100, 2)
    for j in jurisdictions:
        j["annual_tax"] = round(property_value * j["rate"] / 100, 2)
    return json.dumps({
        "property_value": property_value,
        "total_rate_per_100": round(total_rate, 4),
        "annual_tax": total_tax,
        "monthly_tax": round(total_tax / 12, 2),
        "jurisdictions": jurisdictions,
        "homestead_exemption_savings": homestead_savings,
        "protest_deadline": "May 15 (or 30 days after notice)",
        "bcad_url": "https://www.bcad.org"
    })


@tool
def check_exemption_eligibility(owner_type: str = "homeowner", age: int = 35, veteran: bool = False, disabled: bool = False) -> str:
    """Check eligibility for Bexar County property tax exemptions.

    USE THIS TOOL WHEN: A property owner wants to reduce their tax burden.

    Args:
        owner_type: homeowner or business
        age: Owner's age
        veteran: Whether owner is a veteran
        disabled: Whether owner has a disability

    Returns:
        JSON with eligible exemptions and filing instructions
    """
    exemptions = [{"name": "General Homestead", "savings": "20% off school taxes + $5,000 off other", "eligible": True}]
    if age >= 65:
        exemptions.append({"name": "Over-65 Homestead", "savings": "$10,000 additional school exemption + tax ceiling", "eligible": True})
    if veteran:
        exemptions.append({"name": "Disabled Veteran", "savings": "$5,000-$12,000 based on disability %", "eligible": True})
    if disabled:
        exemptions.append({"name": "Disability Homestead", "savings": "$10,000 additional + tax ceiling", "eligible": True})
    return json.dumps({
        "exemptions": exemptions,
        "filing_deadline": "April 30 (one-time filing, no renewal needed)",
        "file_online": "https://www.bcad.org/exemptions",
        "required_docs": ["Photo ID", "Proof of residency", "Vehicle registration"]
    })


@tool
def check_voter_registration(name: str = "", address: str = "") -> str:
    """Check voter registration status in Bexar County.

    USE THIS TOOL WHEN: A resident wants to verify they are registered to vote,
    register for the first time, or update their address.

    Args:
        name: Resident's full name
        address: Current residential address

    Returns:
        JSON with registration status and relevant election info
    """
    return json.dumps({
        "status": "Not found - Registration recommended",
        "register_online": "https://www.votetexas.gov/register-to-vote",
        "register_in_person": "Bexar County Elections, 1103 S Frio St, SA TX 78207",
        "deadline_next_election": "30 days before election day",
        "council_district": random.randint(1, 10),
        "county_precinct": random.randint(1, 4),
        "state_house_district": random.choice([116, 117, 118, 119, 120, 121, 122, 123, 124, 125]),
        "elections_office": "210-335-8683",
        "bexar_elections_url": "https://www.bexar.org/elections"
    })


@tool
def find_polling_location(address: str) -> str:
    """Find the nearest polling location and early voting sites in Bexar County.

    USE THIS TOOL WHEN: A voter wants to know where to cast their ballot.

    Args:
        address: Voter's residential address

    Returns:
        JSON with polling locations and voting information
    """
    return json.dumps({
        "election_day_location": {
            "name": "Example Community Center",
            "address": "1234 Example St, San Antonio TX 78201",
            "hours": "7:00 AM - 7:00 PM"
        },
        "early_voting_sites": [
            {"name": "Bexar County Elections HQ", "address": "1103 S Frio St", "hours": "8am-6pm"},
            {"name": "Wonderland of the Americas Mall", "address": "4522 Fredericksburg Rd", "hours": "8am-6pm"},
        ],
        "vote_by_mail_eligible": "Only if 65+, disabled, or absent from county",
        "sample_ballot_url": "https://www.bexar.org/elections/sample-ballot",
        "whats_on_ballot": "Visit https://www.vote411.org for candidate info"
    })


# =============================================================================
# Tool registry for easy access
# =============================================================================

ALL_TOOLS = {
    # Civic
    "search_sa_311_infrastructure": search_sa_311_infrastructure,
    "optimize_cps_energy_rate": optimize_cps_energy_rate,
    "check_sa_property_code": check_sa_property_code,
    "triage_dangerous_animal": triage_dangerous_animal,
    "coordinate_tnr_program": coordinate_tnr_program,
    "resolve_municipal_citation": resolve_municipal_citation,
    "check_prek4sa_eligibility": check_prek4sa_eligibility,
    "optimize_via_transit_route": optimize_via_transit_route,
    "track_solid_waste_schedule": track_solid_waste_schedule,
    "synthesize_sa_policy": synthesize_sa_policy,
    # Business
    "match_sbeda_procurement": match_sbeda_procurement,
    "draft_revitalize_sa_grant": draft_revitalize_sa_grant,
    "navigate_buildsa_permits": navigate_buildsa_permits,
    "check_historic_preservation": check_historic_preservation,
    "prepare_vita_taxes": prepare_vita_taxes,
    "analyze_bexar_commercial_realestate": analyze_bexar_commercial_realestate,
    "generate_b2b_leads": generate_b2b_leads,
    "check_food_truck_compliance": check_food_truck_compliance,
    "find_disaster_recovery_funding": find_disaster_recovery_funding,
    "generate_social_commerce_catalog": generate_social_commerce_catalog,
    # Military
    "translate_military_resume": translate_military_resume,
    "draft_va_nexus_letter": draft_va_nexus_letter,
    "match_workforce_solutions": match_workforce_solutions,
    "build_military_spouse_resume": build_military_spouse_resume,
    "compare_tricare_plans": compare_tricare_plans,
    "match_clearance_jobs": match_clearance_jobs,
    "generate_mic3_waiver": generate_mic3_waiver,
    "draft_skillbridge_application": draft_skillbridge_application,
    "optimize_gi_bill_hazelwood": optimize_gi_bill_hazelwood,
    "simulate_supply_chain_transition": simulate_supply_chain_transition,
    # Healthcare
    "format_clinical_notes": format_clinical_notes,
    "process_insurance_referral": process_insurance_referral,
    "validate_medical_codes": validate_medical_codes,
    "triage_patient_intake": triage_patient_intake,
    "match_clinical_trials": match_clinical_trials,
    "anonymize_phi_data": anonymize_phi_data,
    "predict_hospital_bed_availability": predict_hospital_bed_availability,
    "track_medicare_diabetes": track_medicare_diabetes,
    "route_telehealth_whim": route_telehealth_whim,
    "optimize_nursing_schedule": optimize_nursing_schedule,
    # Tourism
    "handle_hotel_inquiry": handle_hotel_inquiry,
    "optimize_hotel_pricing": optimize_hotel_pricing,
    "orchestrate_convention_event": orchestrate_convention_event,
    "rebook_delayed_flight": rebook_delayed_flight,
    "recommend_gastronomy": recommend_gastronomy,
    "predict_housekeeping_maintenance": predict_housekeeping_maintenance,
    "navigate_fiesta_events": navigate_fiesta_events,
    "generate_mission_tour": generate_mission_tour,
    "generate_vip_upsell": generate_vip_upsell,
    "check_restaurant_inspection": check_restaurant_inspection,
    # Connect-360 / SmartSA tools
    "search_sa_newcomer_resources": search_sa_newcomer_resources,
    "generate_onboarding_checklist": generate_onboarding_checklist,
    "analyze_saws_usage": analyze_saws_usage,
    "check_drought_stage": check_drought_stage,
    "coordinate_utility_signup": coordinate_utility_signup,
    "estimate_utility_costs": estimate_utility_costs,
    "find_schools_by_address": find_schools_by_address,
    "compare_school_ratings": compare_school_ratings,
    "search_sa_neighborhoods": search_sa_neighborhoods,
    "estimate_housing_costs": estimate_housing_costs,
    "check_housing_eligibility": check_housing_eligibility,
    "search_affordable_housing": search_affordable_housing,
    "check_aquifer_level": check_aquifer_level,
    "lookup_conservation_rebates": lookup_conservation_rebates,
    "check_flood_alerts": check_flood_alerts,
    "lookup_floodplain_status": lookup_floodplain_status,
    "calculate_property_tax": calculate_property_tax,
    "check_exemption_eligibility": check_exemption_eligibility,
    "check_voter_registration": check_voter_registration,
    "find_polling_location": find_polling_location,
}

TOOLS_BY_CATEGORY = {
    "civic": [search_sa_311_infrastructure, optimize_cps_energy_rate, check_sa_property_code,
              triage_dangerous_animal, coordinate_tnr_program, resolve_municipal_citation,
              check_prek4sa_eligibility, optimize_via_transit_route, track_solid_waste_schedule,
              synthesize_sa_policy,
              # Connect-360 / SmartSA
              search_sa_newcomer_resources, generate_onboarding_checklist,
              analyze_saws_usage, check_drought_stage,
              coordinate_utility_signup, estimate_utility_costs,
              find_schools_by_address, compare_school_ratings,
              search_sa_neighborhoods, estimate_housing_costs,
              check_housing_eligibility, search_affordable_housing,
              check_aquifer_level, lookup_conservation_rebates,
              check_flood_alerts, lookup_floodplain_status,
              check_voter_registration, find_polling_location],
    "business": [match_sbeda_procurement, draft_revitalize_sa_grant, navigate_buildsa_permits,
                 check_historic_preservation, prepare_vita_taxes, analyze_bexar_commercial_realestate,
                 generate_b2b_leads, check_food_truck_compliance, find_disaster_recovery_funding,
                 generate_social_commerce_catalog,
                 calculate_property_tax, check_exemption_eligibility],
    "military": [translate_military_resume, draft_va_nexus_letter, match_workforce_solutions,
                 build_military_spouse_resume, compare_tricare_plans, match_clearance_jobs,
                 generate_mic3_waiver, draft_skillbridge_application, optimize_gi_bill_hazelwood,
                 simulate_supply_chain_transition],
    "healthcare": [format_clinical_notes, process_insurance_referral, validate_medical_codes,
                   triage_patient_intake, match_clinical_trials, anonymize_phi_data,
                   predict_hospital_bed_availability, track_medicare_diabetes,
                   route_telehealth_whim, optimize_nursing_schedule],
    "tourism": [handle_hotel_inquiry, optimize_hotel_pricing, orchestrate_convention_event,
                rebook_delayed_flight, recommend_gastronomy, predict_housekeeping_maintenance,
                navigate_fiesta_events, generate_mission_tour, generate_vip_upsell,
                check_restaurant_inspection],
}
