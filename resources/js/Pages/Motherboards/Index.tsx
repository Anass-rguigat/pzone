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

interface Motherboard {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    model: string;
    cpu_socket: string;
    chipset: string;
    ram_slots: number;
    pci_slots: number;
    form_factor: string;
    price: number;
}

interface Props {
    motherboards: Motherboard[];
}

export default function Index({ motherboards }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte mère ?")) {
            destroy(`/motherboards/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredMotherboards = motherboards.filter(motherboard =>
        motherboard.name.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Liste des Cartes Mères</h1>
            <div className="flex justify-between items-center mb-4">
                <Link
                    href="/motherboards/create"
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                >
                    Ajouter une carte mère
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
                            <th scope="col" className="px-6 py-3">Modèle</th>
                            <th scope="col" className="px-6 py-3">Socket CPU</th>
                            <th scope="col" className="px-6 py-3">Chipset</th>
                            <th scope="col" className="px-6 py-3">Slots RAM</th>
                            <th scope="col" className="px-6 py-3">Slots PCI</th>
                            <th scope="col" className="px-6 py-3">Facteur de Forme</th>
                            <th scope="col" className="px-6 py-3">Prix</th>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMotherboards.length > 0 ? (
                            filteredMotherboards.map((motherboard) => (
                                <tr key={motherboard.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {motherboard.name}
                                    </th>
                                    <td className="px-6 py-4">{motherboard.brand.name}</td>
                                    <td className="px-6 py-4">
                                        {motherboard.servers.length > 0 ? (
                                            <ul className="list-disc ml-4">
                                                {motherboard.servers.map((server) => (
                                                    <li key={server.id}>{server.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Aucun serveur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{motherboard.model}</td>
                                    <td className="px-6 py-4">{motherboard.cpu_socket}</td>
                                    <td className="px-6 py-4">{motherboard.chipset}</td>
                                    <td className="px-6 py-4">{motherboard.ram_slots}</td>
                                    <td className="px-6 py-4">{motherboard.pci_slots}</td>
                                    <td className="px-6 py-4">{motherboard.form_factor}</td>
                                    <td className="px-6 py-4">{motherboard.price} &euro;</td>
                                    <td className="px-6 py-4">
                                        {motherboard.image ? (
                                            <img
                                                src={`/storage/${motherboard.image.url}`}
                                                alt={motherboard.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Aucune image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <Link href={`/motherboards/${motherboard.id}/edit`} className="font-medium text-green-600 dark:green-blue-500 hover:underline">
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(motherboard.id)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                            <Link href={`/motherboards/${motherboard.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                Voir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="px-6 py-4 text-center text-gray-500">Aucune carte mère trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
