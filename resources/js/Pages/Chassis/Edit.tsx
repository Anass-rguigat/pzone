import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Layout } from '@/Layouts/layout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Chassis {
    id: number;
    name: string;
    type: string;
    price: number;
    form_factor: string;
    material: string;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    chassis: Chassis;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ chassis, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: chassis.name,
        type: chassis.type,
        price: chassis.price,
        form_factor: chassis.form_factor,
        material: chassis.material,
        brand_id: chassis.brand?.id ?? 0,
        server_ids: chassis.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        chassis.image?.url ? `/storage/${chassis.image.url}` : null
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
        formData.append('type', data.type);
        formData.append('price', String(data.price));
        formData.append('form_factor', data.form_factor);
        formData.append('material', data.material);
        formData.append('brand_id', String(data.brand_id));

        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        if (data.image) {
            formData.append('image', data.image);
        }

        post(`/chassis/${chassis.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (chassis.image) {
            setSelectedImage(`/storage/${chassis.image.url}`);
        }
    }, [chassis]);

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier un Chassis</h1>

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
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                            <input
                                type="text"
                                name="type"
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
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
                                onChange={(e) => setData('brand_id', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value={0} disabled>Sélectionner une Marque</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="form_factor" className="block text-sm font-medium text-gray-700">Form Factor</label>
                            <input
                                type="text"
                                name="form_factor"
                                id="form_factor"
                                value={data.form_factor}
                                onChange={(e) => setData('form_factor', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.form_factor && <p className="text-red-600 text-sm">{errors.form_factor}</p>}
                        </div>

                        <div>
                            <label htmlFor="material" className="block text-sm font-medium text-gray-700">Matériau</label>
                            <input
                                type="text"
                                name="material"
                                id="material"
                                value={data.material}
                                onChange={(e) => setData('material', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.material && <p className="text-red-600 text-sm">{errors.material}</p>}
                        </div>
                    </div>

                    {/* Server Selection */}
                    <div>
                        <label htmlFor="server_ids" className="block text-sm font-medium text-gray-700">Serveurs Associés</label>
                        <select
                            name="server_ids"
                            id="server_ids"
                            multiple
                            value={data.server_ids}
                            onChange={(e) => {
                                const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
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

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex items-center">
                            <label htmlFor="image" className="flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500">
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
                                        alt="Image de Chassis"
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>

                    {/* Progress Indicator */}
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

                    {/* Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Modifier Chassis
                        </button>
                        <Link href="/chassis" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
