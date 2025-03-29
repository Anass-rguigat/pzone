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

interface Image {
    url: string;
}

interface NetworkCard {
    id: number;
    name: string;
    brand: Brand;
    model: string;
    interface: string;
    speed: number;
    price: number; 
    image: Image | null;
    servers: Server[];
}

interface Props {
    networkCard: NetworkCard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ networkCard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: networkCard.name,
        brand_id: networkCard.brand?.id ?? 0,
        model: networkCard.model,
        interface: networkCard.interface,
        price: networkCard.price,
        speed: networkCard.speed,
        server_ids: networkCard.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        networkCard.image?.url ? `/storage/${networkCard.image.url}` : null
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
        formData.append('brand_id', String(data.brand_id));
        formData.append('model', data.model);
        formData.append('interface', data.interface);
        formData.append('speed', String(data.speed));
        formData.append('price', String(data.price));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/network-cards/${networkCard.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (networkCard.image) {
            setSelectedImage(`/storage/${networkCard.image.url}`);
        }
    }, [networkCard]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier une carte réseau</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Network Card Name */}
                <div>
                    <label className="block font-medium">Nom de la carte réseau</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
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

                {/* Model */}
                <div>
                    <label className="block font-medium">Modèle</label>
                    <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Interface */}
                <div>
                    <label className="block font-medium">Interface</label>
                    <input
                        type="text"
                        value={data.interface}
                        onChange={(e) => setData('interface', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Speed */}
                <div>
                    <label className="block font-medium">Vitesse (Mbps)</label>
                    <input
                        type="number"
                        value={data.speed}
                        onChange={(e) => setData('speed', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

{/* Price */}
<div>
                    <label className="block font-medium">Prix (€)</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                
                {/* Servers */}
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
                        Modifier la carte réseau
                    </button>
                    <Link href="/network-cards" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
