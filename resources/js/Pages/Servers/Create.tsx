import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '@/Layouts/layout';

interface Brand {
    id: number;
    name: string;
}

interface Ram {
    id: number;
    name: string;
}

interface Component {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    rams: Ram[];
    hardDrives: Component[];
    processors: Component[];
    powerSupplies: Component[];
    motherboards: Component[];
    networkCards: Component[];
    raidControllers: Component[];
    coolingSolutions: Component[];
    chassis: Component[];
    graphicCards: Component[];
    fiberOpticCards: Component[];
    expansionCards: Component[];
    cableConnectors?: Component[];
    batteries?: Component[];
}

export default function Create({
    brands,
    rams,
    hardDrives,
    processors,
    powerSupplies,
    motherboards,
    networkCards,
    raidControllers,
    coolingSolutions,
    chassis,
    graphicCards,
    fiberOpticCards,
    expansionCards,
    cableConnectors = [],
    batteries = [],
}: Props) {
    const { data, setData, post, progress, errors, processing } = useForm({
        name: '',
        brand_id: 0,
        model: '',
        cpu_socket: '',
        ram_slots: 0,
        storage_slots: 0,
        power_supply_type: '',
        rack_mountable: false,
        form_factor: '',
        ram_ids: [] as number[],
        price: '',
        image: null as File | null,
        hard_drive_ids: [] as number[],
        processor_ids: [] as number[],
        power_supply_ids: [] as number[],
        motherboard_ids: [] as number[],
        network_card_ids: [] as number[],
        raid_controller_ids: [] as number[],
        cooling_solution_ids: [] as number[],
        chassis_ids: [] as number[],
        graphic_card_ids: [] as number[],
        fiber_optic_card_ids: [] as number[],
        expansion_card_ids: [] as number[],
        cable_ids: [] as number[],
        battery_ids: [] as number[],
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/servers');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ajouter un Serveur
                </h2>
            }
        >
            <div className="px-4 py-6 sm:px-6">
                <h1 className="text-2xl font-semibold mb-6">Ajouter un Nouveau Serveur</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom du Serveur
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                                Modèle
                            </label>
                            <input
                                type="text"
                                id="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="cpu_socket" className="block text-sm font-medium text-gray-700">
                                Socket CPU
                            </label>
                            <input
                                type="text"
                                id="cpu_socket"
                                value={data.cpu_socket}
                                onChange={(e) => setData('cpu_socket', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.cpu_socket && <p className="text-red-600 text-sm mt-1">{errors.cpu_socket}</p>}
                        </div>

                        <div>
                            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">
                                Marque
                            </label>
                            <select
                                id="brand_id"
                                value={data.brand_id}
                                onChange={(e) => setData('brand_id', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value={0}>Sélectionner une marque</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand_id && <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <label htmlFor="ram_slots" className="block text-sm font-medium text-gray-700">
                                Slots RAM
                            </label>
                            <input
                                type="number"
                                id="ram_slots"
                                value={data.ram_slots}
                                onChange={(e) => setData('ram_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.ram_slots && <p className="text-red-600 text-sm mt-1">{errors.ram_slots}</p>}
                        </div>

                        <div>
                            <label htmlFor="storage_slots" className="block text-sm font-medium text-gray-700">
                                Slots Stockage
                            </label>
                            <input
                                type="number"
                                id="storage_slots"
                                value={data.storage_slots}
                                onChange={(e) => setData('storage_slots', Number(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.storage_slots && <p className="text-red-600 text-sm mt-1">{errors.storage_slots}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Prix (€)
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                step="0.01"
                            />
                            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="power_supply_type" className="block text-sm font-medium text-gray-700">
                                Type Alimentation
                            </label>
                            <input
                                type="text"
                                id="power_supply_type"
                                value={data.power_supply_type}
                                onChange={(e) => setData('power_supply_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.power_supply_type && <p className="text-red-600 text-sm mt-1">{errors.power_supply_type}</p>}
                        </div>

                        <div>
                            <label htmlFor="form_factor" className="block text-sm font-medium text-gray-700">
                                Format
                            </label>
                            <input
                                type="text"
                                id="form_factor"
                                value={data.form_factor}
                                onChange={(e) => setData('form_factor', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.form_factor && <p className="text-red-600 text-sm mt-1">{errors.form_factor}</p>}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={data.rack_mountable}
                                onChange={(e) => setData('rack_mountable', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">Rack Mountable</span>
                        </label>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="ram_ids" className="block text-sm font-medium text-gray-700">
                                    RAMs
                                </label>
                                <select
                                    multiple
                                    id="ram_ids"
                                    value={data.ram_ids}
                                    onChange={(e) => setData('ram_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {rams.map((ram) => (
                                        <option key={ram.id} value={ram.id}>{ram.name}</option>
                                    ))}
                                </select>
                                {errors.ram_ids && <p className="text-red-600 text-sm mt-1">{errors.ram_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="hard_drive_ids" className="block text-sm font-medium text-gray-700">
                                    Disques Durs
                                </label>
                                <select
                                    multiple
                                    id="hard_drive_ids"
                                    value={data.hard_drive_ids}
                                    onChange={(e) => setData('hard_drive_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {hardDrives.map((drive) => (
                                        <option key={drive.id} value={drive.id}>{drive.name}</option>
                                    ))}
                                </select>
                                {errors.hard_drive_ids && <p className="text-red-600 text-sm mt-1">{errors.hard_drive_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="processor_ids" className="block text-sm font-medium text-gray-700">
                                    Processeurs
                                </label>
                                <select
                                    multiple
                                    id="processor_ids"
                                    value={data.processor_ids}
                                    onChange={(e) => setData('processor_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {processors.map((processor) => (
                                        <option key={processor.id} value={processor.id}>{processor.name}</option>
                                    ))}
                                </select>
                                {errors.processor_ids && <p className="text-red-600 text-sm mt-1">{errors.processor_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="power_supply_ids" className="block text-sm font-medium text-gray-700">
                                    Alimentations
                                </label>
                                <select
                                    multiple
                                    id="power_supply_ids"
                                    value={data.power_supply_ids}
                                    onChange={(e) => setData('power_supply_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {powerSupplies.map((power) => (
                                        <option key={power.id} value={power.id}>{power.name}</option>
                                    ))}
                                </select>
                                {errors.power_supply_ids && <p className="text-red-600 text-sm mt-1">{errors.power_supply_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="motherboard_ids" className="block text-sm font-medium text-gray-700">
                                    Cartes Mères
                                </label>
                                <select
                                    multiple
                                    id="motherboard_ids"
                                    value={data.motherboard_ids}
                                    onChange={(e) => setData('motherboard_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {motherboards.map((board) => (
                                        <option key={board.id} value={board.id}>{board.name}</option>
                                    ))}
                                </select>
                                {errors.motherboard_ids && <p className="text-red-600 text-sm mt-1">{errors.motherboard_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="network_card_ids" className="block text-sm font-medium text-gray-700">
                                    Cartes Réseau
                                </label>
                                <select
                                    multiple
                                    id="network_card_ids"
                                    value={data.network_card_ids}
                                    onChange={(e) => setData('network_card_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {networkCards.map((card) => (
                                        <option key={card.id} value={card.id}>{card.name}</option>
                                    ))}
                                </select>
                                {errors.network_card_ids && <p className="text-red-600 text-sm mt-1">{errors.network_card_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="raid_controller_ids" className="block text-sm font-medium text-gray-700">
                                    Contrôleurs RAID
                                </label>
                                <select
                                    multiple
                                    id="raid_controller_ids"
                                    value={data.raid_controller_ids}
                                    onChange={(e) => setData('raid_controller_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {raidControllers.map((raid) => (
                                        <option key={raid.id} value={raid.id}>{raid.name}</option>
                                    ))}
                                </select>
                                {errors.raid_controller_ids && <p className="text-red-600 text-sm mt-1">{errors.raid_controller_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="cooling_solution_ids" className="block text-sm font-medium text-gray-700">
                                    Solutions de Refroidissement
                                </label>
                                <select
                                    multiple
                                    id="cooling_solution_ids"
                                    value={data.cooling_solution_ids}
                                    onChange={(e) => setData('cooling_solution_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {coolingSolutions.map((cooling) => (
                                        <option key={cooling.id} value={cooling.id}>{cooling.name}</option>
                                    ))}
                                </select>
                                {errors.cooling_solution_ids && <p className="text-red-600 text-sm mt-1">{errors.cooling_solution_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="chassis_ids" className="block text-sm font-medium text-gray-700">
                                    Châssis
                                </label>
                                <select
                                    multiple
                                    id="chassis_ids"
                                    value={data.chassis_ids}
                                    onChange={(e) => setData('chassis_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {chassis.map((chass) => (
                                        <option key={chass.id} value={chass.id}>{chass.name}</option>
                                    ))}
                                </select>
                                {errors.chassis_ids && <p className="text-red-600 text-sm mt-1">{errors.chassis_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="graphic_card_ids" className="block text-sm font-medium text-gray-700">
                                    Cartes Graphiques
                                </label>
                                <select
                                    multiple
                                    id="graphic_card_ids"
                                    value={data.graphic_card_ids}
                                    onChange={(e) => setData('graphic_card_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {graphicCards.map((gpu) => (
                                        <option key={gpu.id} value={gpu.id}>{gpu.name}</option>
                                    ))}
                                </select>
                                {errors.graphic_card_ids && <p className="text-red-600 text-sm mt-1">{errors.graphic_card_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="fiber_optic_card_ids" className="block text-sm font-medium text-gray-700">
                                    Cartes Fibre Optique
                                </label>
                                <select
                                    multiple
                                    id="fiber_optic_card_ids"
                                    value={data.fiber_optic_card_ids}
                                    onChange={(e) => setData('fiber_optic_card_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {fiberOpticCards.map((fiber) => (
                                        <option key={fiber.id} value={fiber.id}>{fiber.name}</option>
                                    ))}
                                </select>
                                {errors.fiber_optic_card_ids && <p className="text-red-600 text-sm mt-1">{errors.fiber_optic_card_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="expansion_card_ids" className="block text-sm font-medium text-gray-700">
                                    Cartes d'Expansion
                                </label>
                                <select
                                    multiple
                                    id="expansion_card_ids"
                                    value={data.expansion_card_ids}
                                    onChange={(e) => setData('expansion_card_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {expansionCards.map((expansion) => (
                                        <option key={expansion.id} value={expansion.id}>{expansion.name}</option>
                                    ))}
                                </select>
                                {errors.expansion_card_ids && <p className="text-red-600 text-sm mt-1">{errors.expansion_card_ids}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="cable_ids" className="block text-sm font-medium text-gray-700">
                                    Câbles
                                </label>
                                <select
                                    multiple
                                    id="cable_ids"
                                    value={data.cable_ids}
                                    onChange={(e) => setData('cable_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {cableConnectors.map((cable) => (
                                        <option key={cable.id} value={cable.id}>{cable.name}</option>
                                    ))}
                                </select>
                                {errors.cable_ids && <p className="text-red-600 text-sm mt-1">{errors.cable_ids}</p>}
                            </div>

                            <div>
                                <label htmlFor="battery_ids" className="block text-sm font-medium text-gray-700">
                                    Batteries
                                </label>
                                <select
                                    multiple
                                    id="battery_ids"
                                    value={data.battery_ids}
                                    onChange={(e) => setData('battery_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {batteries.map((battery) => (
                                        <option key={battery.id} value={battery.id}>{battery.name}</option>
                                    ))}
                                </select>
                                {errors.battery_ids && <p className="text-red-600 text-sm mt-1">{errors.battery_ids}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        <div className="mt-1 flex items-center">
                            <label htmlFor="image" className="flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500">
                                Choisir un fichier
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {data.image && <p className="ml-2 text-sm text-gray-500">{data.image.name}</p>}
                            {previewImage && (
                                <div className="ml-4">
                                    <img src={previewImage} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4 ">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                            disabled={processing}
                        >
                            {processing ? 'Enregistrement...' : 'Créer le Serveur'}
                        </button>
                        <Link
                            href="/servers"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}