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

interface ExpansionCard {
    id: number;
    name: string;
    type: string;
    interface_type: string;
    speed: string;
    power_rating: string;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    expansionCard: ExpansionCard;
}

export default function Show({ expansionCard }: Props) {
    return (
        <div>
            <h1>Détails de la Carte d'Extension</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {expansionCard.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {expansionCard.brand.name}
            </div>
            <div className="mt-2">
                <strong>Type:</strong> {expansionCard.type}
            </div>
            <div className="mt-2">
                <strong>Interface:</strong> {expansionCard.interface_type}
            </div>
            <div className="mt-2">
                <strong>Vitesse:</strong> {expansionCard.speed} MHz
            </div>
            <div className="mt-2">
                <strong>Puissance:</strong> {expansionCard.power_rating} W
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {expansionCard.price} €
            </div>
            {expansionCard.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${expansionCard.image.url}`} alt={expansionCard.name} width="200" />
                </div>
            )}
            {expansionCard.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs Associés:</strong>
                    <ul className="ml-4 list-disc">
                        {expansionCard.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/expansion-cards" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
