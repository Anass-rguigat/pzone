import { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';

interface ComponentItem {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    suppliers: Supplier[];
    componentTypes: {
        [key: string]: string;
    };
}

export default function Create({ suppliers, componentTypes }: Props) {
    const [components, setComponents] = useState<ComponentItem[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [isLoadingComponents, setIsLoadingComponents] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        component_id: '',
        component_type: '',
        quantity: '',
        movement_type: 'in' as 'in' | 'out',
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (selectedType) {
            setIsLoadingComponents(true);
            fetch(`/get-components/${selectedType}`)
                .then(res => res.json())
                .then(data => {
                    setComponents(data);
                    setIsLoadingComponents(false);
                })
                .catch(() => {
                    setComponents([]);
                    setIsLoadingComponents(false);
                });
        }
    }, [selectedType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-movements');
    };

    return (
        <Layout >
            <div className="px-4 py-6 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type de Composant *</label>
                            <select
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    setData('component_type', componentTypes[e.target.value]);
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un type</option>
                                {Object.keys(componentTypes).map((typeKey) => (
                                    <option key={typeKey} value={typeKey}>
                                        {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.component_type && <p className="mt-1 text-red-600 text-sm">{errors.component_type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Composant *</label>
                            <select
                                value={data.component_id}
                                onChange={(e) => setData('component_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={!selectedType || isLoadingComponents}
                            >
                                <option value="">{isLoadingComponents ? 'Chargement...' : 'Sélectionner un composant'}</option>
                                {components.map((component) => (
                                    <option key={component.id} value={component.id}>
                                        {component.name}
                                    </option>
                                ))}
                            </select>
                            {errors.component_id && <p className="mt-1 text-red-600 text-sm">{errors.component_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantité *</label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                min="1"
                            />
                            {errors.quantity && <p className="mt-1 text-red-600 text-sm">{errors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type de Mouvement *</label>
                            <div className="mt-1 space-x-4 flex">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="in"
                                        checked={data.movement_type === 'in'}
                                        onChange={() => setData('movement_type', 'in')}
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                    />
                                    <span className="ml-2">Entrée</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="out"
                                        checked={data.movement_type === 'out'}
                                        onChange={() => setData('movement_type', 'out')}
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                    />
                                    <span className="ml-2">Sortie</span>
                                </label>
                            </div>
                            {errors.movement_type && <p className="mt-1 text-red-600 text-sm">{errors.movement_type}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un fournisseur</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && <p className="mt-1 text-red-600 text-sm">{errors.supplier_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date *</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.date && <p className="mt-1 text-red-600 text-sm">{errors.date}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Enregistrement...' : 'Créer le Mouvement'}
                        </button>
                        <Link
                            href="/stock-movements"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}