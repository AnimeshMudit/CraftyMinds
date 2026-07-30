"use client";

import React from "react";
import { User } from "lucide-react";

interface CustomerSpending {
  name: string;
  orders: number;
  spent: number;
}

interface TopCustomersProps {
  customers: CustomerSpending[];
}

export default function TopCustomers({ customers }: TopCustomersProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Top Customers</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Top 5 clients ranked by total spend</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 pr-1">
          {customers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-sans text-xs font-light">
              No customer orders registered yet.
            </div>
          ) : (
            customers.map((item, index) => (
              <div key={index} className="py-3 flex items-center justify-between gap-4 first:pt-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <User size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 text-sm font-sans truncate max-w-[150px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-sans">
                      {item.orders} {item.orders === 1 ? "order" : "orders"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800 font-sans">
                    ₹{item.spent.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
