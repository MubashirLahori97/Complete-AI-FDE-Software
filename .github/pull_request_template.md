## 1. Spec & Intent (Phases 1–2)
- **What problem does this vertical slice solve?**
- **Spec / Issue reference:**
- **Out of scope (confirmed untouched):**

## 2. Architecture & Context (Phase 3)
- **Did this change alter data models, routes, or trust boundaries?** (Yes / No — explain briefly)
- **If a major trade-off was made, is an ADR linked?**

## 3. Automated Harness Evidence (Phase 5)
- [ ] `npm run check:course` passed
- [ ] `npm test` (Vitest) passed
- [ ] `npm run build` (`tsc -b && vite build`) passed
- [ ] New behavior or bug fix has a dedicated automated test

## 4. Human Governance Check (Phase 6)
- [ ] Diff stays focused on one vertical slice (no unrelated changes)
- [ ] No secrets, tokens, or private user data logged or committed
- [ ] I can explain how a user action flows end-to-end and how it fails safely

## 5. Rollback Plan (Phase 7)
- **How to revert cleanly if production telemetry degrades:** (e.g., `git revert <sha>` or toggle feature flag)
