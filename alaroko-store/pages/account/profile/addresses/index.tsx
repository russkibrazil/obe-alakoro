import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormError } from '@/components/forms/FormError';
import Button from '@/components/common/Button';
import { withAuthorization } from '@/components/withAuthorization';

type Address = {
  id: string;
  userId: string;
  label?: string | null;
  recipientName: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

function AddressesPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/account/addresses')
      .then(response => response.json())
      .then(setAddresses);

    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este endereço?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      const response = await fetch(`/api/account/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Não foi possível excluir o endereço.');
      }

      setAddresses((current) =>
        current.filter((address) => address.id !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao excluir o endereço.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <main>Carregando endereços...</main>;
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Endereços</h1>
          <p className="text-sm text-gray-500">
            Gerencie os endereços cadastrados.
          </p>
        </div>

        <Button
          variant='primary'
          onClick={() => router.push('/account/profile/addresses/new')}
        >
          Novo endereço
        </Button>
      </header>

      {error && <FormError errorTxt={error} />}

      {addresses.length === 0 ? (
        <p className="rounded-lg border p-6 text-center text-gray-500">
          Nenhum endereço cadastrado.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Identificação</th>
                <th className="p-4">Destinatário</th>
                <th className="p-4">Endereço</th>
                <th className="p-4">CEP</th>
                <th className="p-4">Padrão</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="border-t">
                  <td className="p-4">
                    <span className="font-medium">
                      {address.label || 'Sem identificação'}
                    </span>
                  </td>

                  <td className="p-4">
                    {address.recipientName}
                  </td>

                  <td className="p-4">
                    <p>
                      {address.street}, {address.number}
                    </p>

                    {address.complement && (
                      <p className="text-gray-500">
                        {address.complement}
                      </p>
                    )}

                    <p className="text-gray-500">
                      {address.neighborhood} — {address.city}/{address.state}
                    </p>
                  </td>

                  <td className="whitespace-nowrap p-4">
                    {address.zipCode}
                  </td>

                  <td className="p-4">
                    {address.isDefault ? (
                      <span className="rounded-md bg-green-100 px-2 py-1 text-green-800">
                        Sim
                      </span>
                    ) : (
                      <span className="text-gray-500">Não</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap p-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/account/profile/addresses/${address.id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        disabled={deletingId === address.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === address.id
                          ? 'Excluindo...'
                          : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default withAuthorization(AddressesPage, ["ROLE_ADMIN", "ROLE_USER"]);