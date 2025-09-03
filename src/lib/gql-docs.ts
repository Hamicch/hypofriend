// Query used AFTER user clicks Calculate (submit)
export const Q_RATES_TABLE = `
  query Rates(
    $property_price: Float!
    $repayment: Float!
    $loan_amount: Float!
    $years_fixed: [Int!]!
  ) {
    root {
      rates_table(
        property_price: $property_price
        repayment: $repayment
        loan_amount: $loan_amount
        years_fixed: $years_fixed
      )
    }
  }
`

// Mutations used to fetch dynamic tax rates
export const M_CITY_TAX = `
  mutation City($region: String!) {
    calculateCityTax(input: { region: $region }) { tax }
  }
`

export const M_BROKER_TAX = `
  mutation Broker($region: String!, $new_property: Boolean!) {
    calculateMaklerFee(input: { region: $region, new_property: $new_property }) { tax }
  }
`
