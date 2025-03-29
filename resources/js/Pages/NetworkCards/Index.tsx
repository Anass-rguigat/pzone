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

interface NetworkCard {
    id: number;
    name: string;
    model: string;
    interface: string;
    speed: number;
    brand: Brand;
    image?: Image;
    price: number; 
    servers: Server[];
}

interface Props {
    networkCards: NetworkCard[];
}

export default function Index({ networkCards }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte réseau ?")) {
            destroy(`/network-cards/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cartes Réseau
                </h2>
            }
        >
            <h1>Liste des Cartes Réseau</h1>
            <Link href="/network-cards/create" className="btn btn-primary">Ajouter une carte réseau</Link>

            <ul className="mt-4">
                {networkCards.map((networkCard) => (
                    <li key={networkCard.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/network-cards/${networkCard.id}`} className="text-blue-600">
                                {networkCard.name} - {networkCard.brand.name}
                                {networkCard.image && <img src={`/storage/${networkCard.image.url}`} alt={networkCard.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {networkCard.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {networkCard.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage de la vitesse */}
                            <div className="mt-2">
                                <strong>Vitesse :</strong> {networkCard.speed} Mbps
                            </div>
                            {/* Affichage du modèle */}
                            <div className="mt-2">
                                <strong>Modèle :</strong> {networkCard.model}
                            </div>
                            {/* Affichage de l'interface */}
                            <div className="mt-2">
                                <strong>Interface :</strong> {networkCard.interface}
                            </div>
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {networkCard.price} €
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/network-cards/${networkCard.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(networkCard.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/network-cards/${networkCard.id}`} className="text-blue-600">
                                Détails
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
