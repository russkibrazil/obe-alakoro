import { User } from '@/generated/prisma/client';
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface Customers extends User {
  _count: {pedidos: number};
}

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Customers[]>([]);
  useEffect(() => {
    fetch('/api/customers')
      .then(response => response.json())
      .then(setClients);
  }, [])

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [clients, search])

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de clientes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Visualize os clientes cadastrados na loja.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Clientes cadastrados
              </h2>

              <p className="text-sm text-gray-500">
                {filteredClients.length} cliente(s) encontrado(s)
              </p>
            </div>

            <input
              type="search"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:w-80"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Cliente</th>
                  <th className="px-5 py-4 font-semibold">E-mail</th>
                  <th className="px-5 py-4 font-semibold">
                    Pedidos
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Cadastro
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {client.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {client.email}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {client._count.pedidos}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {client.createdAt.toLocaleDateString('pt-BR')}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/adm/clients/${client.id}`}
                        className="font-medium text-violet-600 hover:text-violet-800"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClients.length === 0 && (
              <div className="p-10 text-center text-sm text-gray-500">
                Nenhum cliente encontrado.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}