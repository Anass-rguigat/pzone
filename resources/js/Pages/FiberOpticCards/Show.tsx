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

interface FiberOpticCard {
    id: number;
    name: string;
    fiber_type: string;
    speed: string;
    power_rating: string;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    fiberOpticCard: FiberOpticCard;
}

export default function Show({ fiberOpticCard }: Props) {
    return (
        <div>
            <h1>Details de la Carte Fibre Optique</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {fiberOpticCard.name}
            </div>
            <div className="mt-2">
                <strong>Type de Fibre:</strong> {fiberOpticCard.fiber_type}
            </div>
            <div className="mt-2">
                <strong>Vitesse:</strong> {fiberOpticCard.speed} Mbps
            </div>
            <div className="mt-2">
                <strong>Puissance:</strong> {fiberOpticCard.power_rating} W
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {fiberOpticCard.price} €
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {fiberOpticCard.brand.name}
            </div>
            {fiberOpticCard.image && (
                <div className="mt-2">
                    <strong>Image:</strong> 
                    <img src={`/storage/${fiberOpticCard.image.url}`} alt={fiberOpticCard.name} width="200" />
                </div>
            )}
            {fiberOpticCard.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs Associés:</strong>
                    <ul className="ml-4 list-disc">
                        {fiberOpticCard.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/fiber-optic-cards" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
