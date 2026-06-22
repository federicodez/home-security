# Manual QA Checklist

Use this checklist after auth, assignment, modal, navigation, or Supabase policy changes.

## Setup

- Install a fresh simulator build or delete the app from the simulator before auth testing.
- Start the app with `npm start` or the native run command you are validating.
- Confirm the terminal has no repeated CoreGraphics, UIKit modal presentation, or red-box errors.

## Auth

- Open the app with no existing session.
- Confirm the login screen scrolls while the keyboard is open.
- Fill email, first name, and last name.
- Tap `Send Code`.
- Confirm failed/unknown emails stay on the form and show an alert.
- Confirm successful sends show the one-time-code field.
- Enter an invalid code and confirm an alert appears.
- Enter a valid code and confirm the app routes to the service tabs.
- Quit and reopen the app and confirm the session persists.

## Service Tabs

- Visit `8 AM`, `9:30`, and `11 AM`.
- Confirm each tab shows the matching service floor plan.
- Swipe between `Main Sanctuary`, `Outside`, and `Kids` floor pages.
- Confirm pagination dots stay centered and track the current floor page.

## Assignments

- Tap an empty station and confirm the assign-volunteer modal opens once.
- Assign a volunteer and confirm the modal closes.
- Reopen that station and confirm the volunteer initials render.
- Long-press an assigned station and confirm it clears if that is the intended gesture.
- Repeat one assignment on each floor: main, outside, and kids.
- Confirm no UIKit “already presenting” modal warnings appear.

## Roster

- Open the `Roster` tab.
- Confirm the volunteer list renders names, initials, and service counts.
- Tap one volunteer and confirm a single detail modal opens.
- Close the modal and tap a different volunteer.
- Toggle each availability switch and confirm the UI updates.
- Confirm assigned-service availability switches are disabled.

## Regression Watch

- No blank floor-plan screens.
- No offscreen pagination dots.
- No repeated native modal warnings.
- No repeated CoreGraphics `NaN` warnings.
- No auth errors for expected success flows.
