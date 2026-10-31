import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);

export * from './motion-tokens';
export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
