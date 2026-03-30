import { size } from "lodash";

export const PRICING_RULES = {
  chicken: {
    wings: [
      { size: "10pc", price: 15 },
      { size: "20pc", price: 26 },
      { size: "30pc", price: 37 },
    ],
    default: [
      { size: "10pc", price: 17 },
      { size: "20pc", price: 30 },
      { size: "30pc", price: 45 },
    ],
  },
  sauce: {
    honey: [
      { size: "cup", price: 4 },
      { size: "pint", price: 7 },
      { size: "quart", price: 14 },
    ],
    default: [
      { size: "cup", price: 5 },
      { size: "pint", price: 10 },
      { size: "quart", price: 20 },
    ],
  },
  pork: {
    ribs: [
      { size: "1 rack", price: 40 },
      { size: "2 racks", price: 70 },
    ],
  },
};
