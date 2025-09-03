import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthContext provides the authentication/session state and actions using Supabase.
 *
 * Values provided:
 * - user: Supabase user object or null
 * - session: Supabase session or null
 * - loading: boolean indicating if auth state is initializing/submitting
 * - signIn(email, password): sign in with email/password
 * - signUp({ email, password, metadata }): sign up a new user
 * - signOut(): sign out current user
 * - requestPasswordReset(email): sends a password reset email
 *
 * The provider also listens for auth state changes to keep session in sync.
 */
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  requestPasswordReset: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize session and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session: s },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to restore session:', e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // redirect to intended route
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, metadata }) => {
    setLoading(true);
    try {
      const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: siteUrl, // required: correct redirect for Supabase email flows
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login', { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: siteUrl,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
