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

interface Chassis {
    id: number;
    name: string;
    type: string;
    form_factor: string;
    material: string;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    chassis: Chassis[];
}

export default function Index({ chassis }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce châssis ?")) {
            destroy(`/chassis/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Châssis
                </h2>
            }
        >
            <h1>Liste des Châssis</h1>
            <Link href="/chassis/create" className="btn btn-primary">Ajouter un Châssis</Link>

            <ul className="mt-4">
                {chassis.map((chassisItem) => (
                    <li key={chassisItem.id} className="flex items-center justify-between py-2">
                        <div>
                            <Link href={`/chassis/${chassisItem.id}`} className="text-blue-600">
                                {chassisItem.name} - {chassisItem.brand.name}
                                {chassisItem.image && (
                                    <img src={`/storage/${chassisItem.image.url}`} alt={chassisItem.name} width="50" className="ml-2" />
                                )}
                            </Link>
                            {/* Affichage des serveurs associés */}
                            {chassisItem.servers.length > 0 && (
                                <div className="mt-2">
                                    <strong>Serveurs :</strong>
                                    <ul className="ml-4 list-disc">
                                        {chassisItem.servers.map((server) => (
                                            <li key={server.id}>{server.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Affichage du prix */}
                            <div className="mt-2">
                                <strong>Prix :</strong> {chassisItem.price} €
                            </div>
                            {/* Affichage du type et du form factor */}
                            <div className="mt-2">
                                <strong>Type :</strong> {chassisItem.type}
                            </div>
                            <div className="mt-2">
                                <strong>Form Factor :</strong> {chassisItem.form_factor}
                            </div>
                            {/* Affichage du matériau */}
                            <div className="mt-2">
                                <strong>Matériau :</strong> {chassisItem.material}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/chassis/${chassisItem.id}/edit`} className="text-green-600">✏ Modifier</Link>
                            <button 
                                onClick={() => handleDelete(chassisItem.id)} 
                                className="text-red-600"
                            >
                                🗑 Supprimer
                            </button>
                            <Link href={`/chassis/${chassisItem.id}`} className="text-blue-600">
                                show
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </AuthenticatedLayout>
    );
}
