type NetworkInfo = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }; // deviceMemory: Chromium only, GB rounded down to a power of two

/**
 * Whether to mount a live WebGL scene at all. Anything that fails gets the static poster instead:
 * reduced motion, touch devices (V2: mobile gets the poster), 4 or fewer logical cores, 2 GB or less of memory (where reported), Save-Data, or no WebGL context.
 */
export function canRunWebGL(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return false;
  if ((navigator as NetworkInfo).deviceMemory !== undefined && (navigator as NetworkInfo).deviceMemory! <= 2) return false;
  if ((navigator as NetworkInfo).connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // do not leave a probe context alive
    return !!gl;
  } catch {
    return false;
  }
}

/** Reads a CSS custom property (a design token) so the scene never hardcodes colours. */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
