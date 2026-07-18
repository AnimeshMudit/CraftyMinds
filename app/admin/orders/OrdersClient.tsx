"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Order } from "@/types/order";
import { useToast } from "@/components/admin/Toast";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrdersClientProps {
  initialOrders: Order[];
  errorMsg: string | null;
}

export default function OrdersClient({ initialOrders, errorMsg }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { showToast } = useToast();

  // 1. Toggle expanded order details
  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  // 2. Handle order status updates
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update order status.");
      }

      // Update state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, order_status: newStatus as Order["order_status"], updated_at: new Date().toISOString() }
            : order
        )
      );
      showToast(`Order status updated to ${newStatus}!`, "success");
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 3. Filter and search computations
  const filteredOrders = orders.filter(order => {
    // Search constraints (number, customer, email, phone)
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.email.toLowerCase().includes(searchText.toLowerCase()) ||
      order.phone.includes(searchText);

    // Filter by payment status
    const matchesPayment = 
      paymentFilter === "all" || 
      order.payment_status === paymentFilter;

    // Filter by order status
    const matchesStatus = 
      statusFilter === "all" || 
      order.order_status === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Render error boundary block if DB couldn't be loaded
  if (errorMsg) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <h3 className="font-serif text-xl text-red-800 font-semibold">Database Connection Error</h3>
        <p className="text-slate-600 text-sm font-sans mt-2 mb-4 leading-relaxed">
          {errorMsg}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Payment Status Badge Helper
  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            Paid
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
            Pending
          </span>
        );
    }
  };

  // Order Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-900">Orders</h1>
        <p className="text-sm font-sans text-slate-500 font-light mt-1">
          Monitor customer transactions, check payments, and track order shipment statuses.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      {orders.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by order number, name, email, phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent placeholder-slate-400 transition-all"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Payment Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold font-sans uppercase tracking-wider">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Order Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold font-sans uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-slate-400" size={28} />
          </div>
          <h3 className="font-serif text-2xl text-slate-800 font-medium">No customer orders yet.</h3>
          <p className="text-slate-500 text-sm font-sans font-light mt-2 leading-relaxed">
            As soon as customers start checking out using Razorpay, their orders will appear here.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* No Search Matches */
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-sm font-sans font-light">
            No orders match the selected search filters.
          </p>
        </div>
      ) : (
        /* Orders List (Responsive card-table hybrid layout) */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isUpdating = updatingOrderId === order.id;
            const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden ${
                  isExpanded ? "border-accent/40 ring-1 ring-accent/10" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Order Summary Header Grid */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:flex items-center flex-wrap gap-x-8 gap-y-3 w-full">
                    {/* Order Number */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Order No.</span>
                      <span className="font-serif text-base font-bold text-slate-900">{order.order_number}</span>
                    </div>

                    {/* Customer */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Customer</span>
                      <span className="text-sm font-semibold text-slate-800 line-clamp-1">{order.customer_name}</span>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Order Date</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Total Amount */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Grand Total</span>
                      <span className="text-sm font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2.5 sm:col-span-2 md:ml-auto shrink-0 pt-1 md:pt-0">
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[8px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Payment</span>
                        {renderPaymentBadge(order.payment_status)}
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[8px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Order</span>
                        {renderStatusBadge(order.order_status)}
                      </div>
                    </div>
                  </div>

                  {/* Expansion Indicator Arrow */}
                  <div className="self-end md:self-center shrink-0 p-1 rounded-lg bg-slate-50 text-slate-400">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expandable Order Details Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 bg-slate-50/20"
                    >
                      <div className="p-5 md:p-8 space-y-8">
                        {/* Section Grid: Info blocks */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Block 1: Customer & Shipping Details */}
                          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
                            <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-50 pb-2.5 flex items-center gap-2">
                              <MapPin size={15} className="text-accent" />
                              Customer & Shipping
                            </h4>
                            <div className="space-y-3 text-xs text-slate-600 font-sans">
                              {/* Contact Details */}
                              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg">
                                <p className="font-semibold text-slate-800">{order.customer_name}</p>
                                <p className="flex items-center gap-1.5 mt-1">
                                  <Mail size={12} className="text-slate-400" />
                                  <a href={`mailto:${order.email}`} className="hover:text-accent hover:underline">{order.email}</a>
                                </p>
                                <p className="flex items-center gap-1.5 mt-0.5">
                                  <Phone size={12} className="text-slate-400" />
                                  <a href={`tel:${order.phone}`} className="hover:text-accent hover:underline">{order.phone}</a>
                                </p>
                              </div>

                              {/* Address Details */}
                              <div className="space-y-1 px-1">
                                <p className="font-semibold text-slate-500 uppercase tracking-wider text-[9px] mb-1">Shipping Address</p>
                                <p className="text-slate-700 font-medium">{order.house_flat}, {order.street}</p>
                                {order.landmark && <p className="text-slate-500 font-light italic">Landmark: {order.landmark}</p>}
                                <p className="text-slate-700 font-medium">{order.city}, {order.state} - {order.pin_code}</p>
                              </div>
                            </div>
                          </div>

                          {/* Block 2: Payment Details & Settings */}
                          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
                            <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-50 pb-2.5 flex items-center gap-2">
                              <CreditCard size={15} className="text-accent" />
                              Payment Transaction
                            </h4>
                            <div className="space-y-3.5 text-xs text-slate-600 font-sans">
                              <div className="flex justify-between items-center py-1">
                                <span className="font-medium text-slate-400">Payment Status:</span>
                                {renderPaymentBadge(order.payment_status)}
                              </div>

                              {/* Razorpay Meta data */}
                              <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                <div className="flex flex-col space-y-0.5">
                                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Razorpay Payment ID</span>
                                  <span className="font-mono text-[10px] text-slate-800 break-all select-all">
                                    {order.razorpay_payment_id || <span className="text-slate-400 italic">Not available</span>}
                                  </span>
                                </div>
                                <div className="flex flex-col space-y-0.5 pt-1.5 border-t border-slate-200/50">
                                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Razorpay Order ID</span>
                                  <span className="font-mono text-[10px] text-slate-800 break-all select-all">
                                    {order.razorpay_order_id || <span className="text-slate-400 italic">Not available</span>}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Block 3: Fulfillment & Status Change */}
                          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs space-y-4">
                            <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-50 pb-2.5 flex items-center gap-2">
                              Fulfillment Status
                            </h4>
                            <div className="space-y-4 text-xs font-sans">
                              <div className="space-y-1.5">
                                <label className="font-medium text-slate-500 uppercase tracking-wider text-[9px]">Update Order Status</label>
                                <div className="relative">
                                  <select
                                    disabled={isUpdating}
                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-accent bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                  </select>
                                  {isUpdating && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <Loader2 className="animate-spin text-slate-400" size={14} />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-accent/5 rounded-xl border border-accent/10 text-[10px] text-accent leading-relaxed">
                                <strong className="font-semibold block uppercase tracking-wider text-[8px] mb-0.5">Fulfillment Instruction</strong>
                                Transition status through Processing → Shipped → Delivered. Updates are securely synchronized with the database record.
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Order Items Table section */}
                        <div className="space-y-3">
                          <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2 px-1">
                            <ShoppingBag size={15} className="text-accent" />
                            Ordered Items
                          </h4>

                          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                                  <th className="py-3 px-4">Item details</th>
                                  <th className="py-3 px-4 text-center">Qty</th>
                                  <th className="py-3 px-4 text-right">Price</th>
                                  <th className="py-3 px-4 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                                {order.items.map((item, index) => {
                                  const lineTotal = item.product.price * item.quantity;
                                  return (
                                    <tr key={`${order.id}-item-${index}`} className="hover:bg-slate-50/30">
                                      {/* Product Image and Details */}
                                      <td className="py-3 px-4 flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                                          <Image
                                            src={item.product.image_url}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                          />
                                        </div>
                                        <div className="flex flex-col space-y-0.5">
                                          <span className="font-semibold text-slate-800 line-clamp-1">{item.product.title}</span>
                                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">{item.product.category}</span>
                                        </div>
                                      </td>
                                      
                                      {/* Qty */}
                                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                                        {item.quantity}
                                      </td>
                                      
                                      {/* Price */}
                                      <td className="py-3 px-4 text-right font-medium text-slate-800">
                                        ₹{item.product.price.toLocaleString("en-IN")}
                                      </td>
                                      
                                      {/* Line Total */}
                                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                                        ₹{lineTotal.toLocaleString("en-IN")}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
