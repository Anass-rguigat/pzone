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
        model: '',
        cpu_socket: '',
        chipset: '',
        ram_slots: '',
        pci_slots: '',
        form_factor: '',
        server_ids: [] as number[], // Serveurs associés
        image: null as File | null,
        price: '',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file)); // Afficher l'image sélectionnée
            setData('image', file);
        }
    };

    const handleServerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setData('server_ids', selectedValues.map(Number)); // Convertir en nombres
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/motherboards', {
            onSuccess: () => {
                // Réinitialiser le formulaire et l'image sélectionnée après succès
                setData({
                    name: '',
                    brand_id: '',
                    model: '',
                    cpu_socket: '',
                    chipset: '',
                    ram_slots: '',
                    pci_slots: '',
                    form_factor: '',
                    server_ids: [],
                    image: null,
                    price: '',
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
            <h1>Ajouter une Carte Mère</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="name">Nom de la carte mère:</label>
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
                    <label htmlFor="model">Modèle:</label>
                    <input
                        type="text"
                        name="model"
                        value={data.model}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.model && <div className="text-red-600 text-sm">{errors.model}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="cpu_socket">Socket CPU:</label>
                    <input
                        type="text"
                        name="cpu_socket"
                        value={data.cpu_socket}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.cpu_socket && <div className="text-red-600 text-sm">{errors.cpu_socket}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="chipset">Chipset:</label>
                    <input
                        type="text"
                        name="chipset"
                        value={data.chipset}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.chipset && <div className="text-red-600 text-sm">{errors.chipset}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="ram_slots">Slots RAM:</label>
                    <input
                        type="number"
                        name="ram_slots"
                        value={data.ram_slots}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Nombre de slots RAM"
                    />
                    {errors.ram_slots && <div className="text-red-600 text-sm">{errors.ram_slots}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="pci_slots">Slots PCI:</label>
                    <input
                        type="number"
                        name="pci_slots"
                        value={data.pci_slots}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Nombre de slots PCI"
                    />
                    {errors.pci_slots && <div className="text-red-600 text-sm">{errors.pci_slots}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="form_factor">Form Factor:</label>
                    <input
                        type="text"
                        name="form_factor"
                        value={data.form_factor}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                    />
                    {errors.form_factor && <div className="text-red-600 text-sm">{errors.form_factor}</div>}
                </div>

{/* Champ de prix */}
<div className="mt-4">
                    <label htmlFor="price">Prix:</label>
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded"
                        placeholder="Prix de la carte mère"
                    />
                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
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
                        {processing ? 'Enregistrement...' : 'Ajouter la Carte Mère'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
