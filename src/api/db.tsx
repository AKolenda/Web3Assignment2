import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

export async function selectArtists() {
  console.log("getting from supabase ... here to check if I’ve gone infinite");
  const { data, error } = await supabase.from("artists").select("*");
  if (error) {
    console.error("Error fetching artists:", error);
    return;
  }
  return data;
}
