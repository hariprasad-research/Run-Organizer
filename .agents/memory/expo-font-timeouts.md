---
name: Expo font timeouts
description: Expo web font loading can block startup when the scaffold waits on useFonts.
---

The Expo app should not gate its root layout or splash screen on remote/custom font loading. The web-safe system stack is sufficient for this product, and expo-font may remain transitively through vector icons even after app-level font loading is removed.

**Why:** FontFaceObserver can reject after a long timeout when a web font request is unavailable, turning a cosmetic font issue into an uncaught startup error.

**How to apply:** Keep app startup independent of font loading; use the system/web-safe font stack and let optional fonts fail without affecting navigation or gameplay.