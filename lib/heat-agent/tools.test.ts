import { test } from "node:test";
import assert from "node:assert/strict";
import { shiftPlanTool, coolerWayTool, crewBoardTool, HEAT_AGENT_TOOLS } from "./tools";

test("shiftPlanTool reports the worst window and alternatives from the demo scenario", () => {
  const result = shiftPlanTool();
  assert.ok(result.worstWindow);
  assert.ok(result.alternatives.length >= 2);
  assert.ok(result.recoveryNarrative.includes("recovery threshold"));
});

test("coolerWayTool reports which demo route is recommended", () => {
  const result = coolerWayTool();
  assert.ok(result.recommended === result.routeAName || result.recommended === result.routeBName);
  assert.ok(result.doseA >= 0 && result.doseB >= 0);
});

test("crewBoardTool returns all demo worksites by default", () => {
  const result = crewBoardTool();
  assert.ok(result.worksites.length >= 1);
  assert.ok(result.worksites[0].tier);
  assert.ok(result.worksites[0].guidance.length > 0);
});

test("crewBoardTool filters by worksite name when given", () => {
  const all = crewBoardTool();
  const targetName = all.worksites[0].name;
  const filtered = crewBoardTool({ worksiteName: targetName });
  assert.equal(filtered.worksites.length, 1);
  assert.equal(filtered.worksites[0].name, targetName);
});

test("HEAT_AGENT_TOOLS registers all three tools with a name, description, and runnable fn", () => {
  assert.equal(HEAT_AGENT_TOOLS.length, 3);
  for (const tool of HEAT_AGENT_TOOLS) {
    assert.ok(tool.name.length > 0);
    assert.ok(tool.description.length > 0);
    assert.equal(typeof tool.run, "function");
  }
});
