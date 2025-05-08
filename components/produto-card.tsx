import type { Produto } from "@/types/produto"

interface ProdutoCardProps {
  produto: Produto
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  function formataPreco(preco: number) {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <div className="produto-card flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="produto-nome text-xl font-semibold mb-2">{produto.nome}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{produto.descricao}</p>
        <div className="mt-auto">
          {produto.tem_desconto ? (
            <div>
              <span className="preco-original text-sm mr-2">{formataPreco(produto.preco_original)}</span>
              <span className="preco-desconto text-2xl font-bold">{formataPreco(produto.preco)}</span>
            </div>
          ) : (
            <span className="text-2xl font-bold">{formataPreco(produto.preco)}</span>
          )}
        </div>
      </div>
    </div>
  )
}