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

interface PowerSupply {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[]; // Serveurs associés à l'alimentation
    capacity: number; // Capacité de l'alimentation
    efficiency: string; // Efficacité de l'alimentation
    form_factor: string; // Format de l'alimentation
    modular: boolean; // Modulaire ou non
    price?: number;
}

interface Props {
    powerSupplies: PowerSupply[];
}

export default function Index({ powerSupplies }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette alimentation ?")) {
            destroy(`/power-supplies/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Alimentations
                </h2>
            }
        >
            <h1>Liste des Alimentations</h1>
            <Link href="/power-supplies/create" className="btn btn-primary">Ajouter une Alimentation</Link>

            <ul className="mt-4">
                {powerSupplies.map((powerSupply) => (
                    <li key={powerSupply.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/power-supplies/${powerSupply.id}`} className="text-blue-600">
                                {powerSupply.name} - {powerSupply.brand.name}
                                {powerSupply.image && <img src={`/storage/${powerSupply.image.url}`} alt={powerSupply.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {powerSupply.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {powerSupply.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage de la capacité */}
                            <div className="mt-2">
                                <strong>Capacité :</strong> {powerSupply.capacity} W
                            </div>
                            {/* Affichage de l'efficacité */}
                            <div className="mt-2">
                                <strong>Efficacité :</strong> {powerSupply.efficiency}
                            </div>
                            {/* Affichage du format */}
                            <div className="mt-2">
                                <strong>Format :</strong> {powerSupply.form_factor}
                            </div>
                            {/* Affichage si modulaire ou non */}
                            <div className="mt-2">
                                <strong>Modulaire :</strong> {powerSupply.modular ? 'Oui' : 'Non'}
                            </div>
                            {/* Affichage du prix */}
                            {powerSupply.price !== undefined && (
                                <div className="mt-2">
                                    <strong>Prix :</strong> {powerSupply.price ? `${powerSupply.price} €` : 'Non défini'}
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/power-supplies/${powerSupply.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(powerSupply.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/power-supplies/${powerSupply.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
