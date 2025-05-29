import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { authService, User } from "@/services/AuthService";
import { notificationService } from "@/services/NotificationService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await authService.getCurrentUser();
        setUser(userData);

        // Request notification permission and subscribe to relevant topics
        try {
          const token = await notificationService.requestPermission();
          if (token) {
            await notificationService.subscribeToTopic(token, `user_${firebaseUser.uid}`);
          }
        } catch (error) {
          console.error('Error setting up notifications:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      toast(<div>
        <strong>Welcome back!</strong>
        <div>Successfully signed in.</div>
      </div>);
    } catch (error) {
      console.error('Login error:', error);
      toast(<div>
        <strong>Error</strong>
        <div>Invalid email or password.</div>
      </div>);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const userData = await authService.register(email, password, displayName);
      setUser(userData);
      toast(<div>
        <strong>Welcome to TaskHub!</strong>
        <div>Your account has been created successfully.</div>
      </div>);
    } catch (error) {
      console.error('Registration error:', error);
      toast(<div>
        <strong>Error</strong>
        <div>Could not create account. Please try again.</div>
      </div>);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast(<div>
        <strong>Signed out</strong>
        <div>See you next time!</div>
      </div>);
    } catch (error) {
      console.error('Logout error:', error);
      toast(<div>
        <strong>Error</strong>
        <div>Could not sign out. Please try again.</div>
      </div>);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
