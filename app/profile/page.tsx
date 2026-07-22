"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Upload, UserRound, MapPin, Plus, Trash2, Edit3, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface ProfileResponse {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface Address {
  id: string;
  full_name: string;
  phone: string;
  house_flat: string;
  street: string;
  landmark?: string | null;
  city: string;
  state: string;
  pin_code: string;
  is_default: boolean;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Puducherry"
];

function ProfileContent() {
  const { user, profile, refreshProfile } = useCustomerAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = searchParams.get("saved") === "addresses" ? "addresses" : "profile";

  // Profile fields state
  const [fullName, setFullName] = useState("");
  const [currentProfile, setCurrentProfile] = useState<ProfileResponse | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Saved Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(false);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseFlat: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false
  });

  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setCurrentProfile(profile);
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  // Load addresses
  const loadAddresses = async () => {
    setIsAddressesLoading(true);
    try {
      const res = await fetch("/api/customer/addresses");
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setIsAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  // Clean message on tab change
  useEffect(() => {
    setMessage(null);
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({
      fullName: "",
      phone: "",
      houseFlat: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pinCode: "",
      isDefault: false
    });
    setAddressErrors({});
  }, [activeTab]);

  const handleNameSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (fullName.trim() === "") {
      setMessage("Name cannot be empty.");
      return;
    }

    setMessage(null);
    setIsSavingName(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to update name.");
      }

      setCurrentProfile(data.profile);
      setMessage("Profile name updated successfully.");
      await refreshProfile();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update name.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/auth/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to upload avatar.");
      }

      setCurrentProfile(data.profile);
      setMessage("Profile picture updated successfully.");
      await refreshProfile();
      event.target.value = "";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage("Password should be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        throw error;
      }

      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Address validation
  const validateAddressForm = () => {
    const errs: Record<string, string> = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^[1-9]\d{5}$/;

    if (!addressForm.fullName.trim()) errs.fullName = "Full name is required";
    
    if (!addressForm.phone.trim()) {
      errs.phone = "Phone number is required";
    } else {
      const cleanPhone = addressForm.phone.replace(/[\s-]/g, "").replace(/^\+91/, "").replace(/^0/, "");
      if (!phoneRegex.test(cleanPhone)) {
        errs.phone = "Enter a valid 10-digit Indian phone number";
      }
    }

    if (!addressForm.houseFlat.trim()) errs.houseFlat = "House/Flat detail is required";
    if (!addressForm.street.trim()) errs.street = "Street/Locality is required";
    if (!addressForm.city.trim()) errs.city = "City is required";
    if (!addressForm.state.trim()) errs.state = "State selection is required";
    
    if (!addressForm.pinCode.trim()) {
      errs.pinCode = "PIN Code is required";
    } else if (!pinRegex.test(addressForm.pinCode.trim())) {
      errs.pinCode = "Enter a valid 6-digit Indian PIN Code";
    }

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    setIsAddressSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        id: editingAddressId || undefined,
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        houseFlat: addressForm.houseFlat.trim(),
        street: addressForm.street.trim(),
        landmark: addressForm.landmark ? addressForm.landmark.trim() : undefined,
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        pinCode: addressForm.pinCode.trim(),
        isDefault: addressForm.isDefault
      };

      const method = editingAddressId ? "PATCH" : "POST";
      const res = await fetch("/api/customer/addresses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to save address.");
      }

      setMessage(editingAddressId ? "Address updated successfully." : "Address added successfully.");
      setAddressForm({
        fullName: "",
        phone: "",
        houseFlat: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pinCode: "",
        isDefault: false
      });
      setEditingAddressId(null);
      setShowAddressForm(false);
      await loadAddresses();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to save address.");
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.full_name,
      phone: addr.phone,
      houseFlat: addr.house_flat,
      street: addr.street,
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pinCode: addr.pin_code,
      isDefault: addr.is_default
    });
    setAddressErrors({});
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/customer/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to delete address.");
      }
      setMessage("Address deleted successfully.");
      await loadAddresses();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to delete address.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    setMessage(null);
    try {
      const res = await fetch("/api/customer/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to set default address.");
      }
      await loadAddresses();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to set default address.");
    }
  };

  const displayName = currentProfile?.full_name || user?.email?.split("@")[0] || "Customer";
  const email = currentProfile?.email || user?.email || "";
  const avatarUrl = currentProfile?.avatar_url || null;
  const createdAt = currentProfile?.created_at || null;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Customer Dashboard</span>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
            {activeTab === "addresses" ? "Saved Addresses" : "Manage your account."}
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
            {activeTab === "addresses"
              ? "Manage your delivery locations to simplify checkout."
              : "Update your name, profile picture, and password."}
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-border-custom bg-white px-4 py-3 text-sm text-foreground/70 shadow-xs">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white border border-border-custom rounded-3xl shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-accent font-semibold text-xl shrink-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-foreground/40">Signed in as</p>
                <h2 className="font-serif text-2xl text-foreground truncate">{displayName}</h2>
                <p className="text-sm text-foreground/60 truncate">{email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-custom bg-background/60 p-4 space-y-3 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserRound size={16} className="text-accent" />
                <span>
                  Joined {createdAt ? new Date(createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "recently"}
                </span>
              </div>
            </div>

            <div className="space-y-3 pb-3">
              <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border-custom text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-background/60 cursor-pointer transition-colors">
                {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span>{isUploadingAvatar ? "Uploading..." : "Update Profile Picture"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>

            {/* Sidebar Navigation */}
            <div className="border-t border-border-custom/50 pt-5 space-y-2">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab !== "addresses"
                    ? "bg-accent/10 text-accent font-bold"
                    : "text-foreground/75 hover:bg-slate-55"
                }`}
              >
                <UserRound size={16} />
                <span>Profile Settings</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile?saved=addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-accent/10 text-accent font-bold"
                    : "text-foreground/75 hover:bg-slate-55"
                }`}
              >
                <MapPin size={16} />
                <span>Saved Addresses</span>
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <>
                <form onSubmit={handleNameSave} className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 md:p-8 space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-foreground">Update Name</h3>
                    <p className="text-sm text-foreground/60">Keep your display name current on your profile and orders.</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="profile-name" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserRound size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                      <input
                        id="profile-name"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors bg-background"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingName}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-75 cursor-pointer font-sans"
                  >
                    {isSavingName ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{isSavingName ? "Saving..." : "Save Name"}</span>
                  </button>
                </form>

                <form onSubmit={handlePasswordUpdate} className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 md:p-8 space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-foreground">Change Password</h3>
                    <p className="text-sm text-foreground/60">Set a new password for your customer account.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors bg-background"
                          placeholder="At least 8 characters"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors bg-background"
                          placeholder="Repeat password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground hover:bg-foreground/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-75 cursor-pointer font-sans"
                  >
                    {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{isUpdatingPassword ? "Updating..." : "Change Password"}</span>
                  </button>
                </form>
              </>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                {showAddressForm ? (
                  /* Address Form */
                  <form onSubmit={handleAddressSubmit} className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 md:p-8 space-y-6 animate-fadeIn font-sans">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl text-foreground">
                        {editingAddressId ? "Edit Saved Address" : "Add Saved Address"}
                      </h3>
                      <p className="text-xs text-foreground/60">
                        Please enter the correct delivery details to save this address.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="e.g. Mudit Sen"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.fullName ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.fullName && <p className="text-[11px] text-red-500">{addressErrors.fullName}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="10-digit mobile number"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.phone ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.phone && <p className="text-[11px] text-red-500">{addressErrors.phone}</p>}
                      </div>

                      {/* PIN Code */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={addressForm.pinCode}
                          onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                          placeholder="6-digit ZIP / PIN code"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.pinCode ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.pinCode && <p className="text-[11px] text-red-500">{addressErrors.pinCode}</p>}
                      </div>

                      {/* House/Flat */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Flat, House No., Building, Apartment *
                        </label>
                        <input
                          type="text"
                          value={addressForm.houseFlat}
                          onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                          placeholder="e.g. Apt 4B, Sunflower Apartments"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.houseFlat ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.houseFlat && <p className="text-[11px] text-red-500">{addressErrors.houseFlat}</p>}
                      </div>

                      {/* Street */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Area, Street, Sector, Village *
                        </label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="e.g. 5th Main, Sector 7, HSR Layout"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.street ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.street && <p className="text-[11px] text-red-500">{addressErrors.street}</p>}
                      </div>

                      {/* Landmark */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Landmark <span className="text-[10px] text-foreground/45 lowercase font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="e.g. Near HDFC Bank ATM"
                          className="w-full px-4 py-3 rounded-xl border border-border-custom bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        />
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          Town / City *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="Enter city"
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.city ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        />
                        {addressErrors.city && <p className="text-[11px] text-red-500">{addressErrors.city}</p>}
                      </div>

                      {/* State */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                          State *
                        </label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-all ${
                            addressErrors.state ? "border-red-400 focus:ring-red-400" : "border-border-custom"
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        {addressErrors.state && <p className="text-[11px] text-red-500">{addressErrors.state}</p>}
                      </div>

                      {/* Default address checkbox */}
                      <div className="md:col-span-2 pt-2 flex items-center">
                        <label className="relative flex items-center gap-2 cursor-pointer text-sm text-foreground/70 select-none">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4.5 h-4.5 accent-accent border-border-custom rounded-sm cursor-pointer"
                          />
                          <span>Set as default delivery address</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-3 border-t border-border-custom/50">
                      <button
                        type="submit"
                        disabled={isAddressSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-75 cursor-pointer font-sans"
                      >
                        {isAddressSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                        <span>{isAddressSubmitting ? "Saving..." : "Save Address"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                        className="inline-flex items-center justify-center px-6 py-3.5 border border-border-custom hover:bg-slate-55 text-foreground/75 text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors cursor-pointer font-sans"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Addresses list view */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white border border-border-custom rounded-3xl p-5 md:p-6 shadow-xs">
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl md:text-2xl text-foreground">Delivery Addresses</h3>
                        <p className="text-xs text-foreground/50 font-sans">
                          A list of locations where you regularly receive orders.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm({
                            fullName: profile?.full_name || "",
                            phone: "",
                            houseFlat: "",
                            street: "",
                            landmark: "",
                            city: "",
                            state: "",
                            pinCode: "",
                            isDefault: addresses.length === 0 // default if first address
                          });
                          setAddressErrors({});
                          setShowAddressForm(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer font-sans"
                      >
                        <Plus size={14} />
                        <span>Add Address</span>
                      </button>
                    </div>

                    {isAddressesLoading ? (
                      /* Address Loader */
                      <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-white border border-border-custom rounded-3xl p-6 h-48 animate-pulse space-y-4">
                            <div className="h-4 w-1/3 bg-border-custom/50 rounded" />
                            <div className="h-3 w-3/4 bg-border-custom/50 rounded" />
                            <div className="h-3 w-1/2 bg-border-custom/50 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : addresses.length === 0 ? (
                      /* Address Empty State */
                      <div className="bg-white border border-border-custom rounded-3xl p-8 md:p-12 text-center shadow-xs space-y-5 font-sans">
                        <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                          <MapPin size={24} />
                        </div>
                        <div className="space-y-1 max-w-sm mx-auto">
                          <h4 className="font-serif text-lg font-semibold text-foreground">No saved addresses</h4>
                          <p className="text-xs text-foreground/60 leading-relaxed font-light">
                            You haven&apos;t saved any shipping addresses yet. Add one now to check out faster on your next order!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({
                              fullName: profile?.full_name || "",
                              phone: "",
                              houseFlat: "",
                              street: "",
                              landmark: "",
                              city: "",
                              state: "",
                              pinCode: "",
                              isDefault: true
                            });
                            setAddressErrors({});
                            setShowAddressForm(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-3 border border-accent text-accent hover:bg-accent/5 font-semibold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Add Your First Address</span>
                        </button>
                      </div>
                    ) : (
                      /* Addresses Grid */
                      <div className="grid md:grid-cols-2 gap-4 font-sans">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`bg-white border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 ${
                              addr.is_default ? "border-accent ring-1 ring-accent" : "border-border-custom hover:border-foreground/20"
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-serif text-base font-semibold text-foreground truncate">
                                  {addr.full_name}
                                </h4>
                                {addr.is_default && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/25">
                                    <Check size={9} /> Default
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-foreground/70 space-y-1 font-light leading-relaxed">
                                <p className="font-medium text-foreground">{addr.house_flat}, {addr.street}</p>
                                {addr.landmark && <p className="italic text-foreground/50">Landmark: {addr.landmark}</p>}
                                <p>{addr.city}, {addr.state} - {addr.pin_code}</p>
                                <p className="pt-1.5 flex items-center gap-1 font-normal text-foreground/80">
                                  <span className="font-semibold text-foreground/60 text-[10px] uppercase tracking-wider">Phone:</span> {addr.phone}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-border-custom/50 pt-4 mt-5">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditAddress(addr)}
                                  className="p-2 hover:bg-slate-55 text-foreground/60 hover:text-accent rounded-lg transition-colors cursor-pointer"
                                  title="Edit Address"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="p-2 hover:bg-red-50 text-foreground/60 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Address"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {!addr.is_default && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[10px] uppercase tracking-widest font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer"
                                >
                                  Set Default
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24 bg-background">
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-border-custom/50 mx-auto" />
            <div className="h-4 w-32 bg-border-custom/50 rounded mx-auto" />
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
