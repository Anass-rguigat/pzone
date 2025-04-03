import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '@/Layouts/layout';

interface Brand {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Server {
    id: number;
    name: string;
}

interface Ram {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    price?: number;
    capacity: number;
    type: 'ddr3' | 'ddr4' | 'ddr5';
    speed: number;
}

interface Props {
    rams: Ram[];
}

export default function Index({ rams }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette RAM ?")) {
            destroy(`/rams/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredRams = rams.filter(ram =>
        ram.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Liste des RAMs</h1>
            <div className="flex justify-between items-center mb-4">
                <Link 
                    href="/rams/create" 
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                >
                    Ajouter une RAM
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
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nom</th>
                            <th className="px-6 py-3">Marque</th>
                            <th className="px-6 py-3">Serveurs</th>
                            <th className="px-6 py-3">Prix</th>
                            <th className="px-6 py-3">Capacité</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Vitesse</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRams.length > 0 ? (
                            filteredRams.map((ram) => (
                                <tr key={ram.id} className="bg-white border-b">
                                    <th className="px-6 py-4 font-medium text-gray-900">{ram.name}</th>
                                    <td className="px-6 py-4">{ram.brand.name}</td>
                                    <td className="px-6 py-4">
                                        {ram.servers.length > 0 ? (
                                            <ul className="list-disc ml-4">
                                                {ram.servers.map(server => (
                                                    <li key={server.id}>{server.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Aucun serveur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{ram.price ? `${ram.price} €` : 'N/A'}</td>
                                    <td className="px-6 py-4">{ram.capacity} Go</td>
                                    <td className="px-6 py-4">{ram.type.toUpperCase()}</td>
                                    <td className="px-6 py-4">{ram.speed} MHz</td>
                                    <td className="px-6 py-4">
                                        {ram.image ? (
                                            <img 
                                                src={`/storage/${ram.image.url}`} 
                                                alt={ram.name} 
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Aucune image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
    <div className="flex justify-center items-center space-x-3">
        <Link href={`/rams/${ram.id}/edit`} className="text-green-600 hover:underline">
            Modifier
        </Link>
        <button
            onClick={() => handleDelete(ram.id)}
            className="text-red-600 hover:underline"
        >
            Supprimer
        </button>
        <Link href={`/rams/${ram.id}`} className="text-blue-600 hover:underline">
            Voir
        </Link>
    </div>
</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">Aucune RAM trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}