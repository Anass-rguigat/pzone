import { Link, useForm } from '@inertiajs/react';
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
        price: '',
        capacity: '',
        type: '',
        speed: '',
        image: null as File | null,
        server_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/rams');
    };

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Ajouter une Nouvelle RAM</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Marque</label>
                            <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
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
                            <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
                            <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacité (Go)</label>
                            <input type="number" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Sélectionner un type</option>
                                <option value="ddr3">DDR3</option>
                                <option value="ddr4">DDR4</option>
                                <option value="ddr5">DDR5</option>
                            </select>
                            {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vitesse (MHz)</label>
                            <input type="number" value={data.speed} onChange={(e) => setData('speed', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.speed && <p className="text-red-600 text-sm">{errors.speed}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input type="file" onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full" />
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Serveurs Associés</label>
                        <select multiple value={data.server_ids} onChange={(e) => setData('server_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            {servers.map((server) => (
                                <option key={server.id} value={server.id}>{server.name}</option>
                            ))}
                        </select>
                        {errors.server_ids && <p className="text-red-600 text-sm">{errors.server_ids}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button type="submit" className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 rounded-lg px-5 py-2.5" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Créer la RAM'}
                        </button>
                        <Link href="/rams" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 rounded-lg px-5 py-2.5">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}