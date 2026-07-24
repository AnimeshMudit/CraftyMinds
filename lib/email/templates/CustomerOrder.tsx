import React from "react";
import { Order } from "@/types/order";

interface CustomerOrderEmailProps {
  order: Order;
}

export default function CustomerOrderEmail({ order }: CustomerOrderEmailProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Styles object for inline CSS compatibility in mail clients
  const styles = {
    body: {
      fontFamily: "'Playfair Display', Georgia, serif",
      backgroundColor: "#fafafa",
      padding: "32px 16px",
      margin: 0,
    },
    container: {
      maxWidth: "600px",
      backgroundColor: "#ffffff",
      margin: "0 auto",
      borderRadius: "24px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
    header: {
      backgroundColor: "#A56A43", // Crafty Minds warm terracotta accent
      padding: "40px 24px",
      textAlign: "center" as const,
    },
    logo: {
      color: "#ffffff",
      fontSize: "28px",
      fontWeight: "bold",
      letterSpacing: "1px",
      margin: 0,
      fontFamily: "'Playfair Display', Georgia, serif",
    },
    logoSub: {
      color: "#f3e8ff",
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      marginTop: "4px",
      opacity: 0.8,
    },
    content: {
      padding: "32px 24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    heading: {
      fontSize: "22px",
      color: "#1e293b",
      margin: "0 0 8px 0",
      fontWeight: 600,
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748b",
      margin: "0 0 24px 0",
      lineHeight: "1.5",
    },
    infoGrid: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginBottom: "24px",
    },
    infoCell: {
      padding: "12px",
      border: "1px solid #f1f5f9",
      fontSize: "12px",
      color: "#334155",
      verticalAlign: "top",
    },
    infoTitle: {
      fontWeight: "bold" as const,
      color: "#64748b",
      textTransform: "uppercase" as const,
      fontSize: "9px",
      letterSpacing: "1px",
      marginBottom: "4px",
    },
    addressBlock: {
      lineHeight: "1.4",
      margin: 0,
    },
    badgePaid: {
      display: "inline-block",
      backgroundColor: "#ecfdf5",
      color: "#047857",
      border: "1px solid #d1fae5",
      padding: "2px 8px",
      borderRadius: "9999px",
      fontSize: "10px",
      fontWeight: "bold" as const,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      margin: "24px 0 16px 0",
    },
    th: {
      borderBottom: "2px solid #f1f5f9",
      padding: "10px 8px",
      textAlign: "left" as const,
      fontSize: "10px",
      textTransform: "uppercase" as const,
      color: "#64748b",
      letterSpacing: "1px",
    },
    td: {
      borderBottom: "1px solid #f1f5f9",
      padding: "12px 8px",
      fontSize: "13px",
      color: "#334155",
      verticalAlign: "middle",
    },
    totalRow: {
      backgroundColor: "#fafafa",
    },
    totalTdLabel: {
      padding: "16px 8px",
      fontSize: "14px",
      fontWeight: "bold" as const,
      color: "#1e293b",
      textAlign: "right" as const,
    },
    totalTdVal: {
      padding: "16px 8px",
      fontSize: "16px",
      fontWeight: "bold" as const,
      color: "#A56A43",
      textAlign: "right" as const,
    },
    footer: {
      backgroundColor: "#f8fafc",
      borderTop: "1px solid #f1f5f9",
      padding: "24px",
      textAlign: "center" as const,
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    footerText: {
      fontSize: "12px",
      color: "#64748b",
      margin: 0,
      lineHeight: "1.4",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>Crafty Minds</h1>
          <div style={styles.logoSub}>Handmade with Love</div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h2 style={styles.heading}>Order Confirmed 🎉</h2>
          <p style={styles.subtitle}>
            Your payment has been received and verified. We&apos;ll begin preparing your handmade order shortly.
          </p>
          <p style={{ ...styles.subtitle, marginTop: "-12px", color: "#A56A43", fontWeight: "bold" }}>
            Estimated delivery: 10–12 business days
          </p>
          <p style={{ ...styles.subtitle, fontSize: "12px", fontStyle: "italic", marginTop: "-16px" }}>
            Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
          </p>

          {/* Order Details Grid */}
          <table style={styles.infoGrid}>
            <tbody>
              <tr>
                <td style={{ ...styles.infoCell, width: "50%" }}>
                  <div style={styles.infoTitle}>Order Reference</div>
                  <strong>{order.order_number}</strong>
                  <div style={{ marginTop: "4px" }}>Date: {formattedDate}</div>
                </td>
                <td style={{ ...styles.infoCell, width: "50%" }}>
                  <div style={styles.infoTitle}>Payment Status</div>
                  <span style={styles.badgePaid}>Paid</span>
                </td>
              </tr>
              <tr>
                <td style={styles.infoCell}>
                  <div style={styles.infoTitle}>Customer</div>
                  <strong>{order.customer_name}</strong>
                  <div style={{ marginTop: "2px" }}>{order.email}</div>
                  <div>{order.phone}</div>
                </td>
                <td style={styles.infoCell}>
                  <div style={styles.infoTitle}>Shipping Address</div>
                  <div style={styles.addressBlock}>
                    <p style={{ margin: 0 }}>{order.house_flat}, {order.street}</p>
                    {order.landmark && <p style={{ margin: 0, color: "#64748b", fontStyle: "italic" }}>Landmark: {order.landmark}</p>}
                    <p style={{ margin: 0 }}>{order.city}, {order.state} - {order.pin_code}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Order Items Table */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "60%" }}>Item Details</th>
                <th style={{ ...styles.th, width: "15%", textAlign: "center" }}>Qty</th>
                <th style={{ ...styles.th, width: "25%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <tr key={`email-item-${index}`}>
                    <td style={styles.td}>
                      <strong>{item.product.title}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", textTransform: "capitalize" }}>
                        Category: {item.product.category}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {item.quantity}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
              {/* Grand Total row */}
              <tr style={styles.totalRow}>
                <td colSpan={2} style={styles.totalTdLabel}>Grand Total</td>
                <td style={styles.totalTdVal}>₹{order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Thank you for supporting hand-crafted art!
          </p>
          <p style={{ ...styles.footerText, marginTop: "8px", fontSize: "10px", opacity: 0.8 }}>
            Crafty Minds, India. If you have questions about your order, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
