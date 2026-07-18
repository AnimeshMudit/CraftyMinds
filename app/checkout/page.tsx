"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  houseFlat: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoaded, cartSubtotal } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    houseFlat: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.push("/cart");
    }
  }, [isLoaded, cart, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validators
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  const pinCodeRegex = /^[1-9]\d{5}$/;

  const isEmailValid = emailRegex.test(formData.email);
  const cleanPhone = formData.phone.replace(/[\s-]/g, "").replace(/^\+91/, "").replace(/^0/, "");
  const isPhoneValid = indianPhoneRegex.test(cleanPhone);
  const isPinValid = pinCodeRegex.test(formData.pinCode.trim());

  const errors = {
    fullName: formData.fullName.trim() === "" ? "Full Name is required" : "",
    email: !formData.email
      ? "Email is required"
      : !isEmailValid
      ? "Please enter a valid email address"
      : "",
    phone: !formData.phone
      ? "Phone number is required"
      : !isPhoneValid
      ? "Please enter a valid 10-digit Indian phone number"
      : "",
    houseFlat: formData.houseFlat.trim() === "" ? "House/Flat detail is required" : "",
    street: formData.street.trim() === "" ? "Street/Locality is required" : "",
    city: formData.city.trim() === "" ? "City is required" : "",
    state: formData.state.trim() === "" ? "State is required" : "",
    pinCode: !formData.pinCode
      ? "PIN Code is required"
      : !isPinValid
      ? "PIN Code must be a valid 6-digit Indian PIN"
      : "",
  };

  const hasErrors = Object.values(errors).some((error) => error !== "");
  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.houseFlat.trim() !== "" &&
    formData.street.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.pinCode.trim() !== "" &&
    !hasErrors;

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      // Mark all required fields as touched
      const allTouched: Record<string, boolean> = {
        fullName: true,
        email: true,
        phone: true,
        houseFlat: true,
        street: true,
        city: true,
        state: true,
        pinCode: true,
      };
      setTouched(allTouched);

      // Focus on the first invalid field
      const fieldOrder = [
        "fullName",
        "email",
        "phone",
        "houseFlat",
        "street",
        "city",
        "state",
        "pinCode",
      ];
      const firstInvalidField = fieldOrder.find((field) => errors[field as keyof typeof errors] !== "");
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }
    
    alert(
      "🎉 Customer Information and Shipping details validated successfully!\n\n" +
      "This is a placeholder for Razorpay Gateway Integration.\n" +
      "In the next phase, clicking this will initiate the secure checkout popup."
    );
  };

  const shipping = 0;
  const total = cartSubtotal + shipping;

  if (!isLoaded || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-background">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-border-custom/50 mx-auto" />
          <div className="h-4 w-32 bg-border-custom/50 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="border-b border-border-custom/50 pb-6 mb-8 md:mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-foreground/50 hover:text-accent font-semibold mb-2 transition-colors duration-300 group cursor-pointer"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Cart</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground">
            Checkout Details
          </h1>
        </div>

        {/* Content Columns */}
        <form onSubmit={handleProceedPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column - Shipping & Customer Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Customer Information Block */}
            <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl md:text-2xl tracking-wide text-foreground border-b border-border-custom/60 pb-3">
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                {/* Full Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.fullName && errors.fullName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.email && errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.phone && errors.phone
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address Block */}
            <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl md:text-2xl tracking-wide text-foreground border-b border-border-custom/60 pb-3">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                {/* House/Flat */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="houseFlat" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Flat, House No., Building, Apartment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="houseFlat"
                    name="houseFlat"
                    value={formData.houseFlat}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Apartment 4B, Sunflower Residency"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.houseFlat && errors.houseFlat
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.houseFlat && errors.houseFlat && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.houseFlat}
                    </p>
                  )}
                </div>

                {/* Street/Locality */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="street" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Area, Street, Sector, Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 5th Main, Sector 7, HSR Layout"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.street && errors.street
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.street && errors.street && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.street}
                    </p>
                  )}
                </div>

                {/* Landmark */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="landmark" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Landmark <span className="text-foreground/40 text-[10px] font-normal lowercase">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near HDFC Bank ATM"
                    className="w-full px-4 py-3 rounded-xl border border-border-custom bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all animate-none"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter city"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.city && errors.city
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.city && errors.city && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label htmlFor="state" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.state && errors.state
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                  {touched.state && errors.state && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.state}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label htmlFor="pinCode" className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    maxLength={6}
                    placeholder="6-digit ZIP / PIN code"
                    className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                      touched.pinCode && errors.pinCode
                        ? "border-red-400 focus:ring-red-400"
                        : "border-border-custom"
                    }`}
                  />
                  {touched.pinCode && errors.pinCode && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.pinCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary & Placeholder Continue Button */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* Products review list */}
            <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 shadow-xs space-y-6">
              <h3 className="font-serif text-xl md:text-2xl tracking-wide text-foreground border-b border-border-custom/60 pb-3">
                Items in Order
              </h3>
              
              <div className="divide-y divide-border-custom/40 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                {cart.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
                      <div className="relative aspect-[3/4] w-12 rounded-lg overflow-hidden border border-border-custom bg-background shrink-0">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-serif text-sm font-medium text-foreground truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-foreground/60 font-sans">
                          Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-serif text-sm font-medium text-foreground shrink-0">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price details */}
              <div className="border-t border-border-custom/60 pt-4 space-y-3 font-sans text-xs sm:text-sm">
                <div className="flex justify-between items-center text-foreground/70">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-foreground/70">
                  <span>Delivery Charges</span>
                  <span className="text-accent-secondary font-semibold uppercase tracking-wider text-[11px]">Free</span>
                </div>
                <div className="border-t border-border-custom/50 pt-3 flex justify-between items-end">
                  <span className="font-serif text-base font-medium text-foreground">Grand Total</span>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Razorpay Placeholder Button */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0 cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>Proceed to Payment</span>
                </button>

                {/* Inline Notice about Razorpay Integration */}
                <div className="bg-accent/5 border border-accent/15 rounded-2xl p-4 flex gap-3 text-[11px] font-sans leading-relaxed text-accent">
                  <ShieldCheck size={18} className="shrink-0 mt-0.5 text-accent-secondary animate-pulse" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-[9px] mb-0.5">Development Integration Phase</span>
                    This page validates details before processing. In the next phase, clicking this will initiate the Razorpay Secure Checkout popup.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </section>
  );
}
