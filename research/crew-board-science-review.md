# Crew Board Science Review

**Project:** Heat You Can't Avoid  
**Review owner:** Shamveel Mazhar  
**Review date:** 2026-08-27  
**Status:** Science review for MVP implementation

## 1. Purpose

This document reviews the four open science items currently used or proposed for the Crew Board:

1. Work/rest heat-index tiers: **91 / 103 / 115°F**
2. Workload adjustment offsets: **+8°F heavy / −5°F light**
3. Maximum shade-reduction factor: **60%**
4. Overnight recovery rule: **26.7°C (80°F) for 6 hours below the threshold**

The goal is to determine what the Crew Board can responsibly present as an occupational standard, a project-defined screening heuristic, an environmental measurement, or an experimental assumption.

### Executive recommendation

**Do not ship the four values above as official OSHA/NIOSH standards.**

Recommended MVP treatment:

- Heat Index remains an **environmental screening/communication metric**, not the sole basis for an occupational work/rest schedule.
- The 91/103/115°F ladder should not be labeled an OSHA/NIOSH work/rest standard.
- The +8°F/−5°F workload offsets should be **removed from the scientific model**.
- The 60% shade factor should be **removed as a physical/physiological reduction claim**.
- The 26.7°C/6-hour overnight rule can remain as a **project-defined recovery indicator**, clearly labeled as such.
- Workload, acclimatization, PPE/clothing, radiant heat, air movement, and cooling/rest conditions should be treated as separate occupational context.

---

## 2. Evidence hierarchy

This review uses the following hierarchy:

1. Current OSHA occupational heat guidance
2. Current CDC/NIOSH occupational heat guidance
3. OSHA's 2024 proposed federal heat rule, explicitly identified as **proposed**
4. Peer-reviewed occupational heat research
5. Internal project assumptions

The distinction between current guidance and a proposed rule is important. OSHA's current rulemaking page still identifies the federal Heat Injury and Illness Prevention rule as a **proposed rule**.

---

# 3. Core occupational-heat principle

## 3.1 Heat Index is useful, but it is not a complete occupational assessment

NIOSH recommends **Wet Bulb Globe Temperature (WBGT)** for occupational heat-exposure limits because it accounts for environmental heat factors, including humidity, radiant heat, and air movement.

NIOSH also recognizes that many outdoor workplaces do not have WBGT instruments. In those situations, Heat Index can be used as a practical screening tool.

OSHA likewise identifies environmental heat, workload/metabolic rate, clothing/PPE, and other factors as relevant to heat-hazard assessment.

Therefore:

> **Heat Index is appropriate for the Crew Board as a screening signal, but it should not be represented as a complete occupational risk calculation.**

This is especially important for heavy outdoor work, high radiant heat, impermeable PPE, limited air movement, or unacclimatized workers.

**Sources:**  
OSHA Heat Hazard Recognition: https://www.osha.gov/heat-exposure/hazards  
NIOSH Heat Index: https://www.cdc.gov/niosh/blogs/2017/heat-index.html  
CDC/NIOSH Heat Safety Tool: https://www.cdc.gov/niosh/heat-stress/communication-resources/app.html  
NIOSH Criteria: https://www.cdc.gov/niosh/docs/2016-106/default.html

---

# 4. Review Item 1 — 91 / 103 / 115°F work/rest tiers

## 4.1 Current project proposal

The PRD currently describes:

| Tier | Heat Index | Guidance |
|---|---:|---|
| Lower | < 91°F | Basic precautions — water, shade, training |
| Moderate | 91–103°F | Increase water/rest frequency, monitor workers |
| High | 103–115°F | More frequent breaks, closer supervision |
| Very High / Extreme | > 115°F | Maximum rest/water, reschedule non-essential work |

The PRD correctly marked these values for verification before hard-coding.

## 4.2 What is supported

The **direction** of this ladder is reasonable:

> As heat stress rises, preventive controls and rest/cooling needs should increase.

OSHA states that the length and frequency of rest breaks should increase as heat stress rises. OSHA also says rest duration depends on environmental heat, physical activity, worker factors, and the condition of the recovery location.

NIOSH similarly recommends more breaks for heavier work and for high heat/humidity.

However, the specific values **91°F, 103°F, and 115°F are not an OSHA/NIOSH occupational work/rest schedule**.

