import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Logo da loja"
            width={140}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </Link>

        {/* Barra de pesquisa */}
        <div className="flex flex-1 justify-center">
          <form className="flex w-full max-w-xl">
            <input
              type="search"
              placeholder="O que você está procurando?"
              className="w-full rounded-l-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="submit"
              aria-label="Pesquisar"
              className="rounded-r-lg bg-black px-5 text-white transition hover:bg-gray-800"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Ações */}
        <nav className="flex shrink-0 items-center gap-3">
          {/* Carrinho */}
          <Link
            href="/carrinho"
            aria-label="Acessar carrinho"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            🛒
            <span className="hidden md:inline">Carrinho</span>
          </Link>

          {/* Perfil */}
          <Link
            href="/perfil"
            aria-label="Acessar perfil"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            👤
            <span className="hidden md:inline">Perfil</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}