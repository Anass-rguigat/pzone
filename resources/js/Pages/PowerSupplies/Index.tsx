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

interface PowerSupply {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    capacity: number;
    efficiency: string;
    form_factor: string;
    modular: boolean;
    price?: number;
}

interface Props {
    powerSupplies: PowerSupply[];
}

export default function Index({ powerSupplies }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette alimentation ?")) {
            destroy(`/power-supplies/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredPowerSupplies = powerSupplies.filter((powerSupply) =>
        powerSupply.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Liste des Alimentations</h1>
            <div className="flex justify-between items-start mb-4">
                <Link
                    href="/power-supplies/create"
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                >
                    Ajouter une Alimentation
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
                            <th scope="col" className="px-6 py-3">Nom</th>
                            <th scope="col" className="px-6 py-3">Marque</th>
                            <th scope="col" className="px-6 py-3">Serveurs</th>
                            <th scope="col" className="px-6 py-3">Capacité</th>
                            <th scope="col" className="px-6 py-3">Efficacité</th>
                            <th scope="col" className="px-6 py-3">Format</th>
                            <th scope="col" className="px-6 py-3">Modulaire</th>
                            <th scope="col" className="px-6 py-3">Prix</th>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPowerSupplies.length > 0 ? (
                            filteredPowerSupplies.map((powerSupply) => (
                                <tr key={powerSupply.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {powerSupply.name}
                                    </th>
                                    <td className="px-6 py-4">{powerSupply.brand.name}</td>
                                    <td className="px-6 py-4">
                                        {powerSupply.servers.length > 0 ? (
                                            <ul className="list-disc ml-4">
                                                {powerSupply.servers.map((server) => (
                                                    <li key={server.id}>{server.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Aucun serveur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{powerSupply.capacity} W</td>
                                    <td className="px-6 py-4">{powerSupply.efficiency}</td>
                                    <td className="px-6 py-4">{powerSupply.form_factor}</td>
                                    <td className="px-6 py-4">{powerSupply.modular ? 'Oui' : 'Non'}</td>
                                    <td className="px-6 py-4">{powerSupply.price ? `${powerSupply.price} €` : 'Non défini'}</td>
                                    <td className="px-6 py-4">
                                        {powerSupply.image ? (
                                            <img
                                                src={`/storage/${powerSupply.image.url}`}
                                                alt={powerSupply.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Aucune image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <Link href={`/power-supplies/${powerSupply.id}/edit`} className="font-medium text-green-600 dark:green-blue-500 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(powerSupply.id)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                            <Link href={`/power-supplies/${powerSupply.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                Voir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="px-6 py-4 text-center text-gray-500">Aucune alimentation trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
