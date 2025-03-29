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

interface CoolingSolution {
    id: number;
    name: string;
    type: string;
    brand: Brand;
    manufacturer: string;
    power_rating: number;
    price: number;
    image?: Image;
    servers: Server[];
}

interface Props {
    coolingSolutions: CoolingSolution[];
}

export default function Index({ coolingSolutions }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette solution de refroidissement ?")) {
            destroy(`/cooling-solutions/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Solutions de refroidissement
                </h2>
            }
        >
            <h1>Liste des Solutions de Refroidissement</h1>
            <Link href="/cooling-solutions/create" className="btn btn-primary">Ajouter une Solution de Refroidissement</Link>

            <ul className="mt-4">
                {coolingSolutions.map((coolingSolution) => (
                    <li key={coolingSolution.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/coolingSolutions/${coolingSolution.id}`} className="text-blue-600">
                                {coolingSolution.name} - {coolingSolution.brand.name}
                                {coolingSolution.image && <img src={`/storage/${coolingSolution.image.url}`} alt={coolingSolution.name} width="50" className="ml-2" />}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {coolingSolution.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {coolingSolution.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {coolingSolution.price} €
                            </div>
                            {/* Affichage de la puissance */}
                            <div className="mt-2">
                                <strong>Puissance :</strong> {coolingSolution.power_rating} W
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/cooling-solutions/${coolingSolution.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(coolingSolution.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/cooling-solutions/${coolingSolution.id}`} className="text-blue-600">
                                Détails
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
