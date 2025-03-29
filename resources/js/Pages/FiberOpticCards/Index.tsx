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

interface FiberOpticCard {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    fiber_type: string;
    speed: number;
    power_rating: number;
    price: number;
}

interface Props {
    fiberOpticCards: FiberOpticCard[];
}

export default function Index({ fiberOpticCards }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte optique ?")) {
            destroy(`/fiber-optic-cards/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cartes Optiques
                </h2>
            }
        >
            <h1>Liste des Cartes Optiques</h1>
            <Link href="/fiber-optic-cards/create" className="btn btn-primary">Ajouter une carte optique</Link>

            <ul className="mt-4">
                {fiberOpticCards.map((fiberOpticCard) => (
                    <li key={fiberOpticCard.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/fiber-optic-cards/${fiberOpticCard.id}`} className="text-blue-600">
                                {fiberOpticCard.name} - {fiberOpticCard.brand.name}
                                {fiberOpticCard.image && (
                                    <img 
                                        src={`/storage/${fiberOpticCard.image.url}`} 
                                        alt={fiberOpticCard.name} 
                                        width="50" 
                                        className="ml-2"
                                    />
                                )}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {fiberOpticCard.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {fiberOpticCard.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {fiberOpticCard.price} €
                            </div>
                            {/* Affichage du type de fibre */}
                            <div className="mt-2">
                                <strong>Type de Fibre :</strong> {fiberOpticCard.fiber_type}
                            </div>
                            {/* Affichage de la vitesse */}
                            <div className="mt-2">
                                <strong>Vitesse :</strong> {fiberOpticCard.speed} Mbps
                            </div>
                            {/* Affichage de la consommation en puissance */}
                            <div className="mt-2">
                                <strong>Consommation de Puissance :</strong> {fiberOpticCard.power_rating} W
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/fiber-optic-cards/${fiberOpticCard.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(fiberOpticCard.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/fiber-optic-cards/${fiberOpticCard.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
