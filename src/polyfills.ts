import 'zone.js';
import { Buffer } from 'buffer';

// Polyfill for global Buffer
(window as any).global = window;
(window as any).Buffer = Buffer;