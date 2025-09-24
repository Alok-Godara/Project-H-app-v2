// import { User } from "lucide-react-native";
import { supabase } from "./Supabase";

interface CreateAccountParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResult {
  user: any | null;
  error: any | null;
}

export class AuthService {
  async createAccountService(obj: CreateAccountParams): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: obj.email,
        password: obj.password,
        options: {
          data: { name: obj.name, phone: obj.phone},
        },
      });
      if (error) return { user: null, error };
	    
      if (data.user) {
        console.log("Supabase user:", data.user);
        const patientInsert = {
          id: data.user.id,
          name: data.user.user_metadata?.name,
          email: data.user.email,
          password: obj.password, // Not recommended to store plain password!
          phone: data.user.user_metadata?.phone
        };
        const { error: dbError, data: dbData } = await supabase
          .from("patients")
          .insert([patientInsert]);
        if (dbError || !dbData) {
          return { user: null, error: dbError || "Failed to insert user in patients table" };
        }
        return { user: data.user, error: null };
      } else {
        return { user: null, error: "User creation failed" };
      }
	  
    } catch (error) {
      return { user: null, error };
    }
    
  }

  async loginService({ email, password }: LoginParams): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { user: null, error };
      return { user: data.user, error: null };
    } catch (error) {
      // console.error("Supabase service :: login :: error", error);
      return { user: null, error };
    }
  }

  async getCurrentUserService(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) return { user: null, error };
      return { user: data.user, error: null };
    } catch (error) {
      // console.error("Supabase service :: getCurrentUser :: error", error);
      return { user: null, error };
    }
  }

  async logoutService(): Promise<boolean> {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error("Supabase service :: logout :: error", error);
      return false;
    }
  }

  // async signInWithGoogle() {
  //   try {
  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: String(import.meta.env.VITE_REDIRECT_URL),
  //       },
  //     });
  //     if (error) throw error;

  //     return data;
  //   } catch (error) {
  //     // console.error("Supabase service :: signInWithGoogle :: error", error);
  //     throw error;
  //   }
  // }
}

const authService = new AuthService();

export default authService;