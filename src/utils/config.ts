/** @file Hardcoded configuration constants for the extension. */

import type {BoxShadow, RoundedCornerSettings} from './types.js';

export const ROUNDED_CORNER_SETTINGS: RoundedCornerSettings = {
    keepRoundedCorners: {
        maximized: false,
        fullscreen: false,
    },
    borderRadius: 6,
    smoothing: 0,
    padding: {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1,
    },
    borderColor: [0.5, 0.5, 0.5, 1.0],
    enabled: true,
};

export const BORDER_WIDTH = 0;

export const FOCUSED_SHADOW: BoxShadow = {
    horizontalOffset: 0,
    verticalOffset: 4,
    blurOffset: 28,
    spreadRadius: 4,
    opacity: 60,
};

export const UNFOCUSED_SHADOW: BoxShadow = {
    horizontalOffset: 0,
    verticalOffset: 2,
    blurOffset: 12,
    spreadRadius: -1,
    opacity: 65,
};

export const SKIP_LIBADWAITA_APP = true;
export const SKIP_LIBHANDY_APP = false;
export const TWEAK_KITTY_TERMINAL = false;
