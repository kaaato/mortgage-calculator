const formatterGBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

const formatCurrency = (num: number): string => {
  return formatterGBP.format(num)
}

export default formatCurrency
