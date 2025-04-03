import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

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

interface Props {
    processor: Processor;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ processor, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

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

        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        if (data.image) {
            formData.append('image', data.image);
        }

        formData.append('price', String(data.price));

        post(`/processors/${processor.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null); 
            },
        });
    };

    useEffect(() => {
        if (processor.image) {
            setSelectedImage(`/storage/${processor.image.url}`);
        }
    }, [processor]);

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier un Processeur</h1>

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
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modèle</label>
                            <input
                                type="text"
                                name="model"
                                id="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.model && <p className="text-red-600 text-sm">{errors.model}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="core_count" className="block text-sm font-medium text-gray-700">Nombre de Cœurs</label>
                            <input
                                type="number"
                                name="core_count"
                                id="core_count"
                                value={data.core_count}
                                onChange={(e) => setData('core_count', +e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.core_count && <p className="text-red-600 text-sm">{errors.core_count}</p>}
                        </div>

                        <div>
                            <label htmlFor="thread_count" className="block text-sm font-medium text-gray-700">Nombre de Threads</label>
                            <input
                                type="number"
                                name="thread_count"
                                id="thread_count"
                                value={data.thread_count}
                                onChange={(e) => setData('thread_count', +e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.thread_count && <p className="text-red-600 text-sm">{errors.thread_count}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="base_clock" className="block text-sm font-medium text-gray-700">Fréquence de Base</label>
                            <input
                                type="number"
                                name="base_clock"
                                id="base_clock"
                                value={data.base_clock}
                                onChange={(e) => setData('base_clock', +e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.base_clock && <p className="text-red-600 text-sm">{errors.base_clock}</p>}
                        </div>

                        <div>
                            <label htmlFor="boost_clock" className="block text-sm font-medium text-gray-700">Fréquence Turbo</label>
                            <input
                                type="number"
                                name="boost_clock"
                                id="boost_clock"
                                value={data.boost_clock}
                                onChange={(e) => setData('boost_clock', +e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.boost_clock && <p className="text-red-600 text-sm">{errors.boost_clock}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="socket" className="block text-sm font-medium text-gray-700">Socket</label>
                            <input
                                type="text"
                                name="socket"
                                id="socket"
                                value={data.socket}
                                onChange={(e) => setData('socket', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.socket && <p className="text-red-600 text-sm">{errors.socket}</p>}
                        </div>

                        <div>
                            <label htmlFor="thermal_design_power" className="block text-sm font-medium text-gray-700">TDP</label>
                            <input
                                type="number"
                                name="thermal_design_power"
                                id="thermal_design_power"
                                value={data.thermal_design_power}
                                onChange={(e) => setData('thermal_design_power', +e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.thermal_design_power && <p className="text-red-600 text-sm">{errors.thermal_design_power}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={data.price}
                            onChange={(e) => setData('price', +e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                    </div>

                    <div>
                        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">Marque</label>
                        <select
                            name="brand_id"
                            id="brand_id"
                            value={data.brand_id}
                            onChange={(e) => setData('brand_id', +e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value={0} disabled>Sélectionner une Marque</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="server_ids" className="block text-sm font-medium text-gray-700">Serveurs Associés</label>
                        <select
                            name="server_ids"
                            id="server_ids"
                            multiple
                            value={data.server_ids}
                            onChange={(e) => {
                                const selectedValues = Array.from(e.target.selectedOptions, (option) => +option.value);
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

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex items-center">
                            <label
                                htmlFor="image"
                                className="flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                            >
                                Choisir un fichier
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {selectedImage && (
                                <div className="ml-2">
                                    <img
                                        src={selectedImage}
                                        alt="Image du processeur"
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>

                    {progress && (
                        <div className="w-full bg-gray-200 rounded">
                            <div
                                className="bg-blue-500 text-xs leading-none py-1 text-center text-white"
                                style={{ width: `${progress.percentage}%` }}
                            >
                                {progress.percentage}%
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Modifier Processeur
                        </button>
                        <Link
                            href="/processors"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
