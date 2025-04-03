// Suppliers/Create.tsx
import { Link, useForm } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/suppliers');
    };

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Ajouter un Nouveau Fournisseur</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom du fournisseur</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom du contact</label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.contact_name && <p className="text-red-600 text-sm">{errors.contact_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ville</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pays</label>
                            <input
                                type="text"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 rounded-lg px-5 py-2.5"
                            disabled={processing}
                        >
                            {processing ? 'Enregistrement...' : 'Créer le Fournisseur'}
                        </button>
                        <Link href="/suppliers" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 rounded-lg px-5 py-2.5">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}