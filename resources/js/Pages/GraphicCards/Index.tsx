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

interface GraphicCard {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[]; // Serveurs associés à la carte graphique
    price?: number; // Prix de la carte graphique
    gpu_architecture: string; // Architecture GPU
    memory_type: string; // Type de mémoire
    power_rating: number; // Puissance (Watt)
}

interface Props {
    graphicCards: GraphicCard[];
}

export default function Index({ graphicCards }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte graphique ?")) {
            destroy(`/graphic-cards/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cartes Graphiques
                </h2>
            }
        >
            <h1>Liste des Cartes Graphiques</h1>
            <Link href="/graphic-cards/create" className="btn btn-primary">Ajouter une Carte Graphique</Link>

            <ul className="mt-4">
                {graphicCards.map((graphicCard) => (
                    <li key={graphicCard.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/graphicCards/${graphicCard.id}`} className="text-blue-600">
                                {graphicCard.name} - {graphicCard.brand.name}
                                {graphicCard.image && <img src={`/storage/${graphicCard.image.url}`} alt={graphicCard.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {graphicCard.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs associés :</strong>
                                    <ul className="ml-4 list-disc">
                                        {graphicCard.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            {graphicCard.price && (
                                <div className="mt-2">
                                    <strong>Prix :</strong> {graphicCard.price} €
                                </div>
                            )}
                            {/* Affichage de l'architecture GPU */}
                            <div className="mt-2">
                                <strong>Architecture GPU :</strong> {graphicCard.gpu_architecture}
                            </div>
                            {/* Affichage du type de mémoire */}
                            <div className="mt-2">
                                <strong>Type de Mémoire :</strong> {graphicCard.memory_type}
                            </div>
                            {/* Affichage de la puissance */}
                            <div className="mt-2">
                                <strong>Puissance :</strong> {graphicCard.power_rating} W
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/graphic-cards/${graphicCard.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(graphicCard.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/graphic-cards/${graphicCard.id}`} className="text-blue-600">
                                Voir
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
