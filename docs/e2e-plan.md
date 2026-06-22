# E2E Test Plan

The unit/API coverage is broad enough that E2E should stay small. Add it when the app flows stabilize and you want simulator/device confidence in CI or release candidates.

## Recommended Tool

Use Maestro first. It is lighter than Detox for Expo apps and works well for smoke flows.

## First Flows To Automate

1. Login form validation
   - Launch app with a cleared session.
   - Verify email, first name, and last name fields are visible.
   - Fill fields.
   - Tap `Send Code`.
   - Assert the one-time-code field appears.

2. Service map smoke test
   - Start with an authenticated test user.
   - Open `8 AM`, `9:30`, and `11 AM`.
   - Assert each tab is visible.
   - Swipe the floor pager and assert pagination movement.

3. Roster modal smoke test
   - Open `Roster`.
   - Tap a volunteer.
   - Assert assignment details appear.
   - Close the modal.

4. Assignment modal smoke test
   - Open a floor plan with seeded assignments/positions.
   - Tap a station.
   - Assert `Assign Volunteer` appears.
   - Close the modal.

## Test Data

Create a dedicated Supabase project or seed profile/service rows for E2E. Do not run E2E against live volunteer data.

Minimum seed data:

- Three services: `8am`, `9:30am`, `11am`
- Positions for main, outside, and kids stations
- At least two volunteer profiles
- Assignments rows for each service/station combination

## CI Recommendation

Keep E2E out of the default CI job until it is stable. Run it in one of these modes:

- manually from GitHub Actions
- nightly
- on release branches

The default CI should remain fast: lint, unit tests, and typecheck.
