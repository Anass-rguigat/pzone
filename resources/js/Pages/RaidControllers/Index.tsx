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

interface RaidController {
    id: number;
    name: string;
    brand: Brand;
    model: string;
    price: number;
    supported_levels: string;
    image?: Image;
    servers: Server[];
}

interface Props {
    raidControllers: RaidController[];
}

export default function Index({ raidControllers }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce contrôleur RAID ?")) {
            destroy(`/raid-controllers/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Contrôleurs RAID
                </h2>
            }
        >
            <h1>Liste des contrôleurs RAID</h1>
            <Link href="/raid-controllers/create" className="btn btn-primary">Ajouter un contrôleur RAID</Link>

            <ul className="mt-4">
                {raidControllers.map((raidController) => (
                    <li key={raidController.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/raid-controllers/${raidController.id}`} className="text-blue-600">
                                {raidController.name} - {raidController.brand.name}
                                {raidController.image && <img src={`/storage/${raidController.image.url}`} alt={raidController.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {raidController.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {raidController.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du modèle */}
                            <div className="mt-2">
                                <strong>Modèle :</strong> {raidController.model}
                            </div>
                            {/* Affichage des niveaux supportés */}
                            <div className="mt-2">
                                <strong>Niveaux supportés :</strong> {raidController.supported_levels}
                            </div>
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> €{raidController.price}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/raid-controllers/${raidController.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(raidController.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/raid-controllers/${raidController.id}`} className="text-blue-600">
                                Détails
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
