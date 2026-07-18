import React from "react";
import PolicyLayout from "@/components/Policy/PolicyLayout";

export const metadata = {
  title: "Refund and Cancellation Policy | Crafty Minds Studio",
  description: "Read our balance refund terms, cancellation timelines, and damage reporting instructions at Crafty Minds Studio.",
  openGraph: {
    title: "Refund and Cancellation Policy | Crafty Minds Studio",
    description: "Read details about returns, pre-dispatch cancellations, customized order exceptions, and Razorpay refunds.",
  },
};

export default function RefundPolicyPage() {
  const lastUpdatedDate = "July 18, 2026";

  return (
    <PolicyLayout title="Refund & Cancellation Policy" lastUpdated={lastUpdatedDate}>
      <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-slate-600">
        
        <p>
          At Crafty Minds Studio, we put our heart into creating unique hand-painted products for you. Because of the bespoke, artisanal nature of our creations, we follow a balanced return, cancellation, and refund process.
        </p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            1. Order Cancellations
          </h3>
          <p>
            You can request a cancellation and a full refund within **12 hours** of placing your order, provided the package has not yet been prepared or handed over to our shipping partner.
          </p>
          <p className="mt-2">
            Once an order is packed or dispatched, we cannot accept cancellation requests. To request a cancellation, please email us with your Order Number as soon as possible.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            2. Damaged or Incorrect Products
          </h3>
          <p>
            In the rare event that your handmade art arrives damaged in transit or if we deliver the wrong design:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Please contact us within **24 hours** of receiving the parcel.</li>
            <li>We request you to share clear photographs or a short video showing the damaged package/item or wrong product. A parcel opening video is highly appreciated to help us raise damage claims with courier agencies.</li>
            <li>Upon verifying the issue, we will prepare and dispatch a replacement item at no additional charge. If a replacement cannot be made (e.g. out of raw materials), we will issue a full refund.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            3. Customized & Personalized Items
          </h3>
          <p>
            Orders for customized plaques (e.g. family nameplates or custom quotes) and customized pouches cannot be cancelled or returned once production has started. This is because these products are built specifically to your requirements and cannot be restocked. They are only eligible for replacement or refund if damaged during transit.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            4. Nature of Handmade Art
          </h3>
          <p>
            Please note that minor brush textures, slight variances in paint coloring, and hand-sculpted details are normal characteristics of handmade items. We do not accept returns or refunds based on these organic variances.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            5. Refund Process & Timelines
          </h3>
          <p>
            Once a cancellation request or a damage-related refund is approved:
          </p>
          <p className="mt-2">
            The refund will be processed back to the original source bank account or credit card utilized during checkout. Payments are routed back securely via **Razorpay** and typically reflect in your account within **5 to 7 business days** (depending on bank settlement schedules).
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            6. Get In Touch
          </h3>
          <p>
            For refund queries or to submit proof of damage, please reach out to us:
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
