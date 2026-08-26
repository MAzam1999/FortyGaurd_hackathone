# Heat You Can't Avoid — Submission Summary

## 1. Project Overview

**Heat You Can't Avoid** is a heat-exposure decision-support application for people who cannot simply avoid extreme heat.

Traditional heat advice often assumes that a person can stay indoors, change their commute, cancel outdoor work, or rely on air conditioning. That assumption does not hold for many transit-dependent workers, outdoor workers, and residents with limited access to reliable cooling.

Our approach is different:

> **When people cannot avoid the heat, help them make the least-exposed choice that still works within their real-world constraints.**

The MVP is focused on **Louisiana**, with **New Orleans** as the primary demonstration area. Rather than attempting to model the entire city or state, the project analyzes three representative transit corridors:

1. **Canal Street Corridor — Canal Streetcar Line**
2. **East–West Bank BRT Corridor — New Orleans East → CBD → West Bank**
3. **St. Charles Avenue Green Corridor — St. Charles Streetcar Line**

The three corridors give the project three different but complementary transit contexts: an established downtown-to-Mid-City streetcar corridor, a future rapid-transit connection linking major residential areas to jobs and services, and a long-established Uptown/CBD streetcar corridor.

The goal is not to compare which corridor is "hottest." The goal is to demonstrate how the same heat-intelligence framework can support different real-world decisions along different types of transit corridors.

---

# 2. The Problem

Extreme heat creates a decision problem for people whose daily lives cannot easily be reorganized around the weather.

A transit-dependent worker may have a fixed shift and no private vehicle. An outdoor worker may have to report to a worksite regardless of the temperature. A resident with unreliable or unaffordable air conditioning may not have a practical way to recover from daytime heat exposure overnight.

New Orleans provides a strong setting for this problem. The 2025 State of Transit report found that **83% of RTA bus stops lacked shelter and 81% lacked seating**. The same report describes the lack of shelter and seating as a climate-resilience concern during severe weather and heat events.

This means transit exposure is not just the time spent inside a vehicle. For some riders, the most problematic portion may be the waiting period before or after the ride, particularly at stops without meaningful shade or shelter.

The project's central thesis is therefore:

> **This is not primarily a knowledge gap. It is a decision-support gap under real constraints.**

The application helps answer practical questions such as:

- Which realistic trip option exposes a rider to less heat?
- When is a worker's exposure likely to be worst during a fixed shift?
- When should a crew supervisor increase heat precautions?
- How persistent are the heat conditions?
- Is overnight cooling likely to provide meaningful recovery?

The application does **not** make "stay home" or "avoid going outside" its primary recommendation.

---

# 3. Target Users

## 3.1 Transit Commuter

### Profile

A worker who depends on public transportation, has fixed working hours, and cannot simply substitute a private vehicle.

### Real-world constraint

The person may have only one or two practical route/time choices that still allow them to arrive at work on time.

### Decision the application supports

> **Which realistic travel option gives me lower heat exposure?**

### Example

A worker has an 8:00 AM shift and needs to travel from their neighborhood to a job in the CBD. The system compares the relevant route/time options and highlights the period and option with lower estimated heat exposure.

The recommendation should remain feasible. It should not tell the worker to skip work or make an unrealistic detour.

---

## 3.2 Outdoor Worker / Crew Lead

### Profile

A construction, maintenance, landscaping, warehouse/delivery, or other heat-exposed worker or supervisor.

### Real-world constraint

The work itself cannot simply disappear because temperatures are high. The useful intervention is therefore operational: water, rest, monitoring, shade, workload adjustments, or schedule changes.

### Decision the application supports

> **Given the current conditions, how should I manage heat exposure for my crew?**

### Example

A supervisor checks the Crew Board before and during a shift. The board shows current heat conditions, wet-bulb temperature, recent trend, and validated operational guidance.

The output is decision support, not a medical diagnosis or a replacement for an employer's safety program.

---

## 3.3 Home-Bound Resident

### Profile

A resident with limited or unreliable access to air conditioning or other cooling.

### Real-world constraint

Running an AC system may create a meaningful financial burden, while failing to cool the home during persistent heat can prevent overnight recovery.

### Decision the application supports

> **Is this a day/night when cooling should be prioritized because heat is likely to persist?**

The system can use current conditions and recent persistence/trend information to help communicate the severity of the situation.

---

# 4. Why New Orleans

The MVP uses New Orleans because the project already has a strong set of supporting data and a clear transit-related heat story.

