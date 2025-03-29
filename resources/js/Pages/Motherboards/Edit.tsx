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

interface Motherboard {
    id: number;
    name: string;
    model: string;
    cpu_socket: string;
    chipset: string;
    ram_slots: number;
    pci_slots: number;
    form_factor: string;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
    price: number;
}

interface Props {
    motherboard: Motherboard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ motherboard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: motherboard.name,
        model: motherboard.model,
        cpu_socket: motherboard.cpu_socket,
        chipset: motherboard.chipset,
        ram_slots: motherboard.ram_slots,
        pci_slots: motherboard.pci_slots,
        form_factor: motherboard.form_factor,
        brand_id: motherboard.brand?.id ?? 0,
        server_ids: motherboard.servers.map((server) => server.id),
        image: null as File | null,
        price: motherboard.price,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        motherboard.image?.url ? `/storage/${motherboard.image.url}` : null
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
        formData.append('model', data.model);
        formData.append('cpu_socket', data.cpu_socket);
        formData.append('chipset', data.chipset);
        formData.append('ram_slots', String(data.ram_slots));
        formData.append('pci_slots', String(data.pci_slots));
        formData.append('form_factor', data.form_factor);
        formData.append('brand_id', String(data.brand_id));
        formData.append('price', String(data.price));

        // Add selected servers
        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        // Append image if it exists
        if (data.image) {
            formData.append('image', data.image);
        }

        // Send data using post method
        post(`/motherboards/${motherboard.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (motherboard.image) {
            setSelectedImage(`/storage/${motherboard.image.url}`);
        }
    }, [motherboard]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Modifier une carte mère</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Motherboard Name */}
                <div>
                    <label className="block font-medium">Nom de la carte mère</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Model */}
                <div>
                    <label className="block font-medium">Modèle</label>
                    <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* CPU Socket */}
                <div>
                    <label className="block font-medium">Socket CPU</label>
                    <input
                        type="text"
                        value={data.cpu_socket}
                        onChange={(e) => setData('cpu_socket', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* Chipset */}
                <div>
                    <label className="block font-medium">Chipset</label>
                    <input
                        type="text"
                        value={data.chipset}
                        onChange={(e) => setData('chipset', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* RAM Slots */}
                <div>
                    <label className="block font-medium">Slots RAM</label>
                    <input
                        type="number"
                        value={data.ram_slots}
                        onChange={(e) => setData('ram_slots', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* PCI Slots */}
                <div>
                    <label className="block font-medium">Slots PCI</label>
                    <input
                        type="number"
                        value={data.pci_slots}
                        onChange={(e) => setData('pci_slots', Number(e.target.value))}
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

                {/* Servers Association */}
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

                <div>
                    <label className="block font-medium">Prix</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
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
                        Modifier la carte mère
                    </button>
                    <Link href="/motherboards" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
