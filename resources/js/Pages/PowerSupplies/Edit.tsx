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

interface PowerSupply {
    id: number;
    name: string;
    capacity: number;
    efficiency: string;
    form_factor: string;
    modular: boolean;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
    price: number; 
}

interface Props {
    powerSupply: PowerSupply;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ powerSupply, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: powerSupply.name,
        brand_id: powerSupply.brand?.id ?? 0,
        capacity: powerSupply.capacity,
        efficiency: powerSupply.efficiency,
        form_factor: powerSupply.form_factor,
        modular: powerSupply.modular,
        server_ids: powerSupply.servers.map((server) => server.id),
        image: null as File | null,
        price: powerSupply.price,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        powerSupply.image?.url ? `/storage/${powerSupply.image.url}` : null
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
        formData.append('capacity', String(data.capacity));
        formData.append('efficiency', data.efficiency);
        formData.append('form_factor', data.form_factor);
        formData.append('modular', String(data.modular));
        formData.append('price', String(data.price));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/power-supplies/${powerSupply.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (powerSupply.image) {
            setSelectedImage(`/storage/${powerSupply.image.url}`);
        }
    }, [powerSupply]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier une Alimentation</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block font-medium">Nom de l'alimentation</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Capacity */}
                <div>
                    <label className="block font-medium">Capacité (W)</label>
                    <input
                        type="number"
                        value={data.capacity}
                        onChange={(e) => setData('capacity', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Efficiency */}
                <div>
                    <label className="block font-medium">Efficacité</label>
                    <input
                        type="text"
                        value={data.efficiency}
                        onChange={(e) => setData('efficiency', e.target.value)}
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
                
                {/* Form Factor */}
                <div>
                    <label className="block font-medium">Form Factor</label>
                    <input
                        type="text"
                        value={data.form_factor}
                        onChange={(e) => setData('form_factor', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Modular */}
                <div>
                    <label className="block font-medium">Modulaire</label>
                    <select
                        value={data.modular ? 'true' : 'false'}
                        onChange={(e) => setData('modular', e.target.value === 'true')}
                        className="w-full border p-2 rounded"
                    >
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
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
                        Modifier Alimentation
                    </button>
                    <Link href="/power-supplies" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
