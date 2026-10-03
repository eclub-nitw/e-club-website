type NetworkInfo = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }; // deviceMemory: Chromium only, GB rounded down to a power of two

/**
 * Whether to mount a live WebGL scene at all. Anything that fails gets the static poster instead:
 * reduced motion, touch devices (V2: mobile gets the poster), 4 or fewer logical cores, 4 GB or less of memory (where reported), an integrated or software GPU, Save-Data, or no WebGL context.
 */
/** Integrated Intel graphics and software renderers: the stacked static version is the better experience there. */
const WEAK_GPU = /Intel\(R\)|Intel.*(UHD|Iris|HD Graphics)|SwiftShader|llvmpipe|Basic Render/i;

export function canRunWebGL(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return false;
  if ((navigator as NetworkInfo).deviceMemory !== undefined && (navigator as NetworkInfo).deviceMemory! <= 4) return false;
  if ((navigator as NetworkInfo).connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // do not leave a probe context alive
    return !!gl && !WEAK_GPU.test(renderer);
  } catch {
    return false;
  }
}

/** Reads a CSS custom property (a design token) so the scene never hardcodes colours. */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