## 4.3 NWS Heat Index categories must not be confused with occupational schedules

The National Weather Service Heat Index categories are:

| NWS category | Heat Index |
|---|---:|
| Caution | 80–90°F |
| Extreme Caution | 91–103°F |
| Danger | 103–124°F |
| Extreme Danger | 125°F+ |

These are public heat-index communication categories. They are not equivalent to an occupational work/rest prescription.

Therefore:

> **NWS Heat Index category ≠ OSHA/NIOSH work/rest schedule.**

The project's 91/103 boundaries appear to align with familiar NWS Heat Index categories, but that does not make them occupational standards.

## 4.4 OSHA proposed rule: 80°F and 90°F

OSHA's 2024 proposed federal heat rule uses:

- **80°F Heat Index** as the proposed initial heat trigger;
- **90°F Heat Index** as the proposed high heat trigger.

The proposal includes additional controls at those triggers, including rest-break provisions at the high trigger.

However, the rule is **not a final federal OSHA standard** as of this review. OSHA's current rulemaking page continues to identify the rule as proposed.

Therefore the Crew Board should never tell users:

> "OSHA requires X at 90°F"

without explicitly identifying the statement as part of OSHA's **2024 proposed rule**.

## 4.5 Recommendation

### Decision: MODIFY

Do not label 91/103/115°F as OSHA/NIOSH work/rest thresholds.

### Preferred implementation

Separate the Crew Board into two layers:

**Layer A — Environmental screening**

Use the NWS Heat Index category.

**Layer B — Occupational context**

Show:

- workload;
- acclimatization;
- PPE/clothing;
- radiant heat/shade;
- air movement;
- access to cool recovery.

Then provide practical controls such as:

- water/hydration;
- cool or shaded recovery;
- increased monitoring;
- additional rest as heat stress rises;
- cooler-time scheduling for heavy work;
- acclimatization checks;
- emergency preparedness.

### Acceptable fallback

If the application requires a simplified four-level visual ladder, the current 91/103/115 values may remain only as:

> **Project screening levels — not OSHA/NIOSH work/rest requirements.**

No exact break schedule should be implied by the number alone.

---

# 5. Review Item 2 — +8°F heavy / −5°F light workload offsets

## 5.1 Current project proposal

The proposed formula changes Heat Index by:

- **+8°F for heavy work**
- **−5°F for light work**

The intended concept is that heavier physical work produces more metabolic heat.

That concept is scientifically sound.

The numerical Heat Index adjustment is not.

## 5.2 Occupational practice

OSHA and NIOSH treat workload as a separate component of occupational heat exposure, commonly using workload/metabolic-rate categories within WBGT-based assessment.

OSHA's Technical Manual describes heat-hazard assessment as considering environmental factors, clothing, and workload/metabolic rate.

NIOSH guidance likewise recognizes physical exertion as a major contributor to heat stress.

Workload changes the worker's **metabolic heat production**. It does not literally make the environmental Heat Index 8°F hotter.

Therefore:

> `Heat Index + 8°F` is not equivalent to an occupational Heat Index for heavy work.

and:

> `Heat Index - 5°F` is not an established occupational correction for light work.

## 5.3 Recommendation

### Decision: REMOVE

Do not use +8°F/−5°F as scientific correction factors.

Replace them with a separate workload input:

```text
Workload:
- Light
- Moderate
- Heavy
- Very Heavy
```

Then let workload influence the **occupational caution level**, not the environmental Heat Index value.

### Recommended UI

Instead of:

> Heat Index: 98°F + 8°F heavy-work adjustment = 106°F

show:

> **Heat Index: 98°F**  
> **Workload: Heavy**  
> **Occupational risk context: Increased**  
> Heavy work produces more metabolic heat and may require additional rest/cooling measures.

This preserves the physical meaning of both variables.

---

# 6. Review Item 3 — 60% maximum shade-reduction factor

## 6.1 Current project proposal

The project currently considers a:

> **60% maximum shade reduction**

as a quantitative exposure adjustment.

## 6.2 What the evidence supports

The physical principle is supported:

- direct sunlight increases radiant heat load;
- shade reduces radiant heat exposure;
- shaded/cool recovery areas are an important workplace control.

