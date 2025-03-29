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

interface ExpansionCard {
    id: number;
    name: string;
    type: string;
    interface_type: string;
    speed: number;
    power_rating: number;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    expansionCards: ExpansionCard[];
}

export default function Index({ expansionCards }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte d'extension ?")) {
            destroy(`/expansion-cards/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cartes d'extension
                </h2>
            }
        >
            <h1>Liste des Cartes d'Extension</h1>
            <Link href="/expansion-cards/create" className="btn btn-primary">Ajouter une carte d'extension</Link>

            <ul className="mt-4">
                {expansionCards.map((expansionCard) => (
                    <li key={expansionCard.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/expansion-cards/${expansionCard.id}`} className="text-blue-600">
                                {expansionCard.name} - {expansionCard.brand.name}
                                {expansionCard.image && <img src={`/storage/${expansionCard.image.url}`} alt={expansionCard.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {expansionCard.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {expansionCard.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            {expansionCard.price && (
                                <div className="mt-2">
                                    <strong>Prix :</strong> {expansionCard.price} €
                                </div>
                            )}
                            {/* Affichage de la vitesse */}
                            <div className="mt-2">
                                <strong>Vitesse :</strong> {expansionCard.speed} MHz
                            </div>
                            {/* Affichage de la puissance */}
                            <div className="mt-2">
                                <strong>Puissance :</strong> {expansionCard.power_rating} W
                            </div>
                            {/* Affichage du type */}
                            <div className="mt-2">
                                <strong>Type :</strong> {expansionCard.type}
                            </div>
                            {/* Affichage du type d'interface */}
                            <div className="mt-2">
                                <strong>Interface :</strong> {expansionCard.interface_type}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/expansion-cards/${expansionCard.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(expansionCard.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/expansion-cards/${expansionCard.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
