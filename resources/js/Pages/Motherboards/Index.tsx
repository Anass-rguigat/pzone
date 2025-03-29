import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Brand {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Server {
    id: number;
    name: string;
}

interface Motherboard {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    model: string;
    cpu_socket: string;
    chipset: string;
    ram_slots: number;
    pci_slots: number;
    form_factor: string;
    price: number;
}

interface Props {
    motherboards: Motherboard[];
}

export default function Index({ motherboards }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte mère ?")) {
            destroy(`/motherboards/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cartes Mères
                </h2>
            }
        >
            <h1>Liste des Cartes Mères</h1>
            <Link href="/motherboards/create" className="btn btn-primary">Ajouter une carte mère</Link>

            <ul className="mt-4">
                {motherboards.map((motherboard) => (
                    <li key={motherboard.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/motherboards/${motherboard.id}`} className="text-blue-600">
                                {motherboard.name} - {motherboard.brand.name}
                                {motherboard.image && (
                                    <img
                                        src={`/storage/${motherboard.image.url}`}
                                        alt={motherboard.name}
                                        width="50"
                                        className="ml-2"
                                    />
                                )}
                            </Link>

                            {/* Affichage des serveurs associés */}
                            {motherboard.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs associés :</strong>
                                    <ul className="ml-4 list-disc">
                                        {motherboard.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Affichage du modèle, socket CPU et chipset */}
                            <div className="mt-2">
                                <strong>Modèle :</strong> {motherboard.model}
                            </div>
                            <div className="mt-2">
                                <strong>Socket CPU :</strong> {motherboard.cpu_socket}
                            </div>
                            <div className="mt-2">
                                <strong>Chipset :</strong> {motherboard.chipset}
                            </div>

                            {/* Affichage des slots RAM et PCI */}
                            <div className="mt-2">
                                <strong>Slots RAM :</strong> {motherboard.ram_slots}
                            </div>
                            <div className="mt-2">
                                <strong>Slots PCI :</strong> {motherboard.pci_slots}
                            </div>

                            {/* Affichage du facteur de forme */}
                            <div className="mt-2">
                                <strong>Facteur de forme :</strong> {motherboard.form_factor}
                            </div>
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {motherboard.price} €
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/motherboards/${motherboard.id}/edit`} className="text-green-600">
                                ✏ Modifier
                            </Link>
                            <button onClick={() => handleDelete(motherboard.id)} className="text-red-600">
                                🗑 Supprimer
                            </button>
                            <Link href={`/motherboards/${motherboard.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
