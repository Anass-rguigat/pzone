import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Ram {
    id: number;
    name: string;
    price: number;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
    capacity: string; // Ajout de la capacité
    type: string; // Ajout du type
    speed: string; // Ajout de la vitesse
}

interface Props {
    ram: Ram;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ ram, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: ram.name,
        price: ram.price,
        brand_id: ram.brand?.id ?? 0,
        server_ids: ram.servers.map((server) => server.id),
        image: null as File | null,
        capacity: ram.capacity, // Ajout de la capacité
        type: ram.type, // Ajout du type
        speed: ram.speed, // Ajout de la vitesse
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        ram.image?.url ? `/storage/${ram.image.url}` : null
    );

    // Handle file input
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

    // Submit the form using FormData
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('price', String(data.price)); // Add price to formData
        formData.append('brand_id', String(data.brand_id));
        formData.append('capacity', data.capacity); // Add capacity to formData
        formData.append('type', data.type); // Add type to formData
        formData.append('speed', data.speed); // Add speed to formData

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/rams/${ram.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (ram.image) {
            setSelectedImage(`/storage/${ram.image.url}`);
        }
    }, [ram]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier un Ram</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ram Name */}
                <div>
                    <label className="block font-medium">Nom du ram</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium">Prix du ram</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                        step="0.01"
                    />
                </div>

                {/* Brand Selection */}
                <div>
                    <label className="block font-medium">Marque</label>
                    <select
                        value={data.brand_id}
                        onChange={(e) => setData('brand_id', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value={0} disabled>Sélectionner une marque</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* RAM Selection */}
                <div>
                    <label className="block font-medium">Servers associées</label>
                    <select
                        multiple
                        value={data.server_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                            );
                            setData('server_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>
                                {server.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Capacity */}
                <div>
                    <label className="block font-medium">Capacité (Go)</label>
                    <input
                        type="number"
                        value={data.capacity}
                        onChange={(e) => setData('capacity', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block font-medium">Type</label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Sélectionner un type</option>
                        <option value="ddr3">DDR3</option>
                        <option value="ddr4">DDR4</option>
                        <option value="ddr5">DDR5</option>
                    </select>
                </div>

                {/* Speed */}
                <div>
                    <label className="block font-medium">Vitesse (MHz)</label>
                    <input
                        type="number"
                        value={data.speed}
                        onChange={(e) => setData('speed', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className="mt-4">
                    <label htmlFor="image" className="block font-medium">Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {selectedImage && (
                        <div className="mt-2">
                            <img src={selectedImage} alt="Prévisualisation" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
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
                <div className="flex space-x-4">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        Modifier Ram
                    </button>
                    <Link href="/rams" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
