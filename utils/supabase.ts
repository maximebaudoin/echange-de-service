import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cueyjkpypieghxgzecxh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZXlqa3B5cGllZ2h4Z3plY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5ODAxOTYsImV4cCI6MjA0ODU1NjE5Nn0.jtrjuNzSgwnQ3SSTMacoR_03FjhJ5dL-xwgkLkAnkl4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
