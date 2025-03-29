import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    servers: Server[];
}

export default function Create({ brands, servers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand_id: '',
        image: null as File | null,
        server_ids: [] as number[],
        price: '',
        capacity: '',
        type: '',
        interface: '',
        stock: '', // Ajout du champ stock
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file)); // Display the selected image
            setData('image', file);
        }
    };

    const handleServerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setData('server_ids', selectedValues.map(Number)); // Convert to numbers
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/hard-drives', {
            onSuccess: () => {
                // Reset form and selected image upon success
                setData({
                    name: '',
                    brand_id: '',
                    image: null,
                    server_ids: [],
                    price: '',
                    capacity: '',
                    type: '',
                    interface: '',
                    stock: '', // Reset stock
                });
                setSelectedImage(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1>Ajouter un Disque Dur</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="name">Nom du Disque Dur:</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="brand_id">Marque:</label>
                    <select
                        name="brand_id"
                        value={data.brand_id}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    >
                        <option value="">Sélectionner une marque</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand_id && <div className="text-red-600 text-sm">{errors.brand_id}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="price">Prix:</label>
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Prix en €"
                    />
                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="capacity">Capacité:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={data.capacity}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Capacité en Go"
                    />
                    {errors.capacity && <div className="text-red-600 text-sm">{errors.capacity}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="type">Type:</label>
                    <select
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    >
                        <option value="">Sélectionner un type</option>
                        <option value="hdd">HDD</option>
                        <option value="ssd">SSD</option>
                        <option value="nvme">NVMe</option>
                    </select>
                    {errors.type && <div className="text-red-600 text-sm">{errors.type}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="interface">Interface:</label>
                    <input
                        type="text"
                        name="interface"
                        value={data.interface}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Interface (ex: SATA III)"
                    />
                    {errors.interface && <div className="text-red-600 text-sm">{errors.interface}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="stock">Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={data.stock}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Stock"
                    />
                    {errors.stock && <div className="text-red-600 text-sm">{errors.stock}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {selectedImage && <img src={selectedImage} alt="Preview" className="mt-2" width="150" />}
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="servers">Serveurs associés:</label>
                    <select
                        name="server_ids"
                        multiple
                        value={data.server_ids}
                        onChange={handleServerSelection}
                        className="mt-1 p-2 border rounded"
                    >
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>
                                {server.name}
                            </option>
                        ))}
                    </select>
                    {errors.server_ids && <div className="text-red-600 text-sm">{errors.server_ids}</div>}
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : 'Ajouter le Disque Dur'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
