import { PRICING_RULES } from "./pricingRules";

export function getItemSizes(item) {
  const category = item.category?.toLowerCase()?.trim() || "";
  const name = item.name?.toLowerCase()?.trim() || "";

  if (category === "chicken") {
    if (name.includes("wings")) {
      return PRICING_RULES.chicken.wings;
    }
    return PRICING_RULES.chicken.default;
  }

  if (category === "pork") {
    if (name.includes("ribs")) {
      return PRICING_RULES.pork.ribs;
    }
    // return PRICING_RULES.chicken.default;
  }

  if (category === "hand-crafted sauces") {
    return PRICING_RULES.sauce;
  }

  return [];
}
