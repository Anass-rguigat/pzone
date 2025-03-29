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

interface Ram {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[]; // Ajout des serveurs attachés à la RAM
    price?: number; // Ajout du champ price
    capacity: number; // Ajout de la capacité
    type: 'ddr3' | 'ddr4' | 'ddr5'; // Ajout du type
    speed: number; // Ajout de la vitesse
}

interface Props {
    rams: Ram[];
}

export default function Index({ rams }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette RAM ?")) {
            destroy(`/rams/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Rams
                </h2>
            }
        >
            <h1>Liste des RAMs</h1>
            <Link href="/rams/create" className="btn btn-primary">Ajouter une RAM</Link>

            <ul className="mt-4">
                {rams.map((ram) => (
                    <li key={ram.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/rams/${ram.id}`} className="text-blue-600">
                                {ram.name} - {ram.brand.name}
                                {ram.image && <img src={`/storage/${ram.image.url}`} alt={ram.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {ram.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {ram.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            {ram.price && (
                                <div className="mt-2">
                                    <strong>Prix :</strong> {ram.price} €
                                </div>
                            )}
                            {/* Affichage de la capacité */}
                            <div className="mt-2">
                                <strong>Capacité :</strong> {ram.capacity} Go
                            </div>
                            {/* Affichage du type DDR */}
                            <div className="mt-2">
                                <strong>Type :</strong> {ram.type.toUpperCase()}
                            </div>
                            {/* Affichage de la vitesse */}
                            <div className="mt-2">
                                <strong>Vitesse :</strong> {ram.speed} MHz
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/rams/${ram.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(ram.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/rams/${ram.id}`} className="text-blue-600">
                                show
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
