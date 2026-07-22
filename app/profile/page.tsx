"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Lock, Mail, Upload, UserRound } from "lucide-react";
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

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useCustomerAuth();
  const [fullName, setFullName] = useState("");
  const [currentProfile, setCurrentProfile] = useState<ProfileResponse | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setCurrentProfile(profile as unknown as ProfileResponse);
      if (profile.full_name) {
        setFullName(profile.full_name);
      }
    } else if (user) {
      if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      } else if (user.email) {
        setFullName(user.email);
      }
    }
  }, [profile, user]);

  const avatarUrl = currentProfile?.avatar_url ?? profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const displayName = currentProfile?.full_name ?? profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email ?? "Customer";
  const email = currentProfile?.email ?? profile?.email ?? user?.email ?? "";
  const createdAt = currentProfile?.created_at ?? user?.created_at ?? null;

  const handleNameSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsSavingName(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
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

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Customer Profile</span>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">Manage your account.</h1>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
            Update your name, profile picture, and password. Your email and account creation date are shown below for reference.
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-border-custom bg-white px-4 py-3 text-sm text-foreground/70 shadow-xs">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-border-custom rounded-3xl shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-accent font-semibold text-xl shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span>{displayName.split(" ").filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase()).join("") || "C"}</span>
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

            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border-custom text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-background/60 cursor-pointer transition-colors">
                {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span>{isUploadingAvatar ? "Uploading..." : "Update Profile Picture"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingName}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-75"
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
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
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
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground hover:bg-foreground/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-75"
              >
                {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>{isUpdatingPassword ? "Updating..." : "Change Password"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
