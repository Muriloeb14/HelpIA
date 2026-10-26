import { initTypingEffect } from './modules/typing-effect.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initHelpyBot } from './modules/helpy-bot.js';

document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initScrollReveal();
    initSmoothScroll();
    initHelpyBot();
});