import React from "react";
import PolicyLayout from "@/components/Policy/PolicyLayout";

export const metadata = {
  title: "Shipping Policy | Crafty Minds Studio",
  description: "Learn about our processing timelines, estimated domestic shipping times, and tracking details at Crafty Minds Studio.",
  openGraph: {
    title: "Shipping Policy | Crafty Minds Studio",
    description: "Read details about order processing, packing precautions, and estimated delivery dates across India.",
  },
};

export default function ShippingPolicyPage() {
  const lastUpdatedDate = "July 18, 2026";

  return (
    <PolicyLayout title="Shipping Policy" lastUpdated={lastUpdatedDate}>
      <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-slate-600">
        
        <p>
          Thank you for choosing Crafty Minds Studio! Because our creations are hand-painted and customized, they require careful preparation and packaging to arrive safely at your doorstep. Below is our shipping workflow and terms.
        </p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            1. Domestic Shipping within India
          </h3>
          <p>
            We currently deliver exclusively to locations across India. We partner with reliable third-party logistics networks to ensure that your orders are handled carefully and delivered securely.
          </p>
          <p>
            Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            2. Processing & Curing Time
          </h3>
          <p>
            Unlike mass-produced items, our wooden plaques and hand-sculpted magnets are painted on order or finished individually.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Standard Orders:</strong> Processed and packed within **2 to 4 business days** from payment confirmation.</li>
            <li><strong>Customized/Personalized Orders:</strong> May require **4 to 6 business days** to ensure the paint and protective varnish coats cure fully before packaging.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            3. Delivery Timelines
          </h3>
          <p>
            Our standard order fulfillment timeline, including processing, packaging, and shipping, is approximately <strong>10–12 business days</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Estimated order delivery: 10–12 business days</strong></li>
          </ul>
          <p>
            This estimate includes order processing, quality checks, packaging, and transit time.
          </p>
          <p className="mt-2 text-slate-500 italic text-xs">
            *Please note: Delivery timelines are estimates. Delays due to public holidays, adverse weather, or regional courier issues are beyond our direct control.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            4. Order Tracking
          </h3>
          <p>
            As soon as your package is dispatched, we send you a confirmation message with the shipment details and courier tracking information. You can track your shipment status in real time using our public <a href="/track-order" className="text-accent hover:underline font-semibold">Track Order</a> page by entering your Order Number and Email Address.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            5. Delivery Address Accuracy
          </h3>
          <p>
            Customers are responsible for providing complete and correct shipping details (including house number, street, landmark, and a valid 6-digit PIN code) during checkout. Crafty Minds Studio cannot be held liable for delivery failures, delays, or packages returned to us due to incorrect address formats or missing contact numbers.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            6. Shipping Queries
          </h3>
          <p>
            For any concerns regarding dispatch schedules or address corrections, please reach out:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2 space-y-1 font-sans text-sm">
            <p><strong>Email:</strong> craftymindstudios@gmail.com</p>
            <p><strong>Instagram:</strong> @craftymindstudio</p>
          </div>
        </div>

      </div>
    </PolicyLayout>
  );
}
