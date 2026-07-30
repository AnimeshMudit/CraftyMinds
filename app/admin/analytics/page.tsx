import React from "react";
import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Store Analytics | Crafty Minds Admin",
  description: "Comprehensive overview of store sales, product conversion metrics, and website traffic performance.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return <AnalyticsClient />;
}