The PRD identifies New Orleans as the primary demonstration geography because much of the project's verified evidence is already concentrated there, including transit access, car ownership, bus-stop shelter coverage, and energy insecurity.

New Orleans also provides a useful combination of:

- fixed-route public transportation;
- streetcar corridors;
- underserved transit-dependent communities;
- exposed outdoor waiting environments;
- major employment destinations;
- high heat and humidity;
- a need to distinguish heat index from simple air temperature.

The project intentionally avoids claiming that all of Louisiana has the same exposure pattern. The state is the broader context; **New Orleans is the MVP study area**.

---

# 5. Corridor Selection Strategy

The three selected corridors are not intended to represent every RTA service.

They were selected because together they provide three different transit situations that can demonstrate the project's decision-support approach.

For each corridor, the analysis should focus on:

1. **Route geometry and stop locations**
2. **Neighborhoods and activity centers served**
3. **Heat conditions along the corridor**
4. **Exposure duration**
5. **Potential waiting exposure at stops**
6. **Shade/shelter availability when reliable data is available**
7. **Time-of-day differences**
8. **Exceedance and persistence**
9. **Practical alternatives available to a rider**
10. **How clearly the corridor can support a short live demonstration**

A corridor-level shelter percentage should **not** be invented from the city-wide 83% figure. The 83% figure is useful as system-level context, while corridor-specific claims should be based on corridor-level evidence.

---

# 6. Corridor 1 — Canal Street Corridor

## 6.1 Corridor identity

The Canal Streetcar corridor is served by two RTA streetcar branches:

- **Route 47 — Canal–Cemeteries**
- **Route 48 — Canal–City Park/Museum**

The common Canal Street section connects the downtown/CBD area with the Mid-City area before the two branches diverge.

The Canal–Cemeteries branch continues toward the cemeteries area, while the Canal–City Park/Museum branch continues toward City Park and the museum area.

This makes the corridor useful for a transit-exposure demonstration because it combines a shared trunk with different destinations and activity areas.

## 6.2 Relevant areas

The corridor connects or passes through areas including:

- Central Business District / downtown;
- the French Quarter edge along Canal Street;
- Mid-City;
- the cemeteries area;
- City Park / Museum area depending on branch.

## 6.3 Why it is useful for Heat You Can't Avoid

Canal Street provides a relatively simple visual and geographic story.

A user can begin with a downtown work destination and travel toward Mid-City or the City Park/cemeteries branches.

The application can demonstrate that total trip time is not the only useful metric. A trip can also be evaluated according to:

- time exposed to high heat;
- timing of the trip;
- waiting periods;
- stop shelter/shade;
- severity of heat conditions during the relevant hours.

The corridor therefore fits naturally with **Hero 2 — The Cooler Way There**.

## 6.4 Primary demo scenario

### Transit-dependent worker: Canal corridor

A worker needs to reach the CBD for a fixed shift.

The system evaluates their relevant origin, destination, departure time, and route options.

Instead of producing a generic weather warning, the system identifies the parts of the journey where heat exposure is likely to be greatest and shows whether another realistic option reduces exposure.

### Key question

> **"Which practical way of making this trip exposes me to less heat?"**

## 6.5 Data to collect

For selected Canal corridor stops/segments:

- stop coordinates;
- route/branch information;
- heatmap data;
- heat index;
- wet-bulb temperature;
- relative humidity;
- solar irradiance;
- exceedance where supported;
- persistence where supported;
- shade/shelter information where reliably obtainable;
- relevant service timing.

## 6.6 Important limitation

The corridor contains both streetcar branches. For a clean MVP, the team should define whether the analysis uses:

- the shared Canal Street trunk;
- the Canal–Cemeteries branch;
- the Canal–City Park/Museum branch;

or a clearly specified combination.

Do not describe all three as one uniform route when their branches and destinations differ.

---

# 7. Corridor 2 — East–West Bank BRT Corridor

## 7.1 Corridor identity

The **East–West Bank BRT Corridor** is RTA's planned first Bus Rapid Transit corridor.

RTA describes it as a connection between **New Orleans East, CBD/Downtown, and the West Bank**.

Federal Transit Administration project documentation identifies the corridor as connecting major activity centers from the New Orleans East Transit Center area through the CBD and toward the Algiers/West Bank side of the system.

## 7.2 Current status

This distinction is critical:

> **The East–West Bank BRT is a planned/design-stage project, not a currently operating BRT route.**

RTA's current project information describes the BRT as being designed to improve transit and job access between New Orleans East and the West Bank through the CBD.

