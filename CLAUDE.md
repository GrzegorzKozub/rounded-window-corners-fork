# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GNOME Shell extension that adds rounded corners and custom shadows to windows. Uses GLSL fragment shaders for the rounding effect and monkey-patches GNOME Shell internals via `InjectionManager`. Written in TypeScript, targeting GJS (GNOME JavaScript runtime).

All configuration is hardcoded in `src/utils/config.ts` — there is no settings UI, GSettings schema, or preferences dialog.

## Build Commands

Build tool is `just` (command runner). All recipes are in `justfile`.

- `just build` — compile TypeScript and copy resources to `_build/`
- `just install` — build + install to `~/.local/share/gnome-shell/extensions/`
- `just pack` — build + create `.zip` for distribution
- `just clean` — remove build directory

Before building: `npm install` (runs automatically in `just build`).

## Linting

Uses Biome for linting and formatting:

- `npx biome check` — lint and format check
- `npx biome check --write` — auto-fix

Key Biome rules to know:
- 4-space indentation, single quotes, no bracket spacing
- Use `type` (not `interface`) for type definitions
- Import file extensions required (`.js` suffix even for `.ts` sources — GJS requirement)
- Import order: type imports → blank line → `gi://` imports → blank line → `resource://` imports → blank line → relative imports
- GJS naming allowlist: `vfunc_*`, `Template`, `InternalChildren`, `icon_name`, `css_classes`, etc. are exempt from camelCase enforcement

## Architecture

**Entry point:** `src/extension.ts` — main extension class (`enable()`/`disable()` lifecycle)

**Key subsystems:**
- `src/effect/` — GLSL shader effects (`RoundedCornersEffect`, `ClipShadowEffect`, `LinearFilterEffect`). Shaders are in `src/effect/shader/*.frag`
- `src/manager/` — event handling: connects to window signals, applies/removes effects on window lifecycle events
- `src/patch/` — monkey-patches GNOME Shell methods (overview shadows, workspace switch animations) via `InjectionManager`
- `src/utils/config.ts` — hardcoded configuration constants (border radius, shadows, padding, skip rules)

**How effects are applied:** `EventManager` listens for window map/destroy/focus signals → calls handlers in `event_handlers.ts` → attaches `RoundedCornersEffect` (GLSL shader) to `Meta.WindowActor`. Shadows during overview/workspace-switch are added via monkey-patched methods in `src/patch/`.

## GJS/GNOME Shell Specifics

- Imports use `gi://` protocol for GObject Introspection bindings and `resource://` for bundled resources
- TypeScript compiles to ESNext modules — GJS loads `.js` files directly (no bundler)
- Type definitions come from `@girs/gnome-shell` package
- `src/global.d.ts` provides additional type declarations for GJS-specific APIs
- GNOME Shell extensions must cleanly reverse all changes in `disable()` — undo signal connections, restore patched methods, remove effects
