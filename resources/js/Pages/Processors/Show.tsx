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

interface Processor {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: string;
    boost_clock: string;
    socket: string;
    thermal_design_power: number;
    price: number;
}

interface Props {
    processor: Processor;
}

export default function Show({ processor }: Props) {
    return (
        <div>
            <h1>Détails du Processeur</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {processor.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {processor.brand.name}
            </div>
            <div className="mt-2">
                <strong>Modèle:</strong> {processor.model}
            </div>
            <div className="mt-2">
                <strong>Nombre de cœurs:</strong> {processor.core_count}
            </div>
            <div className="mt-2">
                <strong>Nombre de threads:</strong> {processor.thread_count}
            </div>
            <div className="mt-2">
                <strong>Fréquence de base:</strong> {processor.base_clock} GHz
            </div>
            <div className="mt-2">
                <strong>Fréquence turbo:</strong> {processor.boost_clock} GHz
            </div>
            <div className="mt-2">
                <strong>Socket:</strong> {processor.socket}
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> ${processor.price} {/* Displaying the price */}
            </div>
            <div className="mt-2">
                <strong>Consommation énergétique:</strong> {processor.thermal_design_power} W
            </div>
            {processor.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img src={`/storage/${processor.image.url}`} alt={processor.name} width="200" />
                </div>
            )}
            {processor.servers.length > 0 && (
                <div className="mt-2">
                    <strong>Serveurs:</strong>
                    <ul className="ml-4 list-disc">
                        {processor.servers.map((server) => (
                            <li key={server.id}>{server.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mt-4">
                <Link href="/processors" className="btn btn-secondary">Retour à la liste</Link>
            </div>
        </div>
    );
}
