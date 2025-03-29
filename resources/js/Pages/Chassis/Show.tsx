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

interface Chassis {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    type: string; // Type du châssis
    form_factor: string; // Facteur de forme
    material: string; // Matériau
    price: number; // Prix
}

interface Props {
    chassis: Chassis;
}

export default function Show({ chassis }: Props) {
    return (
        <div>
            <h1>Détails du Châssis</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {chassis.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {chassis.brand.name}
            </div>
            <div className="mt-2">
                <strong>Type:</strong> {chassis.type}
            </div>
            <div className="mt-2">
                <strong>Facteur de forme:</strong> {chassis.form_factor}
            </div>
            <div className="mt-2">
                <strong>Matériau:</strong> {chassis.material}
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {chassis.price} €
            </div>
            {chassis.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${chassis.image.url}`} alt={chassis.name} width="200" />
                </div>
            )}
            {chassis.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs associés:</strong>
                    <ul className="ml-4 list-disc">
                        {chassis.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/chassis" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
