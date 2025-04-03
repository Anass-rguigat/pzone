import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '@/Layouts/Layout';

interface Brand { id: number; name: string; }
interface Ram { id: number; name: string; }
interface HardDrive { id: number; name: string; }
interface Processor { id: number; name: string; }
interface PowerSupply { id: number; name: string; }
interface Motherboard { id: number; name: string; }
interface NetworkCard { id: number; name: string; }
interface RaidController { id: number; name: string; }
interface CoolingSolution { id: number; name: string; }
interface Chassis { id: number; name: string; }
interface GraphicCard { id: number; name: string; }
interface FiberOpticCard { id: number; name: string; }
interface ExpansionCard { id: number; name: string; }
interface CableConnector { id: number; name: string; }
interface Battery { id: number; name: string; }

interface Server {
    id: number;
    name: string;
    price: number;
    model: string;
    brand?: Brand;
    rams: Ram[];
    hard_drives: HardDrive[];
    processors: Processor[];
    power_supplies: PowerSupply[];
    motherboards: Motherboard[];
    network_cards: NetworkCard[];
    raid_controllers: RaidController[];
    cooling_solutions: CoolingSolution[];
    chassis: Chassis[];
    graphic_cards: GraphicCard[];
    fiber_optic_cards: FiberOpticCard[];
    expansion_cards: ExpansionCard[];
    cable_connectors: CableConnector[];
    batteries: Battery[];
    image: { url: string } | null;
    cpu_socket: string;
    ram_slots: number;
    storage_slots: number;
    power_supply_type: string;
    rack_mountable: boolean;
    form_factor: string;
}

interface Props {
    server: Server;
    brands: Brand[];
    rams: Ram[];
    hardDrives: HardDrive[];
    processors: Processor[];
    powerSupplies: PowerSupply[];
    motherboards: Motherboard[];
    networkCards: NetworkCard[];
    raidControllers: RaidController[];
    coolingSolutions: CoolingSolution[];
    chassis: Chassis[];
    graphicCards: GraphicCard[];
    fiberOpticCards: FiberOpticCard[];
    expansionCards: ExpansionCard[];
    cable_connectors: CableConnector[];
    batteries: Battery[];
}

