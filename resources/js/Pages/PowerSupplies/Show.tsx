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

interface PowerSupply {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    capacity: number; // Capacité en watts
    efficiency: string; // Efficacité (ex: 80 Plus Gold)
    form_factor: string; // Format (ex: ATX, SFX)
    modular: boolean; // Modulaire ou non
    price: number;
}

interface Props {
    powerSupply: PowerSupply;
}

export default function Show({ powerSupply }: Props) {
    return (
        <div>
            <h1>Details de l'Alimentation</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {powerSupply.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {powerSupply.brand.name}
            </div>
            <div className="mt-2">
                <strong>Capacité:</strong> {powerSupply.capacity} W
            </div>
            <div className="mt-2">
                <strong>Efficacité:</strong> {powerSupply.efficiency}
            </div>
            <div className="mt-2">
                <strong>Format:</strong> {powerSupply.form_factor}
            </div>
            <div className="mt-2">
                <strong>Modulaire:</strong> {powerSupply.modular ? 'Oui' : 'Non'}
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {powerSupply.price} €
            </div>
            {powerSupply.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${powerSupply.image.url}`} alt={powerSupply.name} width="200" />
                </div>
            )}
            {powerSupply.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs associés:</strong>
                    <ul className="ml-4 list-disc">
                        {powerSupply.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/power-supplies" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
