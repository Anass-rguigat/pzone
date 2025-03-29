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

interface ExpansionCard {
    id: number;
    name: string;
    type: string;
    interface_type: string;
    speed: number;
    power_rating: number;
    price: number;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    expansionCard: ExpansionCard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ expansionCard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: expansionCard.name,
        type: expansionCard.type,
        interface_type: expansionCard.interface_type,
        speed: expansionCard.speed,
        power_rating: expansionCard.power_rating,
        price: expansionCard.price,
        brand_id: expansionCard.brand?.id ?? 0,
        server_ids: expansionCard.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        expansionCard.image?.url ? `/storage/${expansionCard.image.url}` : null
    );

    // Handle file input for image change
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
        formData.append('type', data.type);
        formData.append('interface_type', data.interface_type);
        formData.append('speed', String(data.speed));
        formData.append('power_rating', String(data.power_rating));
        formData.append('price', String(data.price));
        formData.append('brand_id', String(data.brand_id));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/expansion-cards/${expansionCard.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (expansionCard.image) {
            setSelectedImage(`/storage/${expansionCard.image.url}`);
        }
    }, [expansionCard]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier une carte d'extension</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ExpansionCard Name */}
                <div>
                    <label className="block font-medium">Nom de la carte d'extension</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block font-medium">Type</label>
                    <input
                        type="text"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Interface Type */}
                <div>
                    <label className="block font-medium">Type d'interface</label>
                    <input
                        type="text"
                        value={data.interface_type}
                        onChange={(e) => setData('interface_type', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Speed */}
                <div>
                    <label className="block font-medium">Vitesse</label>
                    <input
                        type="number"
                        value={data.speed}
                        onChange={(e) => setData('speed', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Power Rating */}
                <div>
                    <label className="block font-medium">Consommation d'énergie</label>
                    <input
                        type="number"
                        value={data.power_rating}
                        onChange={(e) => setData('power_rating', Number(e.target.value))}
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

                {/* Servers Selection */}
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
                        Modifier la carte d'extension
                    </button>
                    <Link href="/expansion-cards" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
