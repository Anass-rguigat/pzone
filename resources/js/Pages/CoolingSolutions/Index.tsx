import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

interface CoolingSolution {
    id: number;
    name: string;
    type: string;
    brand: Brand;
    manufacturer: string;
    power_rating: number;
    price: number;
    image?: Image;
    servers: Server[];
}

interface Props {
    coolingSolutions: CoolingSolution[];
}

export default function Index({ coolingSolutions }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette solution de refroidissement ?")) {
            destroy(`/cooling-solutions/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredCoolingSolutions = coolingSolutions.filter(solution =>
        solution.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Liste des Solutions de Refroidissement</h1>
            <div className="flex justify-between items-start mb-4">
                <Link
                    href="/cooling-solutions/create"
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                >
                    Ajouter une Solution de Refroidissement
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
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nom</th>
                            <th scope="col" className="px-6 py-3">Marque</th>
                            <th scope="col" className="px-6 py-3">Fabricant</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Puissance</th>
                            <th scope="col" className="px-6 py-3">Prix</th>
                            <th scope="col" className="px-6 py-3">Serveurs</th>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCoolingSolutions.length > 0 ? (
                            filteredCoolingSolutions.map((solution) => (
                                <tr key={solution.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {solution.name}
                                    </th>
                                    <td className="px-6 py-4">{solution.brand.name}</td>
                                    <td className="px-6 py-4">{solution.manufacturer}</td>
                                    <td className="px-6 py-4">{solution.type}</td>
                                    <td className="px-6 py-4">{solution.power_rating} W</td>
                                    <td className="px-6 py-4">{solution.price} €</td>
                                    <td className="px-6 py-4">
                                        {solution.servers.length > 0 ? (
                                            <ul className="list-disc ml-4">
                                                {solution.servers.map((server) => (
                                                    <li key={server.id}>{server.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Aucun serveur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {solution.image ? (
                                            <img
                                                src={`/storage/${solution.image.url}`}
                                                alt={solution.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Aucune image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <Link href={`/cooling-solutions/${solution.id}/edit`} className="font-medium text-green-600 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(solution.id)}
                                                className="font-medium text-red-600 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                            <Link href={`/cooling-solutions/${solution.id}`} className="font-medium text-blue-600 hover:underline">
                                                Voir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">Aucune solution de refroidissement trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
