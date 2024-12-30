interface EnvVars {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function validateUrl(url: string, name: string): string {
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(
      `Invalid ${name}: "${url}". Please click the "Connect to Supabase" button to set up your database connection properly.`
    );
  }
}

function validateEnvVars(): EnvVars {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check if variables are present
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Please click the "Connect to Supabase" button to set up your database connection.'
    );
  }

  // Validate URL format
  const validatedUrl = validateUrl(supabaseUrl, 'SUPABASE_URL');

  return {
    supabaseUrl: validatedUrl,
    supabaseAnonKey,
  };
}

export const env = validateEnvVars();