import { Resend } from "resend";
import { renderCustomerOrderHtml, renderAdminOrderHtml } from "./templates";
import { Order } from "@/types/order";

/**
 * Sends order confirmation emails to both the customer and the admin.
 * Failures during email transmission will be caught and logged,
 * ensuring they never block checkout verification or throw customer-facing errors.
 */
export async function sendOrderEmails(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  // 1. Safe guard check on variables
  if (!apiKey) {
    console.warn("Skipping email notifications: RESEND_API_KEY environment variable is missing.");
    return;
  }

  if (!fromEmail) {
    console.warn("Skipping email notifications: FROM_EMAIL environment variable is missing.");
    return;
  }

  try {
    const resend = new Resend(apiKey);

    // 2. Render and send customer order email
    const customerHtml = renderCustomerOrderHtml(order);

    console.log(`[Email Service] Dispatched customer order confirmation for ${order.order_number} to ${order.email}`);
    const customerResponse = await resend.emails.send({
      from: fromEmail,
      to: order.email,
      subject: "Your Crafty Minds Order is Confirmed 🎉",
      html: customerHtml,
    });

    if (customerResponse.error) {
      console.error("[Email Service] Resend error dispatching customer email:", customerResponse.error);
    }

    // 3. Render and send admin order email if configured
    if (adminEmail) {
      const adminHtml = renderAdminOrderHtml(order);

      console.log(`[Email Service] Dispatched admin order notification for ${order.order_number} to ${adminEmail}`);
      const adminResponse = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New Order Received - ${order.order_number}`,
        html: adminHtml,
      });

      if (adminResponse.error) {
        console.error("[Email Service] Resend error dispatching admin email:", adminResponse.error);
      }
    } else {
      console.log("[Email Service] Skipping admin notification: ADMIN_NOTIFICATION_EMAIL is not configured.");
    }
  } catch (err) {
    console.error("[Email Service] Unexpected failure while sending order emails:", err);
    // Catches network/credentials/crypto exceptions. Does not block the caller.
  }
}
