import { supabase } from "./Supabase";

class AuthService {
	// Sign up a new user
	async signup(email: string, password: string, data?: Record<string, any>) {
		const { data: signUpData, error } = await supabase.auth.signUp({
			email,
			password,
			options: { data },
		});
		return { user: signUpData?.user, session: signUpData?.session, error };
	}

	// Log in an existing user
	async login(email: string, password: string) {
		const { data: signInData, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { user: signInData?.user, session: signInData?.session, error };
	}

	// Log out the current user
	async logout() {
		const { error } = await supabase.auth.signOut();
		return { error };
	}

	// Delete the current user (must be signed in)
	async delete() {
		const { data, error } = await supabase.auth.admin.deleteUser(
			(await supabase.auth.getUser()).data.user?.id || ''
		);
		return { data, error };
	}

	// Update user profile (in 'profiles' table)
	async updateProfile(updates: Record<string, any>) {
		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return { error: 'No user logged in' };
		const { data, error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', user.id)
			.single();
		return { data, error };
	}
}

export const auth = new AuthService();
