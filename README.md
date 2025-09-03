# Mortgage Calculator (Frontend Challenge)

A Vue 3 + TypeScript implementation of a mortgage calculator with instant estimates and mocked GraphQL integration.

---

## ✨ Features

- **Instant Estimates**
  - Updates in real-time as the user adjusts inputs.
  - Calculates:
    - Notary costs
    - Stamp duty (city tax, region-dependent)
    - Broker fee (optional, depends on new property flag)
    - Total costs
    - Implied loan
    - Loan-to-value ratio

- **Rates Table (on submit)**
  - Fetches mocked rate offers from a GraphQL endpoint.
  - Supports fixed years `[5, 10, 15, 20, 25, 30]`.
  - Only shown after the user submits the form.

- **Form Validation**
  - Uses `vee-validate` + `zod` with `shadcn-vue` form components.
  - Validates ranges:
    - Property price: €50,000 – €2,000,000
    - Total savings: €0 – €1,000,000
    - Repayment: 1% – 10%

- **Responsive UI**
  - Built with slot-based UI components.
  - Works seamlessly on mobile and desktop.
  - Sliders for numeric ranges with live currency/percent formatting.

- **GraphQL Mocking (MSW)**
  - All API calls are mocked using [MSW](https://mswjs.io/).
  - Endpoints:
    - `calculateCityTax`
    - `calculateMaklerFee`
    - `rates_table`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 20.19
- npm (comes with Node)

### Installation

```bash
# clone the repo
git clone https://github.com/yourname/hypofriend.git
cd hypofriend

# install dependencies
npm install
```

### Development

```bash
# start dev server (env default from vite.config)
npm run dev

# force mocks ON
npm run dev:mocks

# force mocks OFF
npm run dev:no-mocks
```

### Build

```bash
# build (env default)
npm run build

# build with mocks enabled
npm run build:mocks

# build with mocks disabled
npm run build:no-mocks
```

### Preview

```bash
# preview (env default)
npm run preview

# preview with mocks enabled
npm run preview:mocks

# preview with mocks disabled
npm run preview:no-mocks
```

---

## ⚙️ Environment Variables

- `VITE_ENABLE_MOCKS`
  Controls whether MSW mocks are enabled.
  - `.env.development` → `VITE_ENABLE_MOCKS=true`
  - `.env.production` → `VITE_ENABLE_MOCKS=false`

---

## 📂 Key Files

- `src/components/CalculatorForm.vue` – form with sliders, selects, and toggles.
- `src/composables/useInstantEstimates.ts` – computes loan & LTV instantly.
- `src/composables/useRatesTable.ts` – fetches mocked rates on submit.
- `src/composables/useTaxRates.ts` – reactive city/broker tax fetching.
- `src/mocks/handlers.ts` – MSW mock handlers for GraphQL.

---

## ✅ Completed Requirements

- [x] Real-time implied loan + LTV calculation
- [x] Rates table on submit with 5/10/15/20/25/30 years
- [x] Region select + broker toggle + new property toggle
- [x] Proper min/max constraints on inputs
- [x] Fully mocked GraphQL API via MSW
- [x] Responsive UI (desktop & mobile)


---

## 🧠 Architecture & Decisions

**UI Flow**
- Left: form inputs; Right: instant estimates (Implied Loan, LTV).
- Rates table shown only after submit → avoids empty states.

**State & Logic**
- Local composables (`useMortgage`, `useInstantEstimates`, `useTaxRates`, `useRatesTable`) → lightweight, no global store.
- Computed properties for instant, lag-free updates.

**Performance**
- Pure `computed` math.
- MSW mocks are cached, and requests use abort controllers to prevent race conditions.

**Validation**
- `vee-validate` + `zod` for strict ranges: property price €50k–2M, savings €0–1M, repayment 1–10%.
- UI sliders mirror schema to avoid invalid inputs.

**Accessibility & UX**
- Sliders for numeric ranges, toggles for booleans, select for region → fewer typing errors.
- Labels and shadcn-vue components ensure keyboard support.

**Trade-offs**
- No Pinia/global store → simpler given single-page scope.
- Currency/percent formatting is minimal, no full i18n.
- Region/new property logic mocked; real API swap would be trivial.

**Future Improvements**
- Add tests for composables.
- Better loading/error feedback in UI.
- i18n and amortization breakdown.

