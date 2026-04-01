import { SAUCE_RULES } from "./sauceRules";

export function getItemSauces(item) {
  const category = item.category?.toLowerCase()?.trim() || "";
  const name = item.name?.toLowerCase()?.trim() || "";

  if (category === "chicken") {
    return SAUCE_RULES.chicken;
  }

  if (category === "pork") {
    return SAUCE_RULES.pork.ribs;
  }

  return [];
}
