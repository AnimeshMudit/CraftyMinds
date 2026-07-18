import React from "react";
import { Order } from "@/types/order";

interface AdminOrderEmailProps {
  order: Order;
}

export default function AdminOrderEmail({ order }: AdminOrderEmailProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const styles = {
    body: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      backgroundColor: "#f8fafc",
      padding: "24px 16px",
      margin: 0,
      color: "#334155",
    },
    container: {
      maxWidth: "600px",
      backgroundColor: "#ffffff",
      margin: "0 auto",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "#0f172a", // Dark header for admin notification
      padding: "32px 24px",
      textAlign: "center" as const,
    },
    logo: {
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "bold",
      letterSpacing: "1px",
      margin: 0,
    },
    logoSub: {
      color: "#94a3b8",
      fontSize: "11px",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      marginTop: "4px",
    },
    content: {
      padding: "32px 24px",
    },
    heading: {
      fontSize: "18px",
      color: "#0f172a",
      margin: "0 0 16px 0",
      fontWeight: 700,
      borderBottom: "2px solid #f1f5f9",
      paddingBottom: "12px",
    },
    sectionTitle: {
      fontSize: "12px",
      fontWeight: "bold" as const,
      color: "#64748b",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      margin: "24px 0 12px 0",
    },
    gridTable: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginBottom: "24px",
    },
    gridTd: {
      padding: "12px",
      border: "1px solid #f1f5f9",
      fontSize: "13px",
      verticalAlign: "top",
    },
    gridLabel: {
      fontWeight: "semibold" as const,
      color: "#64748b",
      fontSize: "10px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      marginBottom: "4px",
    },
    badge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "9999px",
      fontSize: "10px",
      fontWeight: "bold" as const,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    th: {
      borderBottom: "2px solid #f1f5f9",
      padding: "8px",
      textAlign: "left" as const,
      fontSize: "10px",
      textTransform: "uppercase" as const,
      color: "#64748b",
    },
    td: {
      borderBottom: "1px solid #f1f5f9",
      padding: "12px 8px",
      fontSize: "13px",
    },
    totalTd: {
      padding: "16px 8px",
      fontSize: "14px",
      fontWeight: "bold" as const,
      color: "#0f172a",
    },
    footer: {
      backgroundColor: "#f1f5f9",
      padding: "20px",
      textAlign: "center" as const,
      fontSize: "11px",
      color: "#94a3b8",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>Crafty Minds</h1>
          <div style={styles.logoSub}>Admin Notification</div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h2 style={styles.heading}>New Order Received - {order.order_number}</h2>
          
          <table style={styles.gridTable}>
            <tbody>
              <tr>
                <td style={{ ...styles.gridTd, width: "50%" }}>
                  <div style={styles.gridLabel}>Order Reference</div>
                  <strong>{order.order_number}</strong>
                  <div style={{ marginTop: "4px", fontSize: "11px", color: "#64748b" }}>Date: {formattedDate}</div>
                </td>
                <td style={{ ...styles.gridTd, width: "50%" }}>
                  <div style={styles.gridLabel}>Order Status</div>
                  <span style={{ ...styles.badge, backgroundColor: "#fef3c7", color: "#d97706" }}>
                    {order.order_status}
                  </span>
                  <div style={{ marginTop: "6px" }}>
                    <span style={styles.gridLabel}>Payment: </span>
                    <span style={{ ...styles.badge, backgroundColor: "#d1fae5", color: "#065f46" }}>Paid</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={styles.gridTd}>
                  <div style={styles.gridLabel}>Customer Contact</div>
                  <strong>{order.customer_name}</strong>
                  <div style={{ marginTop: "4px" }}>Email: {order.email}</div>
                  <div>Phone: {order.phone}</div>
                </td>
                <td style={styles.gridTd}>
                  <div style={styles.gridLabel}>Shipping Destination</div>
                  <p style={{ margin: 0, fontWeight: "medium" }}>{order.house_flat}, {order.street}</p>
                  {order.landmark && <p style={{ margin: 0, color: "#64748b", fontStyle: "italic", fontSize: "11px" }}>Lndmrk: {order.landmark}</p>}
                  <p style={{ margin: 0 }}>{order.city}, {order.state} - {order.pin_code}</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Purchased Items List */}
          <div style={styles.sectionTitle}>Ordered Products</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "65%" }}>Item Description</th>
                <th style={{ ...styles.th, width: "15%", textAlign: "center" }}>Qty</th>
                <th style={{ ...styles.th, width: "20%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <tr key={`admin-email-item-${index}`}>
                    <td style={styles.td}>
                      <strong>{item.product.title}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", textTransform: "capitalize" }}>
                        Category: {item.product.category}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center", fontWeight: "bold" }}>
                      {item.quantity}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", fontWeight: "medium" }}>
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
              {/* Grand Total row */}
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <td colSpan={2} style={{ ...styles.totalTd, textAlign: "right" }}>Grand Total</td>
                <td style={{ ...styles.totalTd, textAlign: "right", color: "#0f172a" }}>₹{order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          This is an automated operational notification triggered by a validated checkout payment.
        </div>
      </div>
    </div>
  );
}