Therefore, the application must **not present BRT travel times, live BRT arrivals, or existing BRT stop conditions as if the service is already operating**.

The corridor can still be used as a legitimate planning/demo geography because it represents an identified future transit connection with defined activity centers and a planned alignment.

## 7.3 Relevant areas and activity centers

The documented project corridor includes major destinations and activity centers such as:

- New Orleans East;
- New Orleans East Hospital;
- Gentilly Woods;
- Dillard University;
- Historic Tremé;
- the French Quarter;
- University Medical Center;
- the VA Medical Center;
- City Government;
- the Superdome/Arena;
- the Central Business District;
- the Museum/Arts District;
- the Convention Center;
- Algiers / West Bank.

These destinations make the corridor particularly relevant to the project's question of access to jobs and services.

## 7.4 Why it is useful for Heat You Can't Avoid

This corridor gives the project a different type of scenario from the existing streetcars.

Instead of pretending that a future BRT system already exists, we can use the corridor as a **planning-oriented heat exposure scenario**.

The central question becomes:

> **"Where are the heat-exposure risks along a major planned transit connection, and how could heat intelligence inform route/station planning?"**

This creates a potential extension of the product beyond individual trip decisions.

The corridor can show how the same heat-intelligence approach could support:

- station/shade planning;
- priority locations for cooling infrastructure;
- identification of heat-exposed transfer points;
- planning for transit-dependent communities;
- future operational decision support.

## 7.5 Primary demo scenario

### Planned BRT / access-to-work scenario

A transit-dependent resident in New Orleans East needs reliable access to jobs and services in the CBD.

Instead of claiming that they are currently riding the BRT, the demo treats the corridor as a **planned transit path** and evaluates representative points or proposed stations along the corridor.

The heat layer identifies areas/times where exposure is likely to be especially problematic.

### Key question

> **"If this corridor is connecting people to jobs and services, where should heat exposure be considered in the design and operation of that connection?"**

## 7.6 Data to collect

For the BRT corridor:

- documented corridor alignment;
- proposed station locations where available;
- major activity centers;
- representative corridor points;
- heatmap data;
- heat index;
- wet-bulb temperature;
- humidity;
- solar irradiance;
- exceedance/persistence;
- any available current environmental information.

Where station-level physical shelter data does not yet exist because the corridor is still in development, the application should clearly mark the station information as **planned/proposed** rather than operational.

## 7.7 Why this corridor should be treated differently

The BRT corridor should not be scored in exactly the same operational way as an existing streetcar route.

For the Canal and St. Charles corridors, we can reason about existing stops, existing transit service, and actual rider scenarios.

For the BRT corridor, the stronger story is:

> **heat-informed transit planning and future decision support.**

That distinction keeps the application accurate and avoids fabricating operational data.

---

# 8. Corridor 3 — St. Charles Avenue Green Corridor

## 8.1 Corridor identity

The **St. Charles Streetcar Line (Route 12)** runs from Canal Street through St. Charles Avenue and onward along South Carrollton Avenue to the Carrollton/Claiborne area.

It connects the Central Business District with Uptown and Carrollton and passes major destinations including the Garden District, Audubon Park, Tulane University, and Loyola University New Orleans.

## 8.2 Why it is useful for Heat You Can't Avoid

The St. Charles corridor is particularly useful for demonstrating the relationship between **street-level environmental conditions and transit exposure**.

The line travels through a visually distinctive tree-lined environment, making it a useful test case for the project's effort to distinguish raw temperature from actual exposure conditions.

However, the application should not automatically treat every tree-lined section as "safe" or every stop as shaded.

The appropriate approach is:

> **measure or verify shade/shelter where possible, and otherwise label estimates as estimates.**

This makes the corridor a good candidate for testing the project's shade-weighted exposure concept.

## 8.3 Relevant areas

The corridor serves or passes through:

- Central Business District;
- St. Charles Avenue;
- Lower Garden District;
- Garden District;
- Uptown;
- Tulane/Loyola area;
- Audubon Park;
- South Carrollton;
- Carrollton.

## 8.4 Primary demo scenario

### Transit commuter: St. Charles corridor

A commuter travels from Uptown/Carrollton toward a CBD job during a hot and humid period.

The system examines the relevant time window and environmental conditions along the journey.

Instead of treating every minute of the trip equally, the exposure model can incorporate:

- heat severity;
- duration;
- stop/waiting exposure;
- shade/shelter conditions where supported;
- persistence.

### Key question

