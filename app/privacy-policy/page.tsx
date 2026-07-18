import React from "react";
import PolicyLayout from "@/components/Policy/PolicyLayout";

export const metadata = {
  title: "Privacy Policy | Crafty Minds Studio",
  description: "Learn how we handle, process, and protect your order details and shipping information at Crafty Minds Studio.",
  openGraph: {
    title: "Privacy Policy | Crafty Minds Studio",
    description: "Read our privacy guidelines regarding order tracking, secure Razorpay checkout, and personal data protection.",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "July 18, 2026";

  return (
    <PolicyLayout title="Privacy Policy" lastUpdated={lastUpdatedDate}>
      <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-slate-600">
        
        <p>
          At Crafty Minds Studio, we respect your privacy and are committed to protecting the personal data you share with us. This policy describes how we collect, use, and safeguard your information when you browse our catalog, use the shopping cart, and place orders.
        </p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            1. Information We Collect
          </h3>
          <p>
            To process your orders and provide a seamless shopping experience, we collect specific personal details when you initiate checkout:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Customer Contact Details:</strong> Full Name, Email Address, and Phone Number.</li>
            <li><strong>Shipping Destination:</strong> House/Flat details, Street, Landmark (optional), City, State, and PIN Code.</li>
            <li><strong>Cart Metadata:</strong> The selected handcrafted plaques, fabric pouches, or magnets you intend to purchase.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            2. How We Use Your Information
          </h3>
          <p>
            Your details are used strictly for fulfillment and business operations:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Fulfillment:</strong> To pack and dispatch your hand-painted creations to your specified shipping address.</li>
            <li><strong>Communication:</strong> To send order confirmation notifications, verification details, and shipment tracking codes.</li>
            <li><strong>Courier Sharing:</strong> We share your delivery details (Name, Address, and Phone Number) with trusted shipping partners solely to complete delivery.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            3. Secure Payment Processing
          </h3>
          <p>
            We process customer checkouts securely using **Razorpay**. 
          </p>
          <p className="mt-2">
            All credit card, debit card, UPI, and banking details are captured directly by Razorpay&apos;s secure payment gateway interface. **Crafty Minds Studio does not collect, access, or store any card numbers, account passwords, or transaction pins on our servers.**
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            4. Cart Persistence & Analytics
          </h3>
          <p>
            We utilize standard browser local storage (`localStorage`) to persist your shopping cart items across tab updates or system refreshes. This data does not contain identifiable credentials and remains strictly within your browser. We do not use intrusive tracking cookies.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            5. Your Rights & Data Protection
          </h3>
          <p>
            You have the right to request a copy of the order records we hold for your purchases, or to request correction or removal of your contact details from our records. To submit a request, or if you have any questions regarding your data security, please contact us.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-slate-800 text-lg md:text-xl border-b border-slate-100 pb-2">
            6. Contact for Privacy Concerns
          </h3>
          <p>
            For any queries or concerns regarding this Privacy Policy, please reach out to us at:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2 space-y-1 font-sans text-sm">
            <p><strong>Email:</strong> hello@craftymindstudio.com</p>
            <p><strong>WhatsApp Support:</strong> +91 9140194290</p>
          </div>
        </div>

      </div>
    </PolicyLayout>
  );
}
