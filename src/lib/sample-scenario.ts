import type { FieldReport } from "@/lib/schema";

/**
 * The fictional Midtown Office Renovation scenario used across the landing
 * page, the demo form prefill, and the test suite. Purely illustrative.
 */
export const MIDTOWN_SCENARIO: FieldReport = {
  companyName: "Windward Electric Co.",
  projectName: "Midtown Office Renovation",
  submittedBy: "Dave Kowalski, Foreman",
  trade: "Electrical",
  changeType: "GC / Owner Request",
  description:
    "GC issued revised reflected ceiling plan (RCP-4, Rev C) after our rough-in was complete. Twelve 2x4 LED troffers in the open office area must be relocated an average of 6 feet to align with the new ceiling grid layout. Whips, supports, and circuiting all shift.",
  laborImpact:
    "Two electricians, six labor hours total, including relocation, re-support, and re-termination of twelve fixtures.",
  materialImpact:
    "Scissor lift rental (one day), additional MC whip, fixture supports, wire, and connectors. Testing and commissioning of relocated fixtures.",
  scheduleImpact:
    "One added day in the open office area; ceiling grid close-in must hold until fixtures are re-inspected.",
  urgency: "High",
  requestedNextStep:
    "Issue change order for the fixture relocation before ceiling close-in proceeds.",
  pmEmail: "pm@windwardline.com",
};
