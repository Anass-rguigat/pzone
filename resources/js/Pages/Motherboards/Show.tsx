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

interface Motherboard {
    id: number;
    name: string;
    model: string;
    cpu_socket: string;
    chipset: string;
    ram_slots: number;
    pci_slots: number;
    form_factor: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    price: number; 
}

interface Props {
    motherboard: Motherboard;
}

export default function Show({ motherboard }: Props) {
    return (
        <div>
            <h1>Détails de la carte mère</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {motherboard.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {motherboard.brand.name}
            </div>
            <div className="mt-2">
                <strong>Modèle:</strong> {motherboard.model}
            </div>
            <div className="mt-2">
                <strong>Socket CPU:</strong> {motherboard.cpu_socket}
            </div>
            <div className="mt-2">
                <strong>Chipset:</strong> {motherboard.chipset}
            </div>
            <div className="mt-2">
                <strong>Slots RAM:</strong> {motherboard.ram_slots}
            </div>
            <div className="mt-2">
                <strong>Slots PCI:</strong> {motherboard.pci_slots}
            </div>
            <div className="mt-2">
                <strong>Form Factor:</strong> {motherboard.form_factor}
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {motherboard.price} € {/* Display the price */}
            </div>
            {motherboard.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${motherboard.image.url}`} alt={motherboard.name} width="200" />
                </div>
            )}
            {motherboard.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs associés:</strong>
                    <ul className="ml-4 list-disc">
                        {motherboard.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/motherboards" className="btn btn-secondary">
                    Retour à la liste
                </Link>
            </div>
        </div>
    );
}
