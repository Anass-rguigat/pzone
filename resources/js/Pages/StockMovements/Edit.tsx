import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';

interface ComponentItem {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface StockMovement {
    id: number;
    component_id: number;
    component_type: string;
    quantity: number;
    movement_type: 'in' | 'out';
    supplier_id: number | null;
    date: string;
}

interface Props {
    movement: StockMovement;
    suppliers: Supplier[];
    componentTypes: {
        [key: string]: string;
    };
    components: ComponentItem[];
    selectedComponentType: string;
    selectedComponent: ComponentItem | null;
}

export default function Edit({ movement, suppliers, componentTypes, components, selectedComponentType, selectedComponent }: Props) {
    const [selectedType, setSelectedType] = useState(selectedComponentType);
    const [isLoadingComponents, setIsLoadingComponents] = useState(false);
    const [availableComponents, setAvailableComponents] = useState(components);
    const [selectedComponentId, setSelectedComponentId] = useState(movement.component_id);

    const { data, setData, put, processing, errors } = useForm({
        component_id: movement.component_id,
        component_type: movement.component_type,
        quantity: movement.quantity,
        movement_type: movement.movement_type,
        supplier_id: movement.supplier_id ?? '',
        date: movement.date,
    });

    useEffect(() => {
        if (selectedType) {
            setIsLoadingComponents(true);
            fetch(`/get-components/${selectedType}`)
                .then((res) => res.json())
                .then((data) => {
                    setAvailableComponents(data);
                    setIsLoadingComponents(false);
                })
                .catch(() => {
                    setAvailableComponents([]);
                    setIsLoadingComponents(false);
                });
        }
    }, [selectedType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);

        // Alert for confirmation
        alert('Submitting form... Check console for data.');

        put(`/stock-movements/${movement.id}`, {
            onError: (errors) => {
                console.error('Failed to submit:', errors);
            }
        });
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
                                    const newType = e.target.value;
                                    setSelectedType(newType);
                                    setData('component_type', componentTypes[newType]);
                                }}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
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
                            >
                                <option value="">{isLoadingComponents ? 'Chargement...' : 'Sélectionner un composant'}</option>
                                {availableComponents.map((component) => (
                                    <option key={component.id} value={component.id}>
                                        {component.name}
                                    </option>
                                ))}
                            </select>
                            {errors.component_id && <p className="mt-1 text-red-600 text-sm">{errors.component_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantité *</label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.quantity && <p className="mt-1 text-red-600 text-sm">{errors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type de Mouvement *</label>
                            <select
                                value={data.movement_type}
                                onChange={(e) => setData('movement_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="in">Entrée</option>
                                <option value="out">Sortie</option>
                            </select>
                            {errors.movement_type && <p className="mt-1 text-red-600 text-sm">{errors.movement_type}</p>}
                        </div>

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
                                required
                            />
                            {errors.date && <p className="mt-1 text-red-600 text-sm">{errors.date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={processing}
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
