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

interface NetworkCard {
    id: number;
    name: string;
    brand: Brand;
    model: string;
    interface: string;
    speed: number;
    price: number;
    image?: Image;
    servers: Server[];
}

interface Props {
    networkCard: NetworkCard;
}

export default function Show({ networkCard }: Props) {
    return (
        <div>
            <h1>Détails de la carte réseau</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {networkCard.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {networkCard.brand.name}
            </div>
            <div className="mt-2">
                <strong>Modèle:</strong> {networkCard.model}
            </div>
            <div className="mt-2">
                <strong>Interface:</strong> {networkCard.interface}
            </div>
            <div className="mt-2">
                <strong>Vitesse:</strong> {networkCard.speed} Mbps
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> €{networkCard.price} {/* Display the price */}
            </div>
            {networkCard.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${networkCard.image.url}`} alt={networkCard.name} width="200" />
                </div>
            )}
            {networkCard.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs associés:</strong>
                    <ul className="ml-4 list-disc">
                        {networkCard.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/network-cards" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
