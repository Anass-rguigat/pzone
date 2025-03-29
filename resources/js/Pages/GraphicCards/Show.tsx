import { Link } from '@inertiajs/react';

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
    servers: Server[];
    gpu_architecture: string;
    memory_type: string;
    power_rating: number;
    price: number;
}

interface Props {
    graphicCard: GraphicCard;
}

export default function Show({ graphicCard }: Props) {
    return (
        <div>
            <h1>Détails de la Carte Graphique</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {graphicCard.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {graphicCard.brand.name}
            </div>
            <div className="mt-2">
                <strong>Architecture GPU:</strong> {graphicCard.gpu_architecture}
            </div>
            <div className="mt-2">
                <strong>Type de Mémoire:</strong> {graphicCard.memory_type}
            </div>
            <div className="mt-2">
                <strong>Consommation de Puissance:</strong> {graphicCard.power_rating} W
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> ${graphicCard.price}
            </div>
            {graphicCard.image && (
                <div className="mt-2">
                    <strong>Image:</strong> 
                    <img src={`/storage/${graphicCard.image.url}`} alt={graphicCard.name} width="200" />
                </div>
            )}
            {graphicCard.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs Associés:</strong>
                    <ul className="ml-4 list-disc">
                        {graphicCard.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/graphic-cards" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
