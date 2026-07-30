import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/utils/auth";
import { getOrdersServer } from "@/lib/supabase/orders-server";
import { getProductsServer } from "@/lib/supabase/products-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Authenticate check
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [orders, products] = await Promise.all([
      getOrdersServer(),
      getProductsServer()
    ]);

    // 2. Compute KPIs
    const now = new Date();
    
    // Helper to format/compare dates in Asia/Kolkata timezone
    const getKolkataDateString = (dateStrOrDate: string | Date) => {
      const d = new Date(dateStrOrDate);
      return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // outputs YYYY-MM-DD
    };

    const todayKolkata = getKolkataDateString(now);

    const ordersTodayList = orders.filter(
      (o) => getKolkataDateString(o.created_at) === todayKolkata
    );

    const ordersTodayCount = ordersTodayList.length;
    
    const revenueToday = ordersTodayList
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.order_status === "pending" || o.order_status === "processing"
    ).length;

    // Last 30 days of revenue
    const revenue30Days = [];
    const start = new Date();
    start.setDate(start.getDate() - 29);

    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);

      const checkDateKolkata = getKolkataDateString(d);

      const dayOrders = orders.filter(o => {
        return o.payment_status === "paid" && getKolkataDateString(o.created_at) === checkDateKolkata;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);

      const label = d.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short"
      });

      revenue30Days.push({
        date: label,
        revenue: dayRevenue
      });
    }

    // Top 5 recent orders
    const recentOrders = orders.slice(0, 5).map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer_name: o.customer_name,
      total: o.total,
      order_status: o.order_status,
      payment_status: o.payment_status,
      created_at: o.created_at
    }));

    // --- PHASE 2 BUSINESS INTELLIGENCE METRICS ---
    const paidOrders = orders.filter(o => o.payment_status === "paid");

    // 1. Best Selling Products (Quantity sold & Revenue generated)
    const productSales: Record<string, { name: string; quantity: number; revenue: number; category: string }> = {};

    for (const order of paidOrders) {
      for (const item of order.items || []) {
        const prod = item.product;
        if (!prod) continue;
        
        const prodId = prod.id;
        const price = prod.price || 0;
        const quantity = item.quantity || 0;
        const itemRevenue = price * quantity;
        
        if (!productSales[prodId]) {
          productSales[prodId] = {
            name: prod.title,
            quantity: 0,
            revenue: 0,
            category: prod.category || ""
          };
        }
        
        productSales[prodId].quantity += quantity;
        productSales[prodId].revenue += itemRevenue;
      }
    }

    const bestSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 2. Category Performance
    const categorySales: Record<string, number> = {
      mdf: 0,
      pouch: 0,
      magnet: 0,
      rakhis: 0
    };

    let totalPaidItemRevenue = 0;

    for (const order of paidOrders) {
      for (const item of order.items || []) {
        const prod = item.product;
        if (!prod) continue;
        
        const category = prod.category || "unknown";
        const quantity = item.quantity || 0;
        const price = prod.price || 0;
        const revenue = price * quantity;
        
        if (categorySales[category] === undefined) {
          categorySales[category] = 0;
        }
        
        categorySales[category] += revenue;
        totalPaidItemRevenue += revenue;
      }
    }

    const categoryPerformance = Object.entries(categorySales).map(([cat, rev]) => {
      const percentage = totalPaidItemRevenue > 0 ? Math.round((rev / totalPaidItemRevenue) * 100) : 0;
      
      let label = cat;
      if (cat === "mdf") label = "MDF Boards";
      else if (cat === "pouch") label = "Pouches";
      else if (cat === "magnet") label = "Magnets";
      else if (cat === "rakhis") label = "Rakhis";
      
      return {
        category: label,
        revenue: rev,
        percentage
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // 3. Top Customers
    const customerSpending: Record<string, { name: string; email: string; orders: number; spent: number }> = {};

    for (const order of paidOrders) {
      const emailKey = order.email.toLowerCase().trim();
      const name = order.customer_name || order.email;
      
      if (!customerSpending[emailKey]) {
        customerSpending[emailKey] = {
          name,
          email: order.email,
          orders: 0,
          spent: 0
        };
      }
      
      customerSpending[emailKey].orders += 1;
      customerSpending[emailKey].spent += order.total;
    }

    const topCustomers = Object.values(customerSpending)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5)
      .map(c => ({
        name: c.name || c.email,
        orders: c.orders,
        spent: c.spent
      }));

    // 4. Revenue Summaries (Week, Month, Year, AOV)
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day; // Sunday
      const sunday = new Date(d.setDate(diff));
      sunday.setHours(0, 0, 0, 0);
      return sunday;
    };

    const getMonthStart = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getYearStart = (date: Date) => {
      return new Date(date.getFullYear(), 0, 1);
    };

    const nowKolkata = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const weekStart = getWeekStart(nowKolkata);
    const monthStart = getMonthStart(nowKolkata);
    const yearStart = getYearStart(nowKolkata);

    let revenueThisWeek = 0;
    let revenueThisMonth = 0;
    let revenueThisYear = 0;

    for (const order of paidOrders) {
      const orderDate = new Date(order.created_at);
      const orderDateKolkata = new Date(orderDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      
      if (orderDateKolkata >= weekStart) {
        revenueThisWeek += order.total;
      }
      if (orderDateKolkata >= monthStart) {
        revenueThisMonth += order.total;
      }
      if (orderDateKolkata >= yearStart) {
        revenueThisYear += order.total;
      }
    }

    const averageOrderValue = paidOrders.length > 0 
      ? Math.round(paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length)
      : 0;

    // --- PHASE 3 WEBSITE INTELLIGENCE METRICS ---
    // Calculate orders & revenue details per product
    const productStats: Record<string, { name: string; orders: number; revenue: number; lastPurchased: string | null }> = {};
    
    // Initialize stats map with catalog products
    for (const p of products) {
      productStats[p.id] = {
        name: p.title,
        orders: 0,
        revenue: 0,
        lastPurchased: null
      };
    }

    for (const order of paidOrders) {
      for (const item of order.items || []) {
        const prod = item.product;
        if (!prod) continue;
        const prodId = prod.id;
        
        if (!productStats[prodId]) {
          productStats[prodId] = {
            name: prod.title,
            orders: 0,
            revenue: 0,
            lastPurchased: null
          };
        }
        
        productStats[prodId].orders += 1;
        productStats[prodId].revenue += (prod.price || 0) * (item.quantity || 0);
        
        const orderDateStr = order.created_at;
        if (!productStats[prodId].lastPurchased || new Date(orderDateStr) > new Date(productStats[prodId].lastPurchased!)) {
          productStats[prodId].lastPurchased = orderDateStr;
        }
      }
    }

    const productPerformance = Object.entries(productStats).map(([id, stats]) => ({
      productId: id,
      name: stats.name,
      views: null, // unavailable without Vercel API credentials
      orders: stats.orders,
      revenue: stats.revenue,
      conversion: null, // unavailable without view count
      lastPurchased: stats.lastPurchased
    })).sort((a, b) => b.revenue - a.revenue);

    const lastUpdated = new Date().toISOString();

    return NextResponse.json({
      kpis: {
        ordersToday: ordersTodayCount,
        pendingOrders: pendingOrdersCount,
        revenueToday: revenueToday,
        visitorsToday: null // placeholder replaced dynamically on client
      },
      revenue30Days,
      recentOrders,
      bestSellingProducts,
      categoryPerformance,
      topCustomers,
      summary: {
        averageOrderValue,
        revenueThisWeek,
        revenueThisMonth,
        revenueThisYear
      },
      traffic: {
        visitorsToday: null,
        pageViewsToday: null,
        uniqueVisitors: null,
        bounceRate: null,
        averageSessionDuration: null
      },
      sources: null,
      devices: null,
      countries: null,
      topPages: null,
      productPerformance,
      lastUpdated
    });
  } catch (error) {
    console.error("Error generating admin analytics:", error);
    const message = error instanceof Error ? error.message : "Failed to load analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