> **"Does a route that looks cooler because it is tree-lined actually produce lower measured exposure during the time of travel?"**

That is a strong analytical question because it prevents us from assuming that visual greenery automatically equals safe thermal conditions.

## 8.5 Current service consideration

The St. Charles line is currently undergoing rail infrastructure work near Carrollton.

RTA restored service through Harmony Circle in August 2026, while the Carrollton Double Crossover project remains underway near the Claiborne Avenue end.

Therefore, the final demo should use a clearly stated service snapshot and check current RTA alerts before presenting live rider information.

The project should not rely on a temporary service pattern as if it were permanent.

## 8.6 Data to collect

- Route 12 geometry;
- stop coordinates;
- selected Uptown/Garden District/Carrollton segments;
- heatmap data;
- heat index;
- wet-bulb temperature;
- humidity;
- solar irradiance;
- persistence/exceedance;
- shade/vegetation indicators where reliable;
- current service status for the demo date.

---

# 9. Cross-Corridor Analysis

The three corridors allow the project to demonstrate three different applications of the same core heat-intelligence concept.

| Corridor | Transit type | Primary use case | Main heat question |
|---|---|---|---|
| Canal Street | Existing streetcar | Rider decision support | Which realistic trip option/time has lower exposure? |
| East–West Bank BRT | Planned BRT | Heat-informed transit planning | Where should heat exposure be considered in a future high-capacity corridor? |
| St. Charles Avenue | Existing streetcar | Exposure + shade analysis | Does the street-level environment reduce measured exposure during the trip? |

The corridors should not be forced into one identical scoring model when the underlying transit status is different.

The **existing streetcar corridors** can support rider-facing operational scenarios.

The **planned BRT corridor** is better suited to a planning and infrastructure scenario.

---

# 10. Heat Exposure Model

The project uses FortyGuard's environmental data as the core data source.

Relevant parameters include:

- `heat_index_celsius`
- `wet_bulb_temperature_celsius`
- `relative_humidity_percent`
- `solar_irradiance`

Raw air temperature should not be presented as the primary risk metric.

The reason is simple: heat exposure in humid New Orleans is not adequately represented by temperature alone.

Where supported and validated, the application can also use:

- **exceedance** — how conditions relate to a selected threshold;
- **persistence** — how long elevated or reduced conditions continue;
- **direction: below** — potentially useful for evaluating overnight recovery.

The project treats overnight recovery as a project-defined metric and should not present a chosen recovery threshold as an official OSHA/CDC standard unless independently verified.

---

# 11. Heat Exposure for Transit

For existing transit corridors, the project's concept of heat exposure can be represented as a combination of:

**Exposure = time × severity × exposure condition**

A conceptual route score can therefore account for:

- minutes spent exposed;
- heat severity during those minutes;
- waiting time;
- shelter/shade conditions;
- time of day.

The exact formula should be implemented only after the team validates the heat-science model and test vectors.

The application should prioritize explainability.

A user should be able to understand why one option scored better:

> "This option has a shorter high-heat waiting period and more verified shaded/sheltered exposure."

rather than seeing an unexplained score such as "72.4."

---

# 12. Forecast Limitation

The team must not claim future prediction unless FortyGuard's forecast capability has been verified to work for the MVP.

If the API does not provide usable forecast data, the application will use:

**Current conditions + recent trend**

rather than presenting historical or current data as a future prediction.

The Shift Plan can then communicate:

- conditions now;
- recent heat trend;
- current exceedance;
- persistence;
- the most exposed period in the available observed data.

The limitation should be visible in the user interface.

Suggested UI language:

> **Forecast unavailable — using current conditions and recent heat trend.**

This is preferable to presenting unsupported predictions.

---

# 13. Crew Board

Although the RTA corridors are the primary geography for the transit analysis, the overall application also includes a supervisor-facing Crew Board.

A representative Louisiana outdoor worksite can be used to demonstrate:

- current heat index;
- wet-bulb temperature;
- environmental conditions;
- heat trend;
- work/rest guidance;
- a shareable worksite record.

The Crew Board should avoid pretending to replace OSHA requirements, occupational safety professionals, or employer safety procedures.

The purpose is to provide a practical environmental decision-support layer.

Where the FortyGuard `heat_intelligence` endpoint is useful, a report can be pre-generated and cached for the demonstration. It should not be the sole live-demo dependency if the endpoint takes several minutes.

---

# 14. Reliability and Data Honesty

The credibility of the product depends on distinguishing different types of information.

### FortyGuard measurement