OSHA recommends providing a cool location for workers to recover and specifically identifies shade as one option.

NIOSH recommends allowing workers to limit exposure to direct sun and other radiant heat sources.

Field research archived by NIOSH also demonstrates meaningful reductions in environmental heat measures under shade compared with unshaded conditions.

But these sources do **not** establish a universal:

> **60% reduction in heat stress**

for every shaded worker, bus stop, tree canopy, tent, or worksite.

## 6.3 Why a fixed 60% factor is problematic

The effect of shade depends on:

- solar radiation;
- air temperature;
- humidity;
- wind/air movement;
- surface temperatures;
- shade material;
- shade geometry;
- degree of coverage;
- whether the worker actually remains in shade;
- workload;
- clothing/PPE;
- duration.

Therefore a universal 60% factor would create false precision.

## 6.4 Recommendation

### Decision: REMOVE AS A SCIENTIFIC REDUCTION FACTOR

Do not convert Heat Index to a "shade-corrected Heat Index" using 60%.

Instead represent shade separately:

```text
Shade / recovery condition:
- Cool/shaded
- Partial shade
- Direct sun
- Unknown
```

For route scoring, shade can influence a **project-defined exposure score**, but documentation must make clear that any numeric weighting is a product heuristic, not an OSHA/NIOSH physiological conversion.

Recommended variable name if a numeric implementation is unavoidable:

```text
PROJECT_DEFINED_SHADE_WEIGHT
```

not:

```text
HEAT_STRESS_REDUCTION_PERCENT = 60
```

The second name implies a scientific fact the evidence does not establish.

---

# 7. Review Item 4 — 26.7°C / 80°F for 6-hour overnight recovery

## 7.1 Current project proposal

The project proposes to measure:

> hours below approximately 26.7°C / 80°F during the overnight period

with approximately six hours used as a recovery target.

The PRD already correctly describes this as a project-defined metric rather than an official standard.

## 7.2 What the evidence supports

Nighttime heat matters.

Heat-exposed workers can experience impaired sleep and reduced recovery when nighttime temperatures remain elevated. Recent research reviews report associations between high nighttime temperature and poorer sleep outcomes among heat-exposed workers.

However, this review did **not** identify an OSHA or CDC standard stating:

> workers need six hours below exactly 26.7°C / 80°F for adequate recovery.

Therefore the project must separate:

### Supported concept

Persistent nighttime heat can interfere with sleep and recovery.

### Unsupported exact claim

Six hours below 80°F guarantees physiological recovery.

## 7.3 Recommendation

### Decision: KEEP AS A PROJECT-DEFINED INDICATOR

Keep the metric because it adds a useful dimension that daytime peak heat does not capture.

Recommended UI:

> **Overnight cooling opportunity**  
> Estimated hours below 80°F: 5.2 h  
> Project recovery target: 6 h  
>  
> *Project-defined indicator — not an OSHA/CDC medical standard.*

Avoid statements such as:

> "Recovery is adequate."

or:

> "Workers need six hours below 80°F."

A safer description is:

> "Limited overnight cooling may make recovery more difficult."

---

# 8. Recommended Crew Board model

The current design should move away from:

```text
Heat Index
  -> fixed work/rest tier
  -> workload temperature offset
  -> fixed shade percentage
  -> prescriptive recommendation
```

and toward:

```text
FortyGuard environmental data
    |
    +-- Heat Index
    +-- Wet-bulb temperature
    +-- Relative humidity
    +-- Solar irradiance
    |
    v
Environmental screening
    |
    +-- NWS Heat Index category
    +-- Recent trend
    +-- Exceedance / persistence
    |
    v
Occupational context
    |
    +-- Workload
    +-- Acclimatization
    +-- PPE/clothing
    +-- Radiant heat / shade
    +-- Air movement
    +-- Cooling/recovery conditions
    |
    v
Practical controls
    |
    +-- Water
    +-- Rest/cooling
    +-- Shade
    +-- Monitoring
    +-- Cooler-time scheduling
    +-- Workload adjustment
    +-- Emergency readiness
```

This is much closer to current OSHA/NIOSH practice.

---

# 9. Recommended Crew Board output

## Environmental Conditions

**Heat Index:** 98°F  
**Wet-Bulb Temperature:** `[FortyGuard value]`  
**Relative Humidity:** `[FortyGuard value]`  
**Solar/Radiant Exposure:** `[available indicator]`

