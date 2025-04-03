import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Layout } from '@/Layouts/layout';

interface Server {
    id: number;
    name: string;
}

interface Discount {
    id: number;
    name: string;
    discount_type: string;
    value: number;
    start_date: string;
    end_date: string;
}

const EditDiscount: React.FC<{ discount: Discount; servers: Server[]; associatedServers: Server[] }> = ({ discount, servers, associatedServers }) => {
    const { data, setData, put, errors } = useForm({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        server_ids: associatedServers.map((server) => server.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('discounts.update', discount.id));
    };

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier un Discount</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
                            <input
                                type="number"
                                name="value"
                                id="value"
                                value={data.value}
                                onChange={(e) => setData('value', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.value && <p className="text-red-600 text-sm">{errors.value}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700">Type de Discount</label>
                            <select
                                name="discount_type"
                                id="discount_type"
                                value={data.discount_type}
                                onChange={(e) => setData('discount_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="percentage">Pourcentage</option>
                                <option value="fixed">Fixe</option>
                            </select>
                            {errors.discount_type && <p className="text-red-600 text-sm">{errors.discount_type}</p>}
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Date de début</label>
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Date de fin</label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date}</p>}
                        </div>

                        <div>
                            <label htmlFor="server_ids" className="block text-sm font-medium text-gray-700">Serveurs Associés</label>
                            <select
                                name="server_ids"
                                id="server_ids"
                                multiple
                                value={data.server_ids}
                                onChange={(e) => {
                                    const selectedValues = Array.from(
                                        e.target.selectedOptions,
                                        (option) => Number(option.value)
                                    );
                                    setData('server_ids', selectedValues);
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {servers.map((server) => (
                                    <option key={server.id} value={server.id}>{server.name}</option>
                                ))}
                            </select>
                            {errors.server_ids && <p className="text-red-600 text-sm">{errors.server_ids}</p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        >
                            Modifier Discount
                        </button>
                        <Link
                            href="/discounts"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditDiscount;