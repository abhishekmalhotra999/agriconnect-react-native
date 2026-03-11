# Testing Strategy (RN + Backend)

This project now supports reusable test runs for both frontend (React Native) and backend (Node reference API).

## Tooling

- React Native frontend: `Jest` + `@testing-library/react-native`
- Backend: existing `Jest` + `supertest` suite under `Reference/node_agriconnect/tests`

## Install dependencies

From repo root:

```sh
npm install
```

From backend folder:

```sh
npm --prefix Reference/node_agriconnect install
```

## Commands

Run RN tests only:

```sh
npm run test:rn
```

Run backend tests only:

```sh
npm run test:backend
```

Prepare backend test DB (first time or after schema reset):

```sh
npm run test:backend:setup
```

Run admin backend tests only:

```sh
npm run test:backend:admin
```

Run full regression (frontend + backend):

```sh
npm run test:all
```

## Recommended usage after each feature

1. Implement feature.
2. Add/extend RN tests under `__tests__/`.
3. Add/extend backend tests under `Reference/node_agriconnect/tests/` if API behavior changed.
4. Run `npm run test:all` before moving to next feature.

If backend tests fail due database connectivity, run `npm run test:backend:setup` and retry.

## Current RN test coverage added

- `__tests__/api/auth.api.test.ts`:
  - Sign-in payload contract (`identifier`) and token persistence
  - OTP account type normalization (`Customer/Farmer/Technician` -> lowercase)

- `__tests__/api/marketplace.api.test.ts`:
  - Marketplace list mapping into RN product shape
  - Seller "my products" endpoint mapping
  - Product detail + gallery URL normalization

## Phase 5 Parity Signoff (11 Mar 2026)

Automated gates completed:

- RN full suite: `npm run test:rn -- --watch=false`
  - Result: `14/14` suites passed, `55/55` tests passed.
- Backend marketplace suites:
  - `tests/api/roleGuards.marketplace.test.js`
  - `tests/api/listings.interactions.test.js`
  - Result: `2/2` suites passed, `7/7` tests passed.

Verified parity slices:

- Phase 1: `HOME_TAB` enabled (no longer `ComingSoon`) with Home overview regression tests.
- Phase 2: Marketplace search + category + sort + in-stock + trusted + reset behaviors with UI regression tests.
- Phase 3: Product detail actions parity (`save`, `share`, `call`, `whatsapp`), reviews submit/refresh, related products.
- Phase 4: Seller products management parity (search/filter, inline edit, publish/draft toggle, role-aware handling).

Manual smoke items still recommended before release:

1. Device smoke: Home -> Marketplace -> Product Detail actions -> Seller list quick toggle/edit round-trip.
2. Validate deep links for `tel:` and `wa.me` on target Android/iOS devices.
3. Confirm seller status edge cases (`pending/rejected`) display proper server error text during publish toggles.
