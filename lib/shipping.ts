/**
 * Shipping policy constants and calculations
 */

export const SHIPPING_FREE_THRESHOLD = 199;
export const SHIPPING_FLAT_CHARGE = 100;

/**
 * Calculate shipping charges based on order subtotal
 * @param subtotal Order subtotal
 * @returns Shipping charge
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT_CHARGE;
}

export const SHIPPING_POLICY_TEXT = {
  title: "Shipping",
  freeThresholdText: `Free shipping on all orders of ₹${SHIPPING_FREE_THRESHOLD} or more.`,
  flatChargeText: `A flat ₹${SHIPPING_FLAT_CHARGE} shipping charge applies to orders below ₹${SHIPPING_FREE_THRESHOLD}.`,
};
