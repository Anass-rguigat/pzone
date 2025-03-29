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

interface HardDrive {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    type: string;
    capacity: number;
    price: number;
    stock: number;
    interface: string;
}

interface Props {
    hardDrive: HardDrive;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ hardDrive, brands, servers }: Props) {
    return (
        <div>
            <h1>Modifier le disque dur</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {hardDrive.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {hardDrive.brand.name}
            </div>
            <div className="mt-2">
                <strong>Type:</strong> {hardDrive.type}
            </div>
            <div className="mt-2">
                <strong>Capacité:</strong> {hardDrive.capacity} Go
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {hardDrive.price} €
            </div>
            <div className="mt-2">
                <strong>Stock:</strong> {hardDrive.stock}
            </div>
            <div className="mt-2">
                <strong>Interface:</strong> {hardDrive.interface}
            </div>
            {hardDrive.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img
                        src={`/storage/${hardDrive.image.url}`}
                        alt={hardDrive.name}
                        width="200"
                    />
                </div>
            )}
            {hardDrive.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs:</strong>
                    <ul className="ml-4 list-disc">
                        {hardDrive.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href={`/hard-drives/${hardDrive.id}/edit`} className="btn btn-primary">
                    Modifier
                </Link>
            </div>
            <div className="mt-4">
                <Link href="/hard-drives" className="btn btn-secondary">
                    Retour à la liste
                </Link>
            </div>
        </div>
    );
}
