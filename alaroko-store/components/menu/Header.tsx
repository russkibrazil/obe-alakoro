import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"
import Button from "../common/Button";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  const {data: session, status} = useSession();
  
  const fireSearch = () => {
    if (searchQuery.trim().length > 0)
      router.push(`/store/search/${searchQuery}`)
  };
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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              type="search"
              onKeyDown={(event) => {
                if (["U+000D", "Enter"].includes(event.key))
                  fireSearch();
              }}
              placeholder="O que você está procurando?"
              className="w-full rounded-l-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="button"
              aria-label="Pesquisar"
              className="rounded-r-lg bg-black px-5 text-white transition hover:bg-gray-800"
              onClick={fireSearch}
            >
              🔍
            </button>
          </form>
        </div>

        {/* Ações */}
        <nav className="flex shrink-0 items-center gap-3">
          {/* Carrinho */}
          <Link
            href="/store/cart"
            aria-label="Acessar carrinho"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            🛒
            <span className="hidden md:inline">Carrinho</span>
          </Link>

          {/* Perfil */}
          {status === "authenticated" ? 
          (<>
          <Link
            href="/account"
            aria-label="Acessar perfil"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            👤
            <span className="hidden md:inline">Perfil</span>
          </Link>
          {session.user.role === "ROLE_ADMIN" ? (
            <Link
              href="/admin"
              aria-label="Acessar Dashboard Administrativo"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              ⚙️ <span className="hidden md:inline">Gerenciar</span>
            </Link>
          ) : <></>}
          <Button
            onClick={() => signOut()}
          >
            Sair
          </Button>
          </>) : (
            <Link
            href="/auth"
            aria-label="Login"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            🔐
            <span className="hidden md:inline">Login</span>
          </Link>
          )}
        </nav>

      </div>
    </header>
  );
}