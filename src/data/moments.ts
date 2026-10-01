// The <= 8 frames shown in Home chapter 07, chosen by technical quality (sharp, level, readable, nothing awkward).
// Files are built by scripts/build-moments.mjs (one duotone grade, 3:2) into public/images/moments/<id>-{1024,1600}.{avif,webp}.
// Excluded on purpose: 03-39 (student in a checked dress in the foreground), 01-10 (close-up of a seated student), 02-23 (near-duplicate of 02-22).
export const MOMENT_IDS = ["02-22", "01-15", "01-13", "01-03", "02-21", "03-33", "01-07", "01-09"] as const;
