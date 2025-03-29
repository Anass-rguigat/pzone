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

interface HardDrive {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    price?: number;
    capacity: number;
    type: 'hdd' | 'ssd' | 'nvme';
    interface: string;
    speed?: number;
    stock: number;  // Ajout de l'attribut stock
}

interface Props {
    hardDrives: HardDrive[];
}

export default function Index({ hardDrives }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce disque dur ?")) {
            destroy(`/hard-drives/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Disques Durs
                </h2>
            }
        >
            <h1>Liste des Disques Durs</h1>
            <Link href="/hard-drives/create" className="btn btn-primary">Ajouter un disque dur</Link>

            <ul className="mt-4">
                {hardDrives.map((hardDrive) => (
                    <li key={hardDrive.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/hard_drives/${hardDrive.id}`} className="text-blue-600">
                                {hardDrive.name} - {hardDrive.brand.name}
                                {hardDrive.image && <img src={`/storage/${hardDrive.image.url}`} alt={hardDrive.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {hardDrive.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {hardDrive.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            {hardDrive.price && (
                                <div className="mt-2">
                                    <strong>Prix :</strong> {hardDrive.price} €
                                </div>
                            )}
                            {/* Affichage de la capacité */}
                            <div className="mt-2">
                                <strong>Capacité :</strong> {hardDrive.capacity} Go
                            </div>
                            {/* Affichage du type */}
                            <div className="mt-2">
                                <strong>Type :</strong> {hardDrive.type.toUpperCase()}
                            </div>
                            {/* Affichage de l'interface */}
                            <div className="mt-2">
                                <strong>Interface :</strong> {hardDrive.interface}
                            </div>
                            {/* Affichage du stock */}
                            <div className="mt-2">
                                <strong>Stock :</strong> {hardDrive.stock}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/hard-drives/${hardDrive.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(hardDrive.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/hard-drives/${hardDrive.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
