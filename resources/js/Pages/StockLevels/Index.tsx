import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Layout } from "@/Layouts/layout";

interface Component {
    id: number;
    name: string;
    price: number;
}

interface StockLevel {
    id: number;
    component: Component;
    quantity: number;
}

interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface Props {
    stockLevels: StockLevel[];
    pagination: Pagination;
}

export default function Index({ stockLevels, pagination }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce niveau de stock ?")) {
            destroy(`/stock-levels/${id}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredStockLevels = Array.isArray(stockLevels)
        ? stockLevels.filter(stockLevel =>
              stockLevel.component.name.toLowerCase().includes(searchTerm)
          )
        : [];

    return (
        <Layout>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">Gestion des Niveaux de Stock</h1>
            <div className="flex justify-end items-start mb-4">
                
                <input
                    type="text"
                    className="px-4 py-2 border rounded-lg w-1/3"
                    placeholder="Rechercher par composant..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Composant</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Quantité</th>
                            <th className="px-6 py-3">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStockLevels.length > 0 ? (
                            filteredStockLevels.map((stockLevel) => (
                                <tr key={stockLevel.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{stockLevel.component_type.split('\\').pop()}</td>
                                    <td className="px-6 py-4">{stockLevel.component.name}</td>
                                    <td className="px-6 py-4">{stockLevel.quantity}</td>
                                    <td className="px-6 py-4">{stockLevel.component.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Aucun niveau de stock trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {pagination.current_page > 1 && (
                    <Link href={`?page=${pagination.current_page - 1}`} className="px-4 py-2 mx-1 bg-gray-300 rounded">
                        Précédent
                    </Link>
                )}
                <span className="px-4 py-2 mx-1">
                    Page {pagination.current_page} sur {pagination.last_page}
                </span>
                {pagination.current_page < pagination.last_page && (
                    <Link href={`?page=${pagination.current_page + 1}`} className="px-4 py-2 mx-1 bg-gray-300 rounded">
                        Suivant
                    </Link>
                )}
            </div>
        </Layout>
    );
}
