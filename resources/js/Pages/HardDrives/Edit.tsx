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

interface HardDrive {
    id: number;
    name: string;
    price: number;
    type: string;
    capacity: string;
    interface: string;
    stock: number;
    brand: Brand;
    image: Image | null;
    servers: Server[];
}

interface Props {
    hardDrive: HardDrive;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ hardDrive, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: hardDrive.name,
        price: hardDrive.price,
        brand_id: hardDrive.brand?.id ?? 0,
        server_ids: hardDrive.servers.map((server) => server.id),
        image: null as File | null,
        capacity: hardDrive.capacity,
        type: hardDrive.type,
        interface: hardDrive.interface,
        stock: hardDrive.stock,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        hardDrive.image?.url ? `/storage/${hardDrive.image.url}` : null
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
        formData.append('brand_id', String(data.brand_id));
        formData.append('capacity', data.capacity);
        formData.append('type', data.type);
        formData.append('interface', data.interface);
        formData.append('stock', String(data.stock));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/hard-drives/${hardDrive.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (hardDrive.image) {
            setSelectedImage(`/storage/${hardDrive.image.url}`);
        }
    }, [hardDrive]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier un Disque Dur</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block font-medium">Nom du disque dur</label>
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
                    <label className="block font-medium">Prix du disque dur</label>
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
                        <option value="hdd">HDD</option>
                        <option value="ssd">SSD</option>
                        <option value="nvme">NVMe</option>
                    </select>
                </div>

                {/* Interface */}
                <div>
                    <label className="block font-medium">Interface</label>
                    <input
                        type="text"
                        value={data.interface}
                        onChange={(e) => setData('interface', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="block font-medium">Stock</label>
                    <input
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData('stock', Number(e.target.value))}
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
                        Modifier Disque Dur
                    </button>
                    <Link href="/hard_drives" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