## Occupational Context

**Workload:** Heavy  
**Acclimatization:** Unknown / Acclimatized / New worker  
**PPE:** Standard / Heat-impermeable / Unknown  
**Shade/Cooling:** Available / Partial / Limited

## Operational Guidance

**Risk context: Elevated**

Recommended controls:

- ensure water is readily available;
- provide a cool/shaded recovery location;
- encourage and enforce appropriate rest breaks;
- increase monitoring as heat stress rises;
- schedule heavier work during cooler periods where feasible;
- account for unacclimatized/new workers;
- account for PPE/clothing;
- maintain emergency procedures and worker training.

### Safety disclosure

> **Heat Index is a screening indicator. Occupational heat risk also depends on workload, acclimatization, clothing/PPE, radiant heat, air movement, and access to cooling. This dashboard supports — but does not replace — site-specific heat-safety procedures.**

---

# 10. What we should claim vs. what we should not claim

| Topic | Safe claim | Avoid claiming |
|---|---|---|
| Heat Index | Useful environmental screening metric | Complete occupational risk assessment |
| 91/103/115°F | Project screening levels if retained | OSHA/NIOSH work/rest requirements |
| OSHA 80/90°F proposal | Values in OSHA's 2024 proposed rule | Current final federal requirements |
| Heavy workload | Increases metabolic heat production | Heavy work = +8°F Heat Index |
| Light workload | Lower metabolic heat production than heavy work | Light work = −5°F Heat Index |
| Shade | Reduces radiant exposure and is an important control | Shade always reduces heat stress by 60% |
| 80°F overnight | Project-defined recovery indicator | Official recovery threshold |
| Six-hour target | Project-defined experimental target | Medical requirement or recovery guarantee |
| WBGT | Preferred occupational assessment framework | Heat Index is always sufficient |
| Rest breaks | Need generally increases as heat stress rises | One universal break schedule for every job |

---

# 11. Final decisions

## 11.1 91 / 103 / 115°F

**MODIFY**

Do not call these OSHA/NIOSH work/rest standards.

Preferred approach: use NWS Heat Index categories for environmental screening and keep occupational controls dependent on workload and other factors.

If the current ladder remains for UI simplicity, label it:

> **Project screening tiers — not OSHA/NIOSH work/rest requirements.**

## 11.2 +8°F / −5°F workload adjustments

**REMOVE**

Workload must be a separate factor. Do not artificially change the environmental Heat Index.

## 11.3 60% shade reduction

**REMOVE AS A SCIENTIFIC FACTOR**

Shade remains important, but use it as an exposure/control variable rather than claiming a universal 60% reduction.

## 11.4 26.7°C / 6-hour overnight recovery

**KEEP AS A PROJECT-DEFINED INDICATOR**

Retain the concept for overnight cooling opportunity, but explicitly label it as a project assumption and not an OSHA/CDC/medical standard.

---

# 12. Action items for the code

### Azam

Remove:

```text
heat_index + 8°F for heavy work
heat_index - 5°F for light work
60% shade = 60% heat reduction
```

Replace with separate variables:

```text
heat_index
workload
acclimatization
p p e / clothing
shade
```

Use workload and shade to modify the **risk/exposure interpretation**, not the physical Heat Index.

Keep:

```text
overnight_recovery_hours_below_80F
```

but expose it in the UI as:

> **Project-defined overnight recovery indicator**

Add the occupational-risk disclosure to the Crew Board.

### Ghada

Update the validation notebook/test vectors so that:

1. Heat Index/environmental calculations remain unchanged.
2. Workload is not implemented as a temperature offset.
3. Shade is not implemented as a universal 60% physical reduction.
4. The overnight recovery calculation is clearly separated from official standards.
5. Project-specific scoring assumptions are explicitly named.
6. Python and TypeScript continue to share the same test-vector expectations.

---

# 13. Suggested judge-facing answers

### "Are these OSHA work/rest thresholds?"

> No. We use Heat Index as a screening signal and treat workload, acclimatization, PPE and environmental conditions separately. We deliberately do not present our simplified tiers as OSHA requirements.

### "Why does heavy work increase risk?"

