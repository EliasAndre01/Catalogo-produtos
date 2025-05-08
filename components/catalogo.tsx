"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import type { Produto } from "@/types/produto"
import ProdutoCard from "./produto-card"

export default function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setCarregando(true)
      console.log("Tentando carregar produtos do Supabase...")
      
      const { data, error } = await supabase.from("produtos").select("*").order("id")

      if (error) {
        console.error("Erro do Supabase:", error)
        throw error
      }

      console.log("Produtos carregados:", data)
      
      if (data) {
        setProdutos(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setErro("Não foi possível carregar os produtos. Tente novamente mais tarde.")
    } finally {
      setCarregando(false)
    }
  }

  async function aplicarDesconto() {
    try {
      setCarregando(true)

      // Primeiro, obtém todos os produtos que não têm desconto
      const { data: produtosSemDesconto, error: erroConsulta } = await supabase
        .from("produtos")
        .select("*")
        .eq("tem_desconto", false)

      if (erroConsulta) throw erroConsulta

      if (produtosSemDesconto && produtosSemDesconto.length > 0) {
        // Para cada produto sem desconto, aplica o desconto
        const atualizacoes = produtosSemDesconto.map(async (produto) => {
          const novoPreco = produto.preco * 0.9

          const { error } = await supabase
            .from("produtos")
            .update({
              preco: novoPreco,
              tem_desconto: true,
            })
            .eq("id", produto.id)

          if (error) throw error
        })

        // Aguarda todas as atualizações serem concluídas
        await Promise.all(atualizacoes)

        // Recarrega os produtos para mostrar os novos preços
        await carregarProdutos()
      }
    } catch (error) {
      console.error("Erro ao aplicar desconto:", error)
      setErro("Não foi possível aplicar o desconto. Tente novamente mais tarde.")
    } finally {
      setCarregando(false)
    }
  }

  if (erro) {
    return <div className="text-red-500 text-center py-8">{erro}</div>
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[var(--cor-primaria)]">Catálogo de Produtos</h1>
        <button onClick={aplicarDesconto} className="btn-desconto" disabled={carregando}>
          {carregando ? "Processando..." : "Aplicar Desconto de 10%"}
        </button>
      </header>

      <main>
        {carregando && produtos.length === 0 ? (
          <div className="text-center py-8">Carregando produtos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produtos.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}