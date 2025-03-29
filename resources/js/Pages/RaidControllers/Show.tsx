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

interface RaidController {
    id: number;
    name: string;
    model: string;
    supported_levels: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    price: string; 
}

interface Props {
    raidController: RaidController;
}

export default function Show({ raidController }: Props) {
    return (
        <div>
            <h1>Détails du Raid Controller</h1>

            <div className="mt-4">
                <strong>Nom:</strong> {raidController.name}
            </div>
            <div className="mt-2">
                <strong>Modèle:</strong> {raidController.model}
            </div>
            <div className="mt-2">
                <strong>Niveaux supportés:</strong> {raidController.supported_levels}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {raidController.brand.name}
            </div>

            {/* Display price */}
            <div className="mt-2">
                <strong>Prix:</strong> {raidController.price} €
            </div>

            {raidController.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${raidController.image.url}`} alt={raidController.name} width="200" />
                </div>
            )}

            {raidController.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs associés:</strong>
                    <ul className="ml-4 list-disc">
                        {raidController.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4">
                <Link href="/raid-controllers" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
