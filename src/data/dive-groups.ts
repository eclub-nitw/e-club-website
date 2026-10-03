import { dive } from "./dive";

// The 12 dive panels in four runs of three, one per verb of the club's line. The one-line readings are CONFIRM (docs/COPY-REVIEW.md): a reading of
// the words, not a claim about what the club does.
export const diveGroups = [
  { verb: "Think", line: "Start with the question." },
  { verb: "Connect", line: "Meet the people who can answer it." },
  { verb: "Create", line: "Build the thing." },
  { verb: "Lead", line: "Carry it forward." },
] as const;

export const groupOf = (panel: number) => diveGroups[Math.min(diveGroups.length - 1, Math.floor((panel * diveGroups.length) / dive.length))];
