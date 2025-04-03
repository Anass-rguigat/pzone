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

interface RaidController {
    id: number;
    name: string;
    brand: Brand;
    model: string;
    price: number;
    supported_levels: string;
    image?: Image;
    servers: Server[];
}

interface Props {
    raidControllers: RaidController[];
}

export default function Index({ raidControllers }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce contrôleur RAID ?")) {
            destroy(`/raid-controllers/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredRaidControllers = raidControllers.filter(raidController =>
        raidController.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Liste des Contrôleurs RAID</h1>
            <div className="flex justify-between items-start mb-4">
                <Link
                    href="/raid-controllers/create"
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Ajouter un Contrôleur RAID
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
                            <th className="px-6 py-3">Modèle</th>
                            <th className="px-6 py-3">Niveaux supportés</th>
                            <th className="px-6 py-3">Prix</th>
                            <th className="px-6 py-3">Serveurs</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRaidControllers.length > 0 ? (
                            filteredRaidControllers.map((raidController) => (
                                <tr key={raidController.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {raidController.name}
                                    </td>
                                    <td className="px-6 py-4">{raidController.brand.name}</td>
                                    <td className="px-6 py-4">{raidController.model}</td>
                                    <td className="px-6 py-4">{raidController.supported_levels}</td>
                                    <td className="px-6 py-4">{raidController.price} €</td>
                                    <td className="px-6 py-4">
                                        {raidController.servers.length > 0 ? (
                                            <ul className="list-disc ml-4">
                                                {raidController.servers.map((server) => (
                                                    <li key={server.id}>{server.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Aucun serveur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {raidController.image ? (
                                            <img
                                                src={`/storage/${raidController.image.url}`}
                                                alt={raidController.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Aucune image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <Link href={`/raid-controllers/${raidController.id}/edit`} className="text-green-600 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(raidController.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                            <Link href={`/raid-controllers/${raidController.id}`} className="text-blue-600 hover:underline">
                                                Voir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Aucun contrôleur RAID trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
