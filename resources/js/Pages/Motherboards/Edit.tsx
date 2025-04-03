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
        formData.append('cpu_socket', data.cpu_socket);
        formData.append('chipset', data.chipset);
        formData.append('ram_slots', String(data.ram_slots));
        formData.append('pci_slots', String(data.pci_slots));
        formData.append('form_factor', data.form_factor);
        formData.append('brand_id', String(data.brand_id));
        formData.append('price', String(data.price));

        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        if (data.image) {
            formData.append('image', data.image);
        }

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
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier une Carte Mère</h1>

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
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="cpu_socket" className="block text-sm font-medium text-gray-700">Socket CPU</label>
                            <input
                                type="text"
                                name="cpu_socket"
                                id="cpu_socket"
                                value={data.cpu_socket}
                                onChange={(e) => setData('cpu_socket', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.cpu_socket && <p className="text-red-600 text-sm">{errors.cpu_socket}</p>}
                        </div>

                        <div>
                            <label htmlFor="chipset" className="block text-sm font-medium text-gray-700">Chipset</label>
                            <input
                                type="text"
                                name="chipset"
                                id="chipset"
                                value={data.chipset}
                                onChange={(e) => setData('chipset', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.chipset && <p className="text-red-600 text-sm">{errors.chipset}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="ram_slots" className="block text-sm font-medium text-gray-700">Slots RAM</label>
                            <input
                                type="number"
                                name="ram_slots"
                                id="ram_slots"
                                value={data.ram_slots}
                                onChange={(e) => setData('ram_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.ram_slots && <p className="text-red-600 text-sm">{errors.ram_slots}</p>}
                        </div>

                        <div>
                            <label htmlFor="pci_slots" className="block text-sm font-medium text-gray-700">Slots PCI</label>
                            <input
                                type="number"
                                name="pci_slots"
                                id="pci_slots"
                                value={data.pci_slots}
                                onChange={(e) => setData('pci_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.pci_slots && <p className="text-red-600 text-sm">{errors.pci_slots}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="form_factor" className="block text-sm font-medium text-gray-700">Facteur de Forme</label>
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
                            <label htmlFor="servers" className="block text-sm font-medium text-gray-700">Serveurs associés</label>
                            <select
                                name="server_ids"
                                id="server_ids"
                                multiple
                                value={data.server_ids}
                                onChange={(e) => setData('server_ids', Array.from(e.target.selectedOptions, option => Number(option.value)))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {servers.map((server) => (
                                    <option key={server.id} value={server.id}>{server.name}</option>
                                ))}
                            </select>
                            {errors.server_ids && <p className="text-red-600 text-sm">{errors.server_ids}</p>}
                        </div>
                    </div>

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
                                        alt="Image de la carte mère"
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

                    <div className="flex items-center justify-end space-x-4 ">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        >
                            Modifier Carte Mère
                        </button>
                        <Link href="/motherboards" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
