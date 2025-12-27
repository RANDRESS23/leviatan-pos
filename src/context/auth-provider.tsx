"use client";

import { createContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AuthUser } from "@supabase/supabase-js";
import { getUserByAuthId } from "@/actions/user";

export type User = {
  id: string;
  authId: string;
  empresaId: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  telefono: string;
  activo: boolean;
  empresa: {
    nombre: string;
    moduloRestaurante: boolean;
    estadoId: string;
    estado: {
      codigo: string;
    };
  };
};

const AuthContext = createContext<{
  authUser: AuthUser | null;
  user: User | null;
  loading: boolean;
} | null>(null);

const AuthProvideer = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(session.access_token);
          if (error || !user) {
            console.error("Error verifying user:", error);
            setAuthUser(null);
            setUser(null);
          } else {
            setAuthUser(user);
            const { usuario } = await getUserByAuthId(user.id);
            setUser((usuario as User) || null);
          }
        } else {
          setAuthUser(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setAuthUser(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            const {
              data: { user },
              error,
            } = await supabase.auth.getUser(session.access_token);
            if (error || !user) {
              console.error("Error verifying user:", error);
              setAuthUser(null);
              setUser(null);
            } else {
              setAuthUser(user);
              const { usuario } = await getUserByAuthId(user.id);
              setUser((usuario as User) || null);
            }
          } else {
            setAuthUser(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setAuthUser(null);
          setUser(null);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvideer };
