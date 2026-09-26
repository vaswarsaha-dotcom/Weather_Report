"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { PublicUser } from "@/types/user";

interface AuthState {
  user: PublicUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] =
    useState<AuthState>({
      user: null,
      loading: true,
      error: null,
    });

  /* ---------------------------------------------------------- */
  /* Check current session                                      */
  /* ---------------------------------------------------------- */

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/auth/me",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setState({
          user: null,
          loading: false,
          error: null,
        });

        return;
      }

      const data =
        await response.json();

      setState({
        user: data.user ?? null,
        loading: false,
        error: null,
      });
    } catch {
      setState({
        user: null,
        loading: false,
        error: "Couldn't reach the server.",
      });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ---------------------------------------------------------- */
  /* LOGIN                                                     */
  /* ---------------------------------------------------------- */

  const login = useCallback(
    async (
      email: string,
      password: string
    ) => {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              email:
                email.trim().toLowerCase(),
              password,
            }),
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        const message =
          data.error ||
          "Invalid email or password.";

        setState((current) => ({
          ...current,
          error: message,
        }));

        throw new Error(message);
      }

      setState({
        user: data.user,
        loading: false,
        error: null,
      });

      return data.user as PublicUser;
    },
    []
  );

  /* ---------------------------------------------------------- */
  /* SIGNUP                                                    */
  /* ---------------------------------------------------------- */

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string
    ) => {
      const response =
        await fetch(
          "/api/auth/signup",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              email:
                email.trim().toLowerCase(),
              password,
              name: name.trim(),
            }),
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        const message =
          data.error ||
          "Unable to create account.";

        setState((current) => ({
          ...current,
          error: message,
        }));

        throw new Error(message);
      }

      /*
       * If Supabase email confirmation is enabled,
       * there may not be a logged-in session yet.
       */
      if (data.user) {
        setState({
          user: data.user,
          loading: false,
          error: null,
        });
      }

      return data;
    },
    []
  );

  /* ---------------------------------------------------------- */
  /* LOGOUT                                                    */
  /* ---------------------------------------------------------- */

  const logout = useCallback(async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } finally {
      setState({
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,

    login,
    signup,
    logout,
    refresh,
  };
}