# Detox Rollout Plan (RN Device E2E)

## Objective
Establish deterministic React Native device E2E for AgriConnect across critical journeys, with iOS-first MVP and Android follow-up.

## Scope
- App launch and auth routing
- Bottom-tab navigation smoothness and route guards
- Home campaigns and quick actions
- Marketplace detail and save/review action entry
- Services request create -> history visibility
- Learn lesson open and progress persistence signal

## Prerequisites
1. Xcode + iOS Simulator available on macOS runners/dev machines.
2. Android Studio + emulator image for Android phase.
3. Node >= 18 and project dependencies installed.
4. Stable test backend dataset (use local reset + seed scripts).

## Phase Plan

### Phase A: Infra Setup (iOS first)
1. Add Detox dependencies to root:
- `detox`
- `jest` runner integration for detox tests
2. Add `.detoxrc.js` with iOS simulator config:
- app binary from `ios` build output
- simulator target `iPhone 15` (or team standard)
3. Add scripts in root `package.json`:
- `test:e2e:build:ios`
- `test:e2e:run:ios`
4. Ensure Metro/app startup is deterministic for test harness.

### Phase B: Selector/TestID Hardening
Add or validate stable `testID` markers for:
- Auth inputs/buttons (`login-phone`, `login-password`, `login-submit`)
- Bottom tabs (`tab-home`, `tab-learn`, `tab-services`, `tab-requests`)
- Home modules (`home-banner-0`, `home-action-marketplace`, etc.)
- Services CTA and request fields
- Marketplace first-card/details CTA
- Learn course and lesson open controls

### Phase C: MVP Smoke Pack
Implement detox smoke suite:
1. Launch app -> login customer -> land on home.
2. Switch tabs: Home -> Services -> Requests -> Learn -> Home.
3. Open service detail and submit request form.
4. Open marketplace detail from list.
5. Open learn lesson screen.

Target runtime: < 8 minutes on CI.

### Phase D: Expansion Pack
1. Role matrix journeys: customer/farmer/technician route guard checks.
2. Save/recent persistence assertions across tabs.
3. Error and offline states.
4. Deep-link behaviors (where feasible).

## Data Strategy
Use local deterministic reset + seed before E2E:
- `Reference/node_agriconnect/scripts/reset_domain_data.js`
- `Reference/node_agriconnect/scripts/seed_domain_data_mysql.js`

## CI Strategy
1. Nightly full Detox run on iOS simulator.
2. PR gate on smoke pack after stability > 95% for 2 weeks.
3. Android lane after iOS lane is stable.

## Risks and Mitigations
1. Flaky async animations/transitions.
- Mitigation: wait-for-visible patterns + disable non-essential animations in test mode.
2. Test data drift.
- Mitigation: enforce reset+seed pre-step per run.
3. Slow CI emulator boot.
- Mitigation: pre-baked simulator images and parallel sharding later.

## Immediate Next Actions
1. Add Detox dependencies + `.detoxrc.js`.
2. Add required `testID` coverage gaps.
3. Land first 5 smoke tests and run locally.
4. Integrate iOS smoke into CI draft workflow.
