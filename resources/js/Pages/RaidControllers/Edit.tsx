import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface RaidController {
    id: number;
    name: string;
    model: string;
    supported_levels: string;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
    price: string;
}

interface Props {
    raidController: RaidController;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ raidController, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: raidController.name,
        model: raidController.model,
        supported_levels: raidController.supported_levels,
        brand_id: raidController.brand?.id ?? 0,
        server_ids: raidController.servers.map((server) => server.id),
        image: null as File | null,
        price: raidController.price,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        raidController.image?.url ? `/storage/${raidController.image.url}` : null
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
        formData.append('supported_levels', data.supported_levels);
        formData.append('brand_id', String(data.brand_id));
        formData.append('price', String(data.price));

        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        if (data.image) {
            formData.append('image', data.image);
        }

        post(`/raid-controllers/${raidController.id}`, {
            data: formData,
            onSuccess: () => {
                setSelectedImage(null);
            },
        });
    };

    useEffect(() => {
        if (raidController.image) {
            setSelectedImage(`/storage/${raidController.image.url}`);
        }
    }, [raidController]);

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier un Raid Controller</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Modèle</label>
                            <input type="text" value={data.model} onChange={(e) => setData('model', e.target.value)} className="w-full border p-2 rounded" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">Niveaux supportés</label>
                            <input type="text" value={data.supported_levels} onChange={(e) => setData('supported_levels', e.target.value)} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Prix</label>
                            <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full border p-2 rounded" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Marque</label>
                        <select value={data.brand_id} onChange={(e) => setData('brand_id', Number(e.target.value))} className="w-full border p-2 rounded" required>
                            <option value={0} disabled>Sélectionner une marque</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Serveurs associés</label>
                        <select multiple value={data.server_ids} onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('server_ids', selectedValues);
                        }} className="w-full border p-2 rounded">
                            {servers.map((server) => (
                                <option key={server.id} value={server.id}>{server.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Image</label>
                        <input type="file" onChange={handleImageChange} className="w-full border p-2 rounded" />
                        {selectedImage && <img src={selectedImage} alt="Prévisualisation" className="mt-2 w-32 h-32 object-cover rounded" />}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button type="submit" className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Modifier</button>
                        <Link href="/raid-controllers" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Retour</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
