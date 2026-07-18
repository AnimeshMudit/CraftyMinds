import React from "react";
import PolicyLayout from "@/components/Policy/PolicyLayout";

export const metadata = {
  title: "Terms and Conditions | Crafty Minds Studio",
  description: "Read our website terms of use, payment rules, and handcrafted product policies at Crafty Minds Studio.",
  openGraph: {
    title: "Terms and Conditions | Crafty Minds Studio",
    description: "Understand our guidelines, checkout policies, and information regarding handcrafted variances.",
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdatedDate = "July 18, 2026";

  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated={lastUpdatedDate}>
      <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-slate-600">
        
        <p>
          Welcome to Crafty Minds Studio. These Terms and Conditions govern your use of our website and the purchase of any handcrafted creations from our catalog. By browsing or making a purchase, you agree to comply with these terms.
        </p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            1. Handcrafted Product Variations
          </h3>
          <p>
            All products listed in our store (including MDF art plaques, canvas pouches, clay magnets, and rakhis) are hand-painted, stitched, or hand-sculpted by our artists. 
          </p>
          <p className="mt-2 font-medium text-slate-700">
            Due to this handcrafted production process, there may be minor variations in color, brush strokes, textures, or sizes compared to the product photos shown on our website. These variations are not defects; they are the natural hallmark of handmade creations and ensure that every item you purchase is a unique piece of art.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            2. Pricing & Product Availability
          </h3>
          <p>
            Prices for our products are subject to change without prior notice. We make every effort to display accurate dimensions and pricing. Because our creations require preparation and are made in limited batches, product availability is subject to change. If a product becomes unavailable after an order is confirmed, we will contact you to arrange a full refund or choose a suitable replacement.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            3. Order Acceptance & Payments
          </h3>
          <p>
            We reserve the right to refuse or cancel any order for reasons including but not limited to: product stock exhaustion, pricing discrepancies, or shipping restrictions. 
          </p>
          <p className="mt-2">
            All online payments are securely processed through Razorpay. Once your payment signature has been verified and confirmed by the payment gateway, we will register the order as confirmed and begin fulfillment.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            4. Intellectual Property
          </h3>
          <p>
            All content, brand logos, product names, text, graphics, and original designs featured on this website are the sole property of Crafty Minds Studio. You may not reproduce, copy, redistribute, or use any product designs or art layouts for commercial purposes without our express written permission.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            5. Limitation of Liability
          </h3>
          <p>
            Crafty Minds Studio shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or the inability to access our services. Our maximum liability to you for any verified claims or order issues is strictly limited to the amount paid by you for the specific purchase.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            6. Questions and Contact Info
          </h3>
          <p>
            If you need clarification regarding any part of these Terms and Conditions, please contact us:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2 space-y-1 font-sans text-sm">
            <p><strong>Email:</strong> craftymindstudios@gmail.com</p>
            <p><strong>Address:</strong> Crafty Minds Studio, Uttar Pradesh, India</p>
          </div>
        </div>

      </div>
    </PolicyLayout>
  );
}
