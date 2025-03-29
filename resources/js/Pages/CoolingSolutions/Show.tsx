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

interface CoolingSolution {
    id: number;
    name: string;
    type: string;
    manufacturer: string;
    power_rating: number;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    coolingSolution: CoolingSolution;
}

export default function Show({ coolingSolution }: Props) {
    return (
        <div>
            <h1>Details de la Solution de Refroidissement</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {coolingSolution.name}
            </div>
            <div className="mt-2">
                <strong>Type:</strong> {coolingSolution.type}
            </div>
            <div className="mt-2">
                <strong>Fabricant:</strong> {coolingSolution.manufacturer}
            </div>
            <div className="mt-2">
                <strong>Puissance:</strong> {coolingSolution.power_rating} W
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {coolingSolution.price} €
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {coolingSolution.brand.name}
            </div>
            {coolingSolution.image && (
                <div className="mt-2">
                    <strong>Image:</strong> 
                    <img src={`/storage/${coolingSolution.image.url}`} alt={coolingSolution.name} width="200" />
                </div>
            )}
            {coolingSolution.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs Associés:</strong>
                    <ul className="ml-4 list-disc">
                        {coolingSolution.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/cooling-solutions" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
