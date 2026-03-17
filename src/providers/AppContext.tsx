import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";
import { IUserData, SignUpData } from "@/lib/types";
import { getAuthRedirectUrl, logRedirectConfig } from "@/lib/utils";

interface AppState {
  user: User | null;
  userData: IUserData | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>;
  signUp: (data: SignUpData) => Promise<{ error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  resendVerification: (email: string) => Promise<{ error?: string; message?: string }>;
  deleteAccount: () => Promise<{ error?: string; success?: boolean }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    userData: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    logRedirectConfig();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        return;
      }

      setState((prev) => ({ ...prev, userData: data }));
    } catch (error) {
      console.error("Unexpected error loading profile:", error);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }));

      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
      }));

      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState((prev) => ({ ...prev, userData: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        return { error: error.message };
      }

      if (data.user) {
        await loadProfile(data.user.id);
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const signUp = async (signUpData: SignUpData) => {
    try {
      const { email, password, firstName, lastName, phone, ghl_id, project } = signUpData;

      const redirectTo = getAuthRedirectUrl("auth/confirm");

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            project: project || "boost",
            ghl_id,
          },
        },
      });

      if (authError) {
        console.error(`[AppProvider]: Sign up failed for status ${authError.status}`);
        return { error: authError.message };
      }

      const userId = authData.user?.id;
      if (!userId) {
        return { error: "User was not created!" };
      }

      // 2. Create profile record
      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: userId,
        project: project || "boost",
        email,
        phone,
        first_name: firstName,
        last_name: lastName,
        ghl_id,
      });

      if (insertError) {
        console.error(`[AppProvider]: Profile DB insertion failed. Code: ${insertError.code}`);
        return { error: "Failed to create user profile." };
      }

      return { message: "Account created successfully! Please check your email for verification." };
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      return { error: "An unexpected error occurred during sign up." };
    }
  };

  const refreshProfile = async () => {
    if (state.user?.id) {
      await loadProfile(state.user.id);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        userData: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectTo = getAuthRedirectUrl("auth/password-reset");

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        return { error: error.message };
      }

      return { message: "Password reset email sent! Check your inbox." };
    } catch (error) {
      console.error("Password reset error:", error);
      return { error: "Failed to send password reset email" };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const redirectTo = getAuthRedirectUrl("auth/confirm");

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { message: "Verification email sent! Check your inbox." };
    } catch (error) {
      console.error("Resend verification error:", error);
      return { error: "Failed to resend verification email" };
    }
  };

  const deleteAccount = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { error: functionError } = await supabase.functions.invoke("delete-user-account");
      if (functionError) throw functionError;

      await logout();

      return { success: true };
    } catch (error: any) {
      console.error("Account deletion error:", error);
      return { error: error.message || "An unexpected error occurred during account deletion." };
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        signUp,
        logout,
        refreshProfile,
        resetPassword,
        resendVerification,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
