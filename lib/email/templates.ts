import { Order } from "@/types/order";

/**
 * Renders the HTML confirmation email for the customer order.
 */
export function renderCustomerOrderHtml(order: Order): string {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const itemsHtml = order.items
    .map((item) => {
      const lineTotal = item.product.price * item.quantity;
      return `
        <tr>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; color: #334155;">
            <strong>${item.product.title}</strong>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px; text-transform: capitalize;">
              Category: ${item.product.category}
            </div>
          </td>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; color: #334155; text-align: center;">
            ${item.quantity}
          </td>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; color: #334155; text-align: right;">
            ₹${lineTotal.toLocaleString("en-IN")}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #fafafa; padding: 32px 16px; margin: 0; color: #334155;">
      <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background-color: #A56A43; padding: 40px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px; margin: 0; font-family: 'Playfair Display', Georgia, serif;">Crafty Minds</h1>
          <div style="color: #f3e8ff; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; opacity: 0.8;">Handmade with Love</div>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; font-family: system-ui, -apple-system, sans-serif;">
          <h2 style="font-size: 22px; color: #1e293b; margin: 0 0 8px 0; font-weight: 600;">Order Confirmed 🎉</h2>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 24px 0; line-height: 1.5;">
            Your payment has been received and verified. We&apos;ll begin preparing your handmade order shortly.
          </p>
          <p style="font-size: 14px; color: #A56A43; margin: -12px 0 24px 0; line-height: 1.5; font-weight: bold;">
            Estimated delivery: 10–12 business days
          </p>
          <p style="font-size: 12px; color: #64748b; margin: -16px 0 24px 0; line-height: 1.5; font-style: italic;">
            Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
          </p>

          <!-- Order Details Grid -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 12px; color: #334155; vertical-align: top; width: 50%;">
                  <div style="font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px;">Order Reference</div>
                  <strong>${order.order_number}</strong>
                  <div style="margin-top: 4px;">Date: ${formattedDate}</div>
                </td>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 12px; color: #334155; vertical-align: top; width: 50%;">
                  <div style="font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px;">Payment Status</div>
                  <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #d1fae5; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold;">Paid</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 12px; color: #334155; vertical-align: top;">
                  <div style="font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px;">Customer</div>
                  <strong>${order.customer_name}</strong>
                  <div style="margin-top: 2px;">${order.email}</div>
                  <div>${order.phone}</div>
                </td>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 12px; color: #334155; vertical-align: top;">
                  <div style="font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px;">Shipping Address</div>
                  <div style="line-height: 1.4; margin: 0;">
                    <p style="margin: 0;">${order.house_flat}, ${order.street}</p>
                    ${
                      order.landmark
                        ? `<p style="margin: 0; color: #64748b; font-style: italic;">Landmark: ${order.landmark}</p>`
                        : ""
                    }
                    <p style="margin: 0;">${order.city}, ${order.state} - ${order.pin_code}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Order Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0 16px 0;">
            <thead>
              <tr>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; width: 60%;">Item Details</th>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 10px 8px; text-align: center; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; width: 15%;">Qty</th>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 10px 8px; text-align: right; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; width: 25%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <!-- Grand Total row -->
              <tr style="background-color: #fafafa;">
                <td colspan="2" style="padding: 16px 8px; font-size: 14px; font-weight: bold; color: #1e293b; text-align: right;">Grand Total</td>
                <td style="padding: 16px 8px; font-size: 16px; font-weight: bold; color: #A56A43; text-align: right;">₹${order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 24px; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
          <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.4;">
            Thank you for supporting hand-crafted art!
          </p>
          <p style="font-size: 10px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4; opacity: 0.8;">
            Crafty Minds, India. If you have questions about your order, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the HTML notification email for the administrator.
 */
export function renderAdminOrderHtml(order: Order): string {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHtml = order.items
    .map((item) => {
      const lineTotal = item.product.price * item.quantity;
      return `
        <tr>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px;">
            <strong>${item.product.title}</strong>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px; text-transform: capitalize;">
              Category: ${item.product.category}
            </div>
          </td>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; text-align: center; font-weight: bold;">
            ${item.quantity}
          </td>
          <td style="border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; text-align: right; font-weight: medium;">
            ₹${lineTotal.toLocaleString("en-IN")}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 24px 16px; margin: 0; color: #334155;">
      <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px; margin: 0;">Crafty Minds</h1>
          <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Admin Notification</div>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 16px 0; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
            New Order Received - ${order.order_number}
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; width: 50%;">
                  <div style="font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Order Reference</div>
                  <strong>${order.order_number}</strong>
                  <div style="margin-top: 4px; font-size: 11px; color: #64748b;">Date: ${formattedDate}</div>
                </td>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; width: 50%;">
                  <div style="font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Order Status</div>
                  <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background-color: #fef3c7; color: #d97706;">
                    ${order.order_status}
                  </span>
                  <div style="margin-top: 6px;">
                    <span style="font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Payment: </span>
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background-color: #d1fae5; color: #065f46;">Paid</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 13px; vertical-align: top;">
                  <div style="font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Customer Contact</div>
                  <strong>${order.customer_name}</strong>
                  <div style="margin-top: 4px;">Email: ${order.email}</div>
                  <div>Phone: ${order.phone}</div>
                </td>
                <td style="padding: 12px; border: 1px solid #f1f5f9; font-size: 13px; vertical-align: top;">
                  <div style="font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Shipping Destination</div>
                  <p style="margin: 0; font-weight: medium;">${order.house_flat}, ${order.street}</p>
                  ${
                    order.landmark
                      ? `<p style="margin: 0; color: #64748b; font-style: italic; font-size: 11px;">Lndmrk: ${order.landmark}</p>`
                      : ""
                  }
                  <p style="margin: 0;">${order.city}, ${order.state} - ${order.pin_code}</p>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Purchased Items List -->
          <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px 0;">Ordered Products</div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; width: 65%;">Item Description</th>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 8px; text-align: center; font-size: 10px; text-transform: uppercase; color: #64748b; width: 15%;">Qty</th>
                <th style="border-bottom: 2px solid #f1f5f9; padding: 8px; text-align: right; font-size: 10px; text-transform: uppercase; color: #64748b; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <!-- Grand Total row -->
              <tr style="background-color: #f8fafc;">
                <td colspan="2" style="padding: 16px 8px; font-size: 14px; font-weight: bold; color: #0f172a; text-align: right;">Grand Total</td>
                <td style="padding: 16px 8px; font-size: 14px; font-weight: bold; color: #0f172a; text-align: right;">₹${order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
          This is an automated operational notification triggered by a validated checkout payment.
        </div>
      </div>
    </div>
  `;
}