> Heavy work increases metabolic heat production. We therefore treat workload as a separate occupational factor instead of pretending it changes the environmental Heat Index by a fixed number.

### "Why does shade matter?"

> Shade reduces radiant heat exposure and is an important control. Its actual effect varies with the environment and shade type, so we do not claim a universal percentage reduction.

### "What is the 80°F overnight recovery threshold?"

> It is a project-defined indicator of overnight cooling opportunity. It is not an OSHA or CDC medical standard, and we do not claim that six hours below 80°F guarantees recovery.

---

# 14. Safety and product-positioning principle

The Crew Board should be positioned as **decision support**, not an autonomous safety authority.

Its job is to help a supervisor notice worsening environmental conditions and consider appropriate controls.

It should not claim:

- that a worker is medically safe;
- that a worker is medically unsafe;
- that a single Heat Index value determines an exact break schedule;
- that the dashboard replaces an occupational heat-stress program;
- that the dashboard replaces applicable law, regulation, or professional safety judgment.

OSHA's current guidance emphasizes water, rest, shade, training, acclimatization, monitoring, emergency procedures, and work-practice controls. The Crew Board should reinforce those controls rather than reducing the whole problem to a single temperature number.

---

# 15. Bottom line

The underlying Crew Board concept is strong, but the original numerical shortcuts should be reframed.

The scientifically defensible MVP is:

> **FortyGuard measures the environment.  
> The Crew Board adds occupational context.  
> The application translates the combined information into practical controls.  
> Project assumptions are clearly labeled instead of being presented as official standards.**

This gives the team a stronger science story and a safer product:

- **Heat Index** = environmental screening
- **WBGT / occupational guidance** = preferred professional framework when available
- **Workload** = separate metabolic factor
- **Shade** = separate radiant-heat/control factor
- **Acclimatization/PPE** = separate risk modifiers
- **Overnight recovery** = project-defined experimental indicator
- **Final output** = practical decision support, not a medical/legal determination

---

# 16. References

### OSHA

1. **Heat Hazard Recognition**  
   https://www.osha.gov/heat-exposure/hazards

2. **Water. Rest. Shade.**  
   https://www.osha.gov/heat-exposure/water-rest-shade

3. **Heat Injury and Illness Prevention in Outdoor and Indoor Work Settings — Rulemaking**  
   https://www.osha.gov/heat-exposure/rulemaking

4. **Heat Injury and Illness Prevention in Outdoor and Indoor Work Settings — Proposed Rule, August 30, 2024**  
   https://www.osha.gov/laws-regs/federalregister/2024-08-30

5. **OSHA Technical Manual — Heat Stress**  
   https://www.osha.gov/otm/section-3-health-hazards/chapter-4

### CDC / NIOSH

6. **NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments (2016)**  
   https://www.cdc.gov/niosh/docs/2016-106/default.html

7. **NIOSH Science Bulletin — Heat Index**  
   https://www.cdc.gov/niosh/blogs/2017/heat-index.html

8. **CDC/NIOSH Heat Safety Tool**  
   https://www.cdc.gov/niosh/heat-stress/communication-resources/app.html

9. **CDC/NIOSH Workplace Recommendations**  
   https://www.cdc.gov/niosh/heat-stress/recommendations/index.html

10. **CDC/NIOSH Heat Stress and Workers**  
    https://www.cdc.gov/niosh/heat-stress/about/index.html

### Research

11. **Actual and simulated weather data to evaluate wet bulb globe temperature and heat index as alerts for occupational heat-related illness**  
    https://pubmed.ncbi.nlm.nih.gov/30285564/

12. **Heat Stress in Construction — NIOSH Science Bulletin**  
    https://www.cdc.gov/niosh/bulletin/2020/heat-stress-construction.html

13. **Comparison of Shade Materials for Agricultural Worker Heat Exposure Mitigation**  
    https://stacks.cdc.gov/view/cdc/258700

14. **Impacts of heat on sleep quality among heat-exposed workers: a systematic review**  
    https://pubmed.ncbi.nlm.nih.gov/41680965/

---

## Source note

The project PRD explicitly marked the occupational tiers as requiring verification before hard-coding and described the overnight recovery threshold as a project-defined metric. This review preserves that intent while separating project assumptions from current OSHA/NIOSH occupational guidance.
