import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
    price:number;
    brand: Brand;
    image?: Image;
    servers: Server[];
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: number;
    boost_clock: number;
    socket: string;
    thermal_design_power: number;
}

interface Props {
    processors: Processor[];
}

export default function Index({ processors }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce processeur ?")) {
            destroy(`/processors/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Processeurs
                </h2>
            }
        >
            <h1>Liste des Processeurs</h1>
            <Link href="/processors/create" className="btn btn-primary">Ajouter un processeur</Link>

            <ul className="mt-4">
                {processors.map((processor) => (
                    <li key={processor.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/processors/${processor.id}`} className="text-blue-600">
                                {processor.name} - {processor.brand.name}
                                {processor.image && <img src={`/storage/${processor.image.url}`} alt={processor.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {processor.price} €
                            </div>
                            {/* Affichage des serveurs associés */}
                            {processor.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {processor.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage des détails du processeur */}
                            <div className="mt-2">
                                <strong>Modèle :</strong> {processor.model}
                            </div>
                            <div className="mt-2">
                                <strong>Nombre de cœurs :</strong> {processor.core_count}
                            </div>
                            <div className="mt-2">
                                <strong>Nombre de threads :</strong> {processor.thread_count}
                            </div>
                            <div className="mt-2">
                                <strong>Fréquence de base :</strong> {processor.base_clock} GHz
                            </div>
                            <div className="mt-2">
                                <strong>Fréquence boost :</strong> {processor.boost_clock} GHz
                            </div>
                            <div className="mt-2">
                                <strong>Socket :</strong> {processor.socket}
                            </div>
                            <div className="mt-2">
                                <strong>Thermal Design Power (TDP) :</strong> {processor.thermal_design_power} W
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/processors/${processor.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(processor.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/processors/${processor.id}`} className="text-blue-600">
                                show
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
