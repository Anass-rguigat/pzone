import { Layout } from '@/Layouts/Layout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Component {
    id: number;
    name: string;
    type: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface StockMovement {
    id: number;
    quantity: number;
    movement_type: 'in' | 'out';
    date: string;
    component: Component;
    supplier?: Supplier;
}

interface Props {
    movements: {
        data: StockMovement[];
        links: any[];
    };
    suppliers: Supplier[];
}

export default function Index({ movements, suppliers }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce mouvement ?")) {
            destroy(`/stock-movements/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredMovements = movements.data.filter(movement =>
        movement.component.name.toLowerCase().includes(searchTerm) ||
        (movement.supplier?.name?.toLowerCase().includes(searchTerm) || '')
    );

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Mouvements de Stock</h1>
            <div className="flex justify-between items-start mb-4">
                <Link
                    href="/stock-movements/create"
                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Nouveau Mouvement
                </Link>
                <input
                    type="text"
                    className="px-4 py-2 border rounded-lg w-1/3"
                    placeholder="Rechercher par composant ou fournisseur..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Composant</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Quantité</th>
                            <th scope="col" className="px-6 py-3">Type Mouvement</th>
                            <th scope="col" className="px-6 py-3">Fournisseur</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovements.length > 0 ? (
                            filteredMovements.map((movement) => (
                                <tr key={movement.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {movement.component.name}
                                    </td>
                                    <td className="px-6 py-4">{movement.component.name}</td>
                                    <td className="px-6 py-4">{movement.quantity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded ${movement.movement_type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {movement.movement_type === 'in' ? 'Entrée' : 'Sortie'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{movement.supplier?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(movement.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/stock-movements/${movement.id}/edit`}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(movement.id)}
                                                className="font-medium text-red-600 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Aucun mouvement trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
