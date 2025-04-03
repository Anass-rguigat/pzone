import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '@/Layouts/layout';

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
        type: '',
        interface_type: '',
        speed: '',
        power_rating: '',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setData('image', file);
        }
    };

    const handleServerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setData('server_ids', selectedValues.map(Number));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/expansion-cards', {
            onSuccess: () => {
                setData({
                    name: '',
                    brand_id: '',
                    image: null,
                    server_ids: [],
                    price: '',
                    type: '',
                    interface_type: '',
                    speed: '',
                    power_rating: '',
                });
                setSelectedImage(null);
            },
        });
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ajouter une Carte d'Extension
                </h2>
            }
        >
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Ajouter une Nouvelle Carte d'Extension</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={data.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">Marque</label>
                            <select
                                name="brand_id"
                                id="brand_id"
                                value={data.brand_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner une Marque</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
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
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="type"
                                id="type"
                                value={data.type}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="pci-e">PCI-E</option>
                                <option value="usb">USB</option>
                                <option value="m.2">M.2</option>
                            </select>
                            {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="interface_type" className="block text-sm font-medium text-gray-700">Type d'interface</label>
                            <input
                                type="text"
                                name="interface_type"
                                id="interface_type"
                                value={data.interface_type}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.interface_type && <p className="text-red-600 text-sm">{errors.interface_type}</p>}
                        </div>

                        <div>
                            <label htmlFor="speed" className="block text-sm font-medium text-gray-700">Vitesse (MHz)</label>
                            <input
                                type="number"
                                name="speed"
                                id="speed"
                                value={data.speed}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.speed && <p className="text-red-600 text-sm">{errors.speed}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="power_rating" className="block text-sm font-medium text-gray-700">Puissance (W)</label>
                            <input
                                type="number"
                                name="power_rating"
                                id="power_rating"
                                value={data.power_rating}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.power_rating && <p className="text-red-600 text-sm">{errors.power_rating}</p>}
                        </div>

                        <div>
                            <label htmlFor="server_ids" className="block text-sm font-medium text-gray-700">Serveurs Associés</label>
                            <select
                                name="server_ids"
                                id="server_ids"
                                multiple
                                value={data.server_ids}
                                onChange={handleServerSelection}
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
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {selectedImage && <p className="ml-2 text-sm text-gray-500">{selectedImage}</p>}
                        </div>
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        >
                            {processing ? 'Enregistrement...' : 'Ajouter la carte d\'extension'}
                        </button>
                        <Link href="/expansion-cards" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
