import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Categoria, Product } from "@/generated/prisma/client";
import { CardProduct } from "@/components/cards/CardProduct";

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    fetch('/api/products/home')
      .then(r=>r.json())
      .then(setProducts);
    fetch('/api/categories/home')
      .then(r=>r.json())
      .then(setCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");

    if (!term) return products;

    return products.filter((product) => {
      const nameMatches = product.name
        .toLocaleLowerCase("pt-BR")
        .includes(term);

      const categoryMatches = product.categoria?.name
        .toLocaleLowerCase("pt-BR")
        .includes(term);

      return nameMatches || categoryMatches;
    });
  }, [products, search]);

  return (
    <>
      <Head>
        <title>Minha Loja | Encontre seus produtos favoritos</title>
        <meta
          name="description"
          content="Descubra produtos, explore categorias e encontre o que você procura na nossa loja."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white text-gray-900">
        {/* Cabeçalho */}
        {/* <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="shrink-0 text-2xl font-extrabold tracking-tight text-gray-950"
            >
              minha<span className="text-indigo-600">loja.</span>
            </Link>

            <div className="hidden max-w-xl flex-1 md:block">
              <label htmlFor="product-search" className="sr-only">
                Buscar produtos
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white">
                <SearchIcon />

                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="O que você está procurando?"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <nav
              aria-label="Navegação principal"
              className="flex items-center gap-4 sm:gap-6"
            >
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-indigo-600"
              >
                <UserIcon />
                <span className="hidden lg:inline">Minha conta</span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-indigo-600"
              >
                <ShoppingBagIcon />
                <span className="hidden lg:inline">Carrinho</span>
              </Link>
            </nav>
          </div>

          {/* Busca para telas menores */}
          {/*<div className="px-4 pb-4 md:hidden">
            <label htmlFor="product-search-mobile" className="sr-only">
              Buscar produtos
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <SearchIcon />

              <input
                id="product-search-mobile"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produtos..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </header> */}

        <main>
          {/* Banner principal */}
          <section className="overflow-hidden bg-gray-950">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  Sua próxima descoberta começa aqui
                </span>

                <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Produtos que combinam com{" "}
                  <span className="text-indigo-400">você.</span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
                  Explore nossa seleção de produtos e encontre opções para
                  facilitar o seu dia a dia.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#produtos"
                    className="rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-400"
                  >
                    Explorar produtos
                  </a>

                  <a
                    href="#categorias"
                    className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Ver categorias
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
                  <span>✓ Compra simples</span>
                  <span>✓ Pagamento seguro</span>
                  <span>✓ Atendimento dedicado</span>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-4xl bg-indigo-500/20 blur-3xl" />

                <div className="relative flex min-h-90 flex-col justify-between overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-indigo-500 via-indigo-700 to-gray-900 p-10">
                  <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border-40 border-white/10" />

                  <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-white/5" />

                  <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
                      Escolhas para você
                    </p>

                    <p className="mt-4 max-w-sm text-4xl font-bold leading-tight text-white">
                      Descubra algo novo hoje.
                    </p>
                  </div>

                  <div className="relative flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-indigo-100">
                        Explore a nossa coleção
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        Encontre seus favoritos
                      </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-9 w-9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path d="M5 8h14l1 13H4L5 8Z" />
                        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefícios */}
          <section
            aria-label="Benefícios da loja"
            className="border-b border-gray-100 bg-white"
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  >
                    <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
                    <circle cx="7.5" cy="18" r="1.5" />
                    <circle cx="17.5" cy="18" r="1.5" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Entrega acompanhada</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Consulte o status do seu pedido.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="m10 15 1.5 1.5L14.5 13" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Compra protegida</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Mais tranquilidade no seu pedido.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  >
                    <path d="M20 11.5a7.5 7.5 0 0 1-11.4 6.4L4 19l1.1-4.2A7.5 7.5 0 1 1 20 11.5Z" />
                    <path d="M9 9.5c.6 1.8 1.7 2.9 3.5 3.5" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Atendimento dedicado</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Conte com nossa equipe.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Categorias */}
          <section
            id="categorias"
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                  Explore a loja
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                  Navegue por categorias
                </h2>

                <p className="mt-2 text-gray-500">
                  Encontre rapidamente o que procura.
                </p>
              </div>

              <Link
                href="/store/categories"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Todas as categorias →
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/store/categories/${category.slug}`}
                    className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm transition group-hover:bg-indigo-600 group-hover:text-white">
                      <span className="text-lg font-bold">
                        {category.name.charAt(0).toLocaleUpperCase("pt-BR")}
                      </span>
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {category.productsCount}{" "}
                      {category.productsCount === 1
                        ? "produto"
                        : "produtos"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-gray-50 px-6 py-10 text-center text-gray-500">
                As categorias estarão disponíveis em breve.
              </p>
            )}
          </section>

          {/* Produtos */}
          <section id="produtos" className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                    Nossa seleção
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                    {search
                      ? "Resultados da busca"
                      : "Produtos para descobrir"}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {search
                      ? `Resultados para "${search}".`
                      : "Confira os produtos disponíveis na nossa loja."}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "produto" : "produtos"}
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
                    // <ProductCard key={product.id} product={product} />
                    <CardProduct
                      key={product.id}
                      id={product.id}
                      productName={product.name}
                      active={product.active}
                      price={Number(product.price)}
                      stock={Number(product.stock)}
                      />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <SearchIcon />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Nenhum produto encontrado
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Tente pesquisar por outro nome ou categoria.
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              )}

              <div className="mt-10 text-center">
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  Ver todos os produtos
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* Banner secundário */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="overflow-hidden rounded-3xl bg-indigo-600 px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-14">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
                  Sua próxima compra
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Encontre algo que faça a diferença.
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-indigo-100">
                  Explore as categorias, conheça os produtos e escolha o que
                  combina com suas necessidades.
                </p>
              </div>

              <Link
                href="/store/categories"
                className="mt-8 inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 lg:ml-8 lg:mt-0"
              >
                Explorar categorias →
              </Link>
            </div>
          </section>
        </main>

        {/* Rodapé */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Link
                  href="/"
                  className="text-2xl font-extrabold tracking-tight text-gray-950"
                >
                  minha<span className="text-indigo-600">loja.</span>
                </Link>

                <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
                  Uma experiência de compra simples para você encontrar seus
                  produtos favoritos.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Navegação</h3>

                <ul className="mt-4 space-y-3 text-sm text-gray-500">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-indigo-600"
                    >
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store/categories"
                      className="hover:text-indigo-600"
                    >
                      Categorias
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store/products"
                      className="hover:text-indigo-600"
                    >
                      Produtos
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Minha conta</h3>

                <ul className="mt-4 space-y-3 text-sm text-gray-500">
                  <li>
                    <Link href="/login" className="hover:text-indigo-600">
                      Entrar
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-indigo-600">
                      Criar conta
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-indigo-600">
                      Meus pedidos
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Atendimento</h3>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Precisa de ajuda com sua compra? Entre em contato com nossa
                  equipe pelos canais de atendimento da loja.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-500 sm:flex sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Minha Loja. Todos os direitos
                reservados.
              </p>

              <p className="mt-2 sm:mt-0">
                Desenvolvido para facilitar sua experiência de compra.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}