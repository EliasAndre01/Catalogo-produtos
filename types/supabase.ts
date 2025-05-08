import { createClient } from "@supabase/supabase-js"

// Criando cliente para o servidor
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

// Criando cliente para o cliente (browser)
let supabaseClient: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log("Conectando ao Supabase URL:", supabaseUrl)
  console.log("Usando chave anônima (primeiros caracteres):", supabaseKey.substring(0, 5) + "...")

  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}