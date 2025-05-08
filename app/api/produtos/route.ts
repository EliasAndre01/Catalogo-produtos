import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("produtos").select("*").order("id")

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createServerClient()

  try {
    const { acao } = await request.json()

    if (acao === "aplicarDesconto") {
      // Primeiro, obtém todos os produtos que não têm desconto
      const { data: produtosSemDesconto, error: erroConsulta } = await supabase
        .from("produtos")
        .select("*")
        .eq("tem_desconto", false)

      if (erroConsulta) throw erroConsulta

      if (produtosSemDesconto && produtosSemDesconto.length > 0) {
        // Para cada produto sem desconto, aplica o desconto
        for (const produto of produtosSemDesconto) {
          const novoPreco = produto.preco * 0.9

          const { error } = await supabase
            .from("produtos")
            .update({
              preco: novoPreco,
              tem_desconto: true,
            })
            .eq("id", produto.id)

          if (error) throw error
        }

        return NextResponse.json({ success: true, message: "Desconto aplicado com sucesso" })
      } else {
        return NextResponse.json({ success: true, message: "Todos os produtos já possuem desconto" })
      }
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}