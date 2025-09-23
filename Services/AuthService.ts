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
    console.log(
      "data for signup:",
      obj.email,
      obj.password,
      obj.name,
      obj.phone
    );
    try {
      const { data, error } = await supabase.auth.signUp({
        email: obj.email,
        password: obj.password,
        options: {
          data: { name: obj.name, phone: obj.phone, password: obj.password },
        },
      });
      if (error) return { user: null, error };
	  console.log(error);
	  
      if (data.user) {
		console.log(data);
        await supabase
          .from("patients")
          .insert([{ id: data.user.id, name: obj.name, email: data.user.email, phone: obj.phone }]);
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