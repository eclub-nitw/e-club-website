type NetworkInfo = Navigator & { connection?: { saveData?: boolean } };

/**
 * Whether to mount a live WebGL scene at all. Anything that fails gets the static poster instead:
 * reduced motion, 4 or fewer logical cores, Save-Data, or no WebGL context.
 */
export function canRunWebGL(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return false;
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
