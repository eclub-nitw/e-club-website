import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, here; every scroll scene imports from this module rather than from "gsap" directly.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