A value directly returned by the API.

### Derived metric

A value computed by our application from FortyGuard data, using a validated formula.

### Estimate

A value inferred because more precise data is unavailable.

### Cached result

A previously generated real API response used to protect the live demo from latency or network failures.

Each should be distinguishable when relevant.

The system must never silently turn missing data into zero or fabricate numbers.

---

# 15. MVP Scope

The MVP includes:

- New Orleans, Louisiana;
- the three selected corridor case studies;
- heat/environmental data from FortyGuard;
- current conditions and recent trend analysis;
- one or more transit decision-support scenarios;
- the Shift Plan;
- the Cooler Way There concept;
- the Crew Board;
- a live deployed web application;
- a clear explanation of data limitations.

The MVP does **not** require:

- user accounts;
- login/onboarding;
- a native mobile application;
- personal real-time GPS tracking;
- medical diagnosis;
- nationwide deployment;
- full statewide transit modeling;
- live BRT operations data before BRT service exists;
- unsupported future forecasts.

---

# 16. Demo Narrative

The three-minute demo should tell one simple story.

### Step 1 — Start with a real person

> "This worker cannot simply stay home. They have a fixed job and limited transportation choices."

### Step 2 — Show the heat

Display the corridor and current environmental conditions.

### Step 3 — Show the decision

Show the relevant route/time or corridor exposure.

### Step 4 — Show the alternative

Demonstrate how another realistic option can reduce exposure.

### Step 5 — Show the Crew Board

Switch from the individual commuter to a supervisor managing an outdoor worksite.

### Step 6 — Explain the limitation

If forecasts are unavailable:

> "We do not pretend this is a forecast. We use current conditions and recent trend."

### Step 7 — End with the core message

> **"We are not telling people to avoid the heat. We are helping people make better decisions when they cannot."**

---

# 17. Impact

The project addresses a practical gap between generic weather information and real-world decisions.

For a transit rider, the value is not another temperature number. It is knowing which feasible travel choice exposes them to less heat.

For a supervisor, the value is not another weather forecast. It is knowing how current conditions affect an outdoor workday and when additional precautions may be appropriate.

For a resident with limited cooling access, the value is understanding when persistent heat may make recovery more difficult.

The same heat-intelligence layer can therefore serve both individuals and organizations.

---

# 18. Future Expansion

The architecture is designed to expand beyond the initial New Orleans demonstration.

Potential future directions include:

- additional Louisiana corridors;
- additional U.S. states;
- more transit agencies;
- station and shelter planning;
- more detailed shade/vegetation analysis;
- validated short-term forecasting;
- additional occupational settings;
- conversational agent capabilities.

The project does not need to solve every location during the hackathon.

The objective is to demonstrate a credible, technically grounded workflow in one real city using multiple corridor types.

---

# 19. Sources and Evidence

The corridor analysis should be supported by primary or high-quality sources wherever possible.

### RTA

- RTA official Bus Rapid Transit project page:
  https://www.norta.com/current-projects/bus-rapid-transit

- RTA official rider tools and current route information:
  https://www.norta.com/rider-tools

- RTA official current service/project updates:
  https://www.norta.com/ride-with-us/changes-that-may-affect-your-ride/service-changes

- RTA St. Charles Streetcar project/service updates:
  https://www.norta.com/ride-with-us/changes-that-may-affect-your-ride/st-charles-streetcar-service-adjustments

### Federal Transit Administration

- East–West Bank BRT Project Development Profile:
  https://www.transit.dot.gov/sites/fta.dot.gov/files/2024-03/LA-New-Orleans-RTA%20East-West-Bank-BRT-Project-PD-PROFILE-AR25.pdf

### New Orleans transit conditions

- Ride New Orleans, *State of Transit 2025*:
  https://rideneworleans.org/wp/wp-content/uploads/RIDE_State_of_Transit_2025_WEB-SM.pdf

### Corridor context

- New Orleans & Company, Streetcar Guide:
  https://www.neworleans.com/plan/transportation/streetcars/

These sources should be rechecked before final submission for any route, service-status, shelter, or project-schedule claim that appears in the final pitch.

---

# 20. Final Product Positioning

**Heat You Can't Avoid** is not another weather application.

It is a decision-support system for people who have constraints.

A bus rider cannot always change their route.

A worker cannot always cancel their shift.

A resident cannot always afford unrestricted air conditioning.

The application therefore takes real environmental conditions and turns them into practical decisions.

> **When people cannot avoid the heat, help them choose the least-exposed option they realistically have.**
