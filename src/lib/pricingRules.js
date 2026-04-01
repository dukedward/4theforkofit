import { size } from "lodash";

export const PRICING_RULES = {
  chicken: {
    wings: [
      { size: "20pc", price: 26 },
      { size: "30pc", price: 37 },
    ],
    default: [
      { size: "20pc", price: 30 },
      { size: "30pc", price: 45 },
    ],
  },
  sauce: {
    default: [
      { size: "cup", price: 4 },
      { size: "pint", price: 7 },
      { size: "quart", price: 14 },
    ],
    alt: [
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
