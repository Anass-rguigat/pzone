import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '@/Layouts/layout';



interface ServerData {
  id: number;
  server_name: string;
  brand: string;
  image: string | null;
  model: string;
  cpu_socket: string;
  price: number;
  ram_slots: number;
  storage_slots: number;
  power_supply_type: string;
  rack_mountable: boolean;
  form_factor: string;
  
}

interface Props {
  data: ServerData[];
}

export default function Index({ data }: Props) {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce serveur ?")) {
      destroy(`/servers/${id}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredServers = data.filter(server =>
    server.server_name.toLowerCase().includes(searchTerm)
  );

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Liste des Serveurs</h1>
      <div className="flex justify-between items-start mb-4">
        <Link
          href="/servers/create"
          className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        >
          Ajouter un Serveur
        </Link>
        <input
          type="text"
          className="px-4 py-2 border rounded-lg w-1/3"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nom du Serveur</th>
              <th scope="col" className="px-6 py-3">Marque</th>
              <th scope="col" className="px-6 py-3">Modèle</th>
              <th scope="col" className="px-6 py-3">Détails</th>
              <th scope="col" className="px-6 py-3">Prix</th>
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServers.length > 0 ? (
              filteredServers.map((server) => (
                <tr key={server.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {server.server_name}
                  </td>
                  <td className="px-6 py-4">{server.brand}</td>
                  <td className="px-6 py-4">{server.model}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p><strong>Socket CPU:</strong> {server.cpu_socket}</p>
                      <p><strong>Slots RAM:</strong> {server.ram_slots}</p>
                      <p><strong>Slots Stockage:</strong> {server.storage_slots}</p>
                      <p><strong>Type d'Alimentation:</strong> {server.power_supply_type}</p>
                      <p><strong>Montage en Rack:</strong> {server.rack_mountable ? 'Oui' : 'Non'}</p>
                      <p><strong>Form Factor:</strong> {server.form_factor}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{server.price}</td>
                  <td className="px-6 py-4">
                    {server.image ? (
                      <img
                        src={`/storage/${server.image.url}`}
                        alt={server.server_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span>Aucune image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex space-x-2">
                      <Link href={`/servers/${server.id}/edit`} className="font-medium text-green-600 dark:text-green-500 hover:underline">
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(server.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                      <Link href={`/servers/${server.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        Voir
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Aucun serveur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
