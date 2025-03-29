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

interface FiberOpticCard {
    id: number;
    name: string;
    price: number;
    fiber_type: string;
    speed: string;
    power_rating: number;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    fiberOpticCard: FiberOpticCard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ fiberOpticCard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: fiberOpticCard.name,
        price: fiberOpticCard.price,
        fiber_type: fiberOpticCard.fiber_type,
        speed: fiberOpticCard.speed,
        power_rating: fiberOpticCard.power_rating,
        brand_id: fiberOpticCard.brand?.id ?? 0,
        server_ids: fiberOpticCard.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        fiberOpticCard.image?.url ? `/storage/${fiberOpticCard.image.url}` : null
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
        formData.append('price', String(data.price));
        formData.append('fiber_type', data.fiber_type);
        formData.append('speed', data.speed);
        formData.append('power_rating', String(data.power_rating));
        formData.append('brand_id', String(data.brand_id));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/fiber-optic-cards/${fiberOpticCard.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (fiberOpticCard.image) {
            setSelectedImage(`/storage/${fiberOpticCard.image.url}`);
        }
    }, [fiberOpticCard]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier une carte Fiber Optic</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fiber Optic Card Name */}
                <div>
                    <label className="block font-medium">Nom de la carte</label>
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
                    <label className="block font-medium">Prix</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                        step="0.01"
                    />
                </div>

                {/* Fiber Type */}
                <div>
                    <label className="block font-medium">Type de fibre</label>
                    <input
                        type="text"
                        value={data.fiber_type}
                        onChange={(e) => setData('fiber_type', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Speed */}
                <div>
                    <label className="block font-medium">Vitesse (Mbps)</label>
                    <input
                        type="number"
                        value={data.speed}
                        onChange={(e) => setData('speed', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Power Rating */}
                <div>
                    <label className="block font-medium">Puissance (W)</label>
                    <input
                        type="number"
                        value={data.power_rating}
                        onChange={(e) => setData('power_rating', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
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

                {/* Server Selection */}
                <div>
                    <label className="block font-medium">Serveurs associés</label>
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
                        Modifier
                    </button>
                    <Link href="/fiber-optic-cards" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
