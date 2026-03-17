import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

import { useAppContext } from "./AppContext";

import { ProfileData } from "@/lib/types";
import { ghlContact } from "@/services/ghlContact";

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  fetchProfile: (id: string) => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAppContext();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (id: string) => {
      if (!user || !id) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await ghlContact(id);

        if (result.success) {
          setProfile(result.data as ProfileData);
        } else {
          setError(result.error || "Unknown error occurred");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch profile";
        console.error("Error fetching profile:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const updateProfile = useCallback((data: Partial<ProfileData>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...data,
        primary: data.primary ? { ...prev.primary, ...data.primary } : prev.primary,
        primaryMedical: data.primaryMedical
          ? { ...prev.primaryMedical, ...data.primaryMedical }
          : prev.primaryMedical,
        spouseDetails: data.spouseDetails
          ? { ...prev.spouseDetails, ...data.spouseDetails }
          : prev.spouseDetails,
        dependentsDetails: data.dependentsDetails
          ? { ...prev.dependentsDetails, ...data.dependentsDetails }
          : prev.dependentsDetails,
        statusDetails: data.statusDetails
          ? { ...prev.statusDetails, ...data.statusDetails }
          : prev.statusDetails,
      };
    });
  }, []);

  const clearProfile = () => {
    setProfile(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        fetchProfile,
        updateProfile,
        clearProfile,
        error,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return context;
}
