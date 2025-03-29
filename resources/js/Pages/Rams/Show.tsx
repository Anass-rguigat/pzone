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

interface Ram {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    capacity: string; // Capacité de la RAM
    type: string; // Type de la RAM (DDR3, DDR4, etc.)
    speed: string; // Vitesse de la RAM (en MHz)
}

interface Props {
    ram: Ram;
}

export default function Show({ ram }: Props) {
    return (
        <div>
            <h1>Details de la RAM</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {ram.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {ram.brand.name}
            </div>
            <div className="mt-2">
                <strong>Capacité:</strong> {ram.capacity} Go
            </div>
            <div className="mt-2">
                <strong>Type:</strong> {ram.type}
            </div>
            <div className="mt-2">
                <strong>Vitesse:</strong> {ram.speed} MHz
            </div>
            {ram.image && (
                <div className="mt-2">
                    <strong>Image:</strong> 
                    <img src={`/storage/${ram.image.url}`} alt={ram.name} width="200" />
                </div>
            )}
            {ram.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs:</strong>
                    <ul className="ml-4 list-disc">
                        {ram.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/rams" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
