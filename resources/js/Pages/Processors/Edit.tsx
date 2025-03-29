import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

interface Processor {
    id: number;
    name: string;
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: number;
    boost_clock: number;
    socket: string;
    thermal_design_power: number;
    brand_id: number;
    image: { url: string } | null;
    servers: { id: number; name: string }[];
    price: number;
}

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Props {
    processor: Processor;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ processor, brands, servers }: Props) {
    const { data, setData, post, errors } = useForm({
        name: processor.name,
        model: processor.model,
        core_count: processor.core_count,
        thread_count: processor.thread_count,
        base_clock: processor.base_clock,
        boost_clock: processor.boost_clock,
        socket: processor.socket,
        thermal_design_power: processor.thermal_design_power,
        brand_id: processor.brand_id,
        server_ids: processor.servers.map((server) => server.id),
        image: null as File | null,
        price: processor.price,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        processor.image?.url ? `/storage/${processor.image.url}` : null
    );

    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            // Image preview
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('model', data.model);
        formData.append('core_count', String(data.core_count));
        formData.append('thread_count', String(data.thread_count));
        formData.append('base_clock', String(data.base_clock));
        formData.append('boost_clock', String(data.boost_clock));
        formData.append('socket', data.socket);
        formData.append('thermal_design_power', String(data.thermal_design_power));
        formData.append('brand_id', String(data.brand_id));

        // Add server IDs to the form data
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append the image if it's selected
        if (data.image) {
            formData.append('image', data.image);
        }
        formData.append('price', String(data.price));
        post(`/processors/${processor.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null); // Clear the image preview on success
            },
        });
    };

    useEffect(() => {
        if (processor.image) {
            setSelectedImage(`/storage/${processor.image.url}`);
        }
    }, [processor]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Modifier un Processeur
                </h2>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Processor Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>

                {/* Processor Model */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Modèle</label>
                    <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.model && <p className="text-red-600 text-sm">{errors.model}</p>}
                </div>

                {/* Core Count */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de cœurs</label>
                    <input
                        type="number"
                        value={data.core_count}
                        onChange={(e) => setData('core_count', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.core_count && <p className="text-red-600 text-sm">{errors.core_count}</p>}
                </div>

                {/* Thread Count */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de threads</label>
                    <input
                        type="number"
                        value={data.thread_count}
                        onChange={(e) => setData('thread_count', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.thread_count && <p className="text-red-600 text-sm">{errors.thread_count}</p>}
                </div>

                {/* Base Clock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vitesse de base (GHz)</label>
                    <input
                        type="number"
                        value={data.base_clock}
                        onChange={(e) => setData('base_clock', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.base_clock && <p className="text-red-600 text-sm">{errors.base_clock}</p>}
                </div>

                {/* Boost Clock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vitesse boostée (GHz)</label>
                    <input
                        type="number"
                        value={data.boost_clock}
                        onChange={(e) => setData('boost_clock', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.boost_clock && <p className="text-red-600 text-sm">{errors.boost_clock}</p>}
                </div>

                {/* Socket */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Socket</label>
                    <input
                        type="text"
                        value={data.socket}
                        onChange={(e) => setData('socket', e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.socket && <p className="text-red-600 text-sm">{errors.socket}</p>}
                </div>

                {/* Thermal Design Power */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Puissance thermique de conception (TDP)</label>
                    <input
                        type="number"
                        value={data.thermal_design_power}
                        onChange={(e) => setData('thermal_design_power', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.thermal_design_power && <p className="text-red-600 text-sm">{errors.thermal_design_power}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marque</label>
                    <select
                        value={data.brand_id}
                        onChange={(e) => setData('brand_id', +e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Sélectionner une marque</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
                </div>

                {/* Server IDs (Multiple selection) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Serveurs</label>
                    <select
                        multiple
                        value={data.server_ids}
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, (option) => +option.value);
                            setData('server_ids', selected);
                        }}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>
                                {server.name}
                            </option>
                        ))}
                    </select>
                    {errors.server_ids && <p className="text-red-600 text-sm">{errors.server_ids}</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {selectedImage && (
                        <div className="mt-2">
                            <img src={selectedImage} alt="Prévisualisation" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                </div>

                <div className="mt-4 flex space-x-4">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Enregistrer les modifications</button>
                    <Link href="/processors" className="bg-gray-500 text-white px-6 py-2 rounded">Retour</Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
