import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    servers: Server[];
}

export default function Create({ brands, servers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand_id: '',
        image: null as File | null,
        server_ids: [] as number[],
        model: '', // Modèle du processeur
        core_count: '', // Nombre de cœurs
        thread_count: '', // Nombre de threads
        base_clock: '', // Fréquence de base
        boost_clock: '', // Fréquence boost
        socket: '', // Socket
        thermal_design_power: '', // TDP (Thermal Design Power)
        price: '',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file)); // Afficher l'image sélectionnée
            setData('image', file);
        }
    };

    const handleServerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setData('server_ids', selectedValues.map(Number)); // Convertir en nombres
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/processors', {
            onSuccess: () => {
                // Réinitialiser le formulaire et l'image sélectionnée en cas de succès
                setData({
                    name: '',
                    brand_id: '',
                    image: null,
                    server_ids: [],
                    model: '',
                    core_count: '',
                    thread_count: '',
                    base_clock: '',
                    boost_clock: '',
                    socket: '',
                    thermal_design_power: '',
                    price: '', 
                });
                setSelectedImage(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1>Ajouter un Processeur</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="name">Nom du processeur:</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="brand_id">Marque:</label>
                    <select
                        name="brand_id"
                        value={data.brand_id}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    >
                        <option value="">Sélectionner une marque</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand_id && <div className="text-red-600 text-sm">{errors.brand_id}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="model">Modèle:</label>
                    <input
                        type="text"
                        name="model"
                        value={data.model}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.model && <div className="text-red-600 text-sm">{errors.model}</div>}
                </div>

{/* Champ Prix */}
<div className="mt-4">
                    <label htmlFor="price">Prix (€):</label>
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="core_count">Nombre de cœurs:</label>
                    <input
                        type="number"
                        name="core_count"
                        value={data.core_count}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.core_count && <div className="text-red-600 text-sm">{errors.core_count}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="thread_count">Nombre de threads:</label>
                    <input
                        type="number"
                        name="thread_count"
                        value={data.thread_count}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.thread_count && <div className="text-red-600 text-sm">{errors.thread_count}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="base_clock">Fréquence de base (GHz):</label>
                    <input
                        type="number"
                        name="base_clock"
                        value={data.base_clock}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.base_clock && <div className="text-red-600 text-sm">{errors.base_clock}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="boost_clock">Fréquence Boost (GHz):</label>
                    <input
                        type="number"
                        name="boost_clock"
                        value={data.boost_clock}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.boost_clock && <div className="text-red-600 text-sm">{errors.boost_clock}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="socket">Socket:</label>
                    <input
                        type="text"
                        name="socket"
                        value={data.socket}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.socket && <div className="text-red-600 text-sm">{errors.socket}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="thermal_design_power">TDP (W):</label>
                    <input
                        type="number"
                        name="thermal_design_power"
                        value={data.thermal_design_power}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.thermal_design_power && <div className="text-red-600 text-sm">{errors.thermal_design_power}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {selectedImage && <img src={selectedImage} alt="Preview" className="mt-2" width="150" />}
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="servers">Serveurs associés:</label>
                    <select
                        name="server_ids"
                        multiple
                        value={data.server_ids}
                        onChange={handleServerSelection}
                        className="mt-1 p-2 border rounded"
                    >
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>
                                {server.name}
                            </option>
                        ))}
                    </select>
                    {errors.server_ids && <div className="text-red-600 text-sm">{errors.server_ids}</div>}
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : 'Ajouter le processeur'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
