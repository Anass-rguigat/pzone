import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
    expansionCards
}: Props) {
    const { data, setData, post, progress, errors } = useForm({
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Serveur
                </h2>
            }
        >
            <h1 className="text-2xl font-bold mb-4">Ajouter un Serveur</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Server Name */}
                <div>
                    <label className="block font-medium">Nom du Serveur</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>

                {/* Server Model */}
                <div>
                    <label className="block font-medium">Modèle du Serveur</label>
                    <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.model && <div className="text-red-600 text-sm">{errors.model}</div>}
                </div>

                {/* CPU Socket */}
                <div>
                    <label className="block font-medium">Socket CPU</label>
                    <input
                        type="text"
                        value={data.cpu_socket}
                        onChange={(e) => setData('cpu_socket', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.cpu_socket && <div className="text-red-600 text-sm">{errors.cpu_socket}</div>}
                </div>

                {/* RAM Slots */}
                <div>
                    <label className="block font-medium">Slots RAM</label>
                    <input
                        type="number"
                        value={data.ram_slots}
                        onChange={(e) => setData('ram_slots', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.ram_slots && <div className="text-red-600 text-sm">{errors.ram_slots}</div>}
                </div>

                {/* Storage Slots */}
                <div>
                    <label className="block font-medium">Slots de stockage</label>
                    <input
                        type="number"
                        value={data.storage_slots}
                        onChange={(e) => setData('storage_slots', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.storage_slots && <div className="text-red-600 text-sm">{errors.storage_slots}</div>}
                </div>

                {/* Power Supply Type */}
                <div>
                    <label className="block font-medium">Type d'alimentation</label>
                    <input
                        type="text"
                        value={data.power_supply_type}
                        onChange={(e) => setData('power_supply_type', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.power_supply_type && <div className="text-red-600 text-sm">{errors.power_supply_type}</div>}
                </div>

                {/* Rack Mountable */}
                <div>
                    <label className="block font-medium">Rack Mountable</label>
                    <input
                        type="checkbox"
                        checked={data.rack_mountable}
                        onChange={(e) => setData('rack_mountable', e.target.checked)}
                        className="w-4 h-4"
                    />
                    {errors.rack_mountable && <div className="text-red-600 text-sm">{errors.rack_mountable}</div>}
                </div>

                {/* Form Factor */}
                <div>
                    <label className="block font-medium">Form Factor</label>
                    <input
                        type="text"
                        value={data.form_factor}
                        onChange={(e) => setData('form_factor', e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    {errors.form_factor && <div className="text-red-600 text-sm">{errors.form_factor}</div>}
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium">Prix du Serveur</label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                        step="0.01"
                    />
                    {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
                </div>

                {/* Brand Selection */}
                <div>
                    <label className="block font-medium">Marque</label>
                    <select
                        value={data.brand_id ?? 0}
                        onChange={(e) => setData('brand_id', Number(e.target.value))}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value={0}>Sélectionner une marque</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand_id && <div className="text-red-600 text-sm">{errors.brand_id}</div>}
                </div>

                {/* RAM Selection */}
                <div>
                    <label className="block font-medium">RAMs associées</label>
                    <select
                        multiple
                        value={data.ram_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('ram_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {rams.map((ram) => (
                            <option key={ram.id} value={ram.id}>
                                {ram.name}
                            </option>
                        ))}
                    </select>
                    {errors.ram_ids && <div className="text-red-600 text-sm">{errors.ram_ids}</div>}
                </div>

                {/* Component (Hard Drives) */}
                <div>
                    <label className="block font-medium">Disques Durs Associés</label>
                    <select
                        multiple
                        value={data.hard_drive_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('hard_drive_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {hardDrives.map((hardDrive) => (
                            <option key={hardDrive.id} value={hardDrive.id}>
                                {hardDrive.name}
                            </option>
                        ))}
                    </select>
                    {errors.hard_drive_ids && <div className="text-red-600 text-sm">{errors.hard_drive_ids}</div>}
                </div>

                {/* Component (Processors) */}
                <div>
                    <label className="block font-medium">Processors Associés</label>
                    <select
                        multiple
                        value={data.processor_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('processor_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {processors.map((processor) => (
                            <option key={processor.id} value={processor.id}>
                                {processor.name}
                            </option>
                        ))}
                    </select>
                    {errors.processor_ids && <div className="text-red-600 text-sm">{errors.processor_ids}</div>}
                </div>
                                {/* Power Supplies Selection */}
                                <div>
                    <label className="block font-medium">Alimentations Associées</label>
                    <select
                        multiple
                        value={data.power_supply_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('power_supply_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {powerSupplies.map((powerSupply) => (
                            <option key={powerSupply.id} value={powerSupply.id}>
                                {powerSupply.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Motherboards Selection */}
                <div>
                    <label className="block font-medium">Cartes Mères Associées</label>
                    <select
                        multiple
                        value={data.motherboard_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('motherboard_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {motherboards.map((motherboard) => (
                            <option key={motherboard.id} value={motherboard.id}>
                                {motherboard.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Network Cards Selection */}
                <div>
                    <label className="block font-medium">Cartes Réseau Associées</label>
                    <select
                        multiple
                        value={data.network_card_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('network_card_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {networkCards.map((networkCard) => (
                            <option key={networkCard.id} value={networkCard.id}>
                                {networkCard.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* RAID Controllers Selection */}
                <div>
                    <label className="block font-medium">Contrôleurs RAID Associés</label>
                    <select
                        multiple
                        value={data.raid_controller_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('raid_controller_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {raidControllers.map((raidController) => (
                            <option key={raidController.id} value={raidController.id}>
                                {raidController.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cooling Solutions Selection */}
                <div>
                    <label className="block font-medium">Solutions de Refroidissement Associées</label>
                    <select
                        multiple
                        value={data.cooling_solution_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('cooling_solution_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {coolingSolutions.map((coolingSolution) => (
                            <option key={coolingSolution.id} value={coolingSolution.id}>
                                {coolingSolution.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chassis Selection */}
                <div>
                    <label className="block font-medium">Châssis Associés</label>
                    <select
                        multiple
                        value={data.chassis_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('chassis_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {chassis.map((chass) => (
                            <option key={chass.id} value={chass.id}>
                                {chass.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Graphic Cards Selection */}
                <div>
                    <label className="block font-medium">Cartes Graphiques Associées</label>
                    <select
                        multiple
                        value={data.graphic_card_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('graphic_card_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {graphicCards.map((graphicCard) => (
                            <option key={graphicCard.id} value={graphicCard.id}>
                                {graphicCard.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fiber Optic Cards Selection */}
                <div>
                    <label className="block font-medium">Cartes Fibre Optique Associées</label>
                    <select
                        multiple
                        value={data.fiber_optic_card_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('fiber_optic_card_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {fiberOpticCards.map((fiberOpticCard) => (
                            <option key={fiberOpticCard.id} value={fiberOpticCard.id}>
                                {fiberOpticCard.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Expansion Cards Selection */}
                <div>
                    <label className="block font-medium">Cartes d'Expansion Associées</label>
                    <select
                        multiple
                        value={data.expansion_card_ids}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                            setData('expansion_card_ids', selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {expansionCards.map((expansionCard) => (
                            <option key={expansionCard.id} value={expansionCard.id}>
                                {expansionCard.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload (Preview) */}
                <div>
                    <label className="block font-medium">Image du Serveur</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                    {previewImage && (
                        <div className="mt-2">
                            <img src={previewImage} alt="Prévisualisation" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                </div>

                {/* Upload Progress Bar */}
                {progress && (
                    <div className="w-full bg-gray-200 rounded">
                        <div className="bg-blue-500 text-xs leading-none py-1 text-center text-white" style={{ width: `${progress.percentage}%` }}>
                            {progress.percentage}%
                        </div>
                    </div>
                )}

                {/* Submit and Cancel Buttons */}
                <div className="flex space-x-4">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        Ajouter Serveur
                    </button>
                    <Link href="/servers" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