export default function Edit({
    server,
    brands = [],
    rams = [],
    hardDrives = [],
    processors = [],
    powerSupplies = [],
    motherboards = [],
    networkCards = [],
    raidControllers = [],
    coolingSolutions = [],
    chassis = [],
    graphicCards = [],
    fiberOpticCards = [],
    expansionCards = [],
    cable_connectors = [],
    batteries = [],
}: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: server.name,
        price: server.price,
        brand_id: server.brand?.id ?? 0,
        ram_ids: server.rams?.map((ram) => ram.id) || [],
        hard_drive_ids: server.hard_drives?.map((hardDrive) => hardDrive.id) || [],
        processor_ids: server.processors?.map((processor) => processor.id) || [],
        power_supply_ids: server.power_supplies?.map((powerSupply) => powerSupply.id) || [],
        motherboard_ids: server.motherboards?.map((motherboard) => motherboard.id) || [],
        network_card_ids: server.network_cards?.map((networkCard) => networkCard.id) || [],
        raid_controller_ids: server.raid_controllers?.map((raidController) => raidController.id) || [],
        cooling_solution_ids: server.cooling_solutions?.map((coolingSolution) => coolingSolution.id) || [],
        chassis_ids: server.chassis?.map((chassis) => chassis.id) || [],
        graphic_card_ids: server.graphic_cards?.map((graphicCard) => graphicCard.id) || [],
        fiber_optic_card_ids: server.fiber_optic_cards?.map((fiberOpticCard) => fiberOpticCard.id) || [],
        expansion_card_ids: server.expansion_cards?.map((expansionCard) => expansionCard.id) || [],
        cable_connector_ids: server.cable_connectors?.map((cable) => cable.id) || [],
        battery_ids: server.batteries?.map((battery) => battery.id) || [],
        image: null as File | null,
        model: server.model,
        cpu_socket: server.cpu_socket,
        ram_slots: server.ram_slots,
        storage_slots: server.storage_slots,
        power_supply_type: server.power_supply_type,
        rack_mountable: server.rack_mountable,
        form_factor: server.form_factor,
        _method: 'PUT',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(
        server.image?.url ? `/storage/${server.image.url}` : null
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === '_method') return;
            if (Array.isArray(value)) {
                value.forEach(v => formData.append(`${key}[]`, v.toString()));
            } else if (value !== null) {
                formData.append(key, value.toString());
            }
        });

        post(`/servers/${server.id}`, {
            data: formData,
            onSuccess: () => setSelectedImage(null),
        });
    };

    const componentGroups = [
        { label: 'RAM', name: 'ram_ids', options: rams },
        { label: 'Disques durs', name: 'hard_drive_ids', options: hardDrives },
        { label: 'Processeurs', name: 'processor_ids', options: processors },
        { label: 'Alimentations', name: 'power_supply_ids', options: powerSupplies },
        { label: 'Cartes mères', name: 'motherboard_ids', options: motherboards },
        { label: 'Cartes réseau', name: 'network_card_ids', options: networkCards },
        { label: 'Contrôleurs RAID', name: 'raid_controller_ids', options: raidControllers },
        { label: 'Refroidissement', name: 'cooling_solution_ids', options: coolingSolutions },
        { label: 'Châssis', name: 'chassis_ids', options: chassis },
        { label: 'Cartes graphiques', name: 'graphic_card_ids', options: graphicCards },
        { label: 'Cartes fibre optique', name: 'fiber_optic_card_ids', options: fiberOpticCards },
        { label: "Cartes d'extension", name: 'expansion_card_ids', options: expansionCards },
        { label: 'Câbles', name: 'cable_connector_ids', options: cable_connectors },
        { label: 'Batteries', name: 'battery_ids', options: batteries },
    ];

    return (
        <Layout>
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Modifier le Serveur</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom du serveur</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Marque</label>
                            <select
                                value={data.brand_id}
                                onChange={(e) => setData('brand_id', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value={0}>Sélectionner une marque</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                            {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prix</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Modèle</label>
                            <input
                                type="text"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.model && <p className="text-red-600 text-sm">{errors.model}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {componentGroups.map(({ label, name, options }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <select
                                    multiple
                                    value={(data as any)[name]}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                                        setData(name as any, selected);
                                    }}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-32"
                                >
                                    {options.map((option: { id: number; name: string }) => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Socket CPU</label>
                            <input
                                type="text"
                                value={data.cpu_socket}
                                onChange={(e) => setData('cpu_socket', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.cpu_socket && <p className="text-red-600 text-sm">{errors.cpu_socket}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slots RAM</label>
                            <input
                                type="number"
                                value={data.ram_slots}
                                onChange={(e) => setData('ram_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.ram_slots && <p className="text-red-600 text-sm">{errors.ram_slots}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slots stockage</label>
                            <input
                                type="number"
                                value={data.storage_slots}
                                onChange={(e) => setData('storage_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.storage_slots && <p className="text-red-600 text-sm">{errors.storage_slots}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type alimentation</label>
                            <input
                                type="text"
                                value={data.power_supply_type}
                                onChange={(e) => setData('power_supply_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.power_supply_type && <p className="text-red-600 text-sm">{errors.power_supply_type}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Facteur de forme</label>
                            <input
                                type="text"
                                value={data.form_factor}
                                onChange={(e) => setData('form_factor', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.form_factor && <p className="text-red-600 text-sm">{errors.form_factor}</p>}
                        </div>

                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                checked={data.rack_mountable}
                                onChange={(e) => setData('rack_mountable', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Montage en rack</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex items-center">
                            <label className="flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-indigo-700">
                                Choisir un fichier
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {selectedImage && (
                                <div className="ml-2">
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Mettre à jour
                        </button>
                        <Link
                            href="/servers"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Retour
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}