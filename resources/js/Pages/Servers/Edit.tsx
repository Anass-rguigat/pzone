import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

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
}

const Edit: React.FC<Props> = ({
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
}) => {
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
    console.log(data)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('servers.update', server.id));
    };


    const [selectedImage, setSelectedImage] = useState<string | null>(
            server.image?.url ? `/storage/${server.image.url}` : null
        );
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            // Image preview
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour éviter d'itérer sur des undefined
    const safeMap = (data: any[] | undefined, callback: Function) => {
        if (Array.isArray(data)) {
            return data.map(callback);
        }
        return [];
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
                <label className="block font-medium">Nom du serveur</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Marque</label>
                <select
                    value={data.brand_id}
                    onChange={(e) => setData('brand_id', Number(e.target.value))}
                    className="w-full border p-2 rounded"
                >
                    <option value={0}>Sélectionner une marque</option>
                    {brands?.map((brand: Brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block font-medium">Prix</label>
                <input
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', Number(e.target.value))}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Modèle</label>
                <input
                    type="text"
                    value={data.model}
                    onChange={(e) => setData('model', e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* Sélection des composants avec la fonction safeMap */}
            {[ 
                { label: 'RAM', name: 'ram_ids', options: rams, selected: data.ram_ids },
                { label: 'Disques durs', name: 'hard_drive_ids', options: hardDrives, selected: data.hard_drive_ids },
                { label: 'Processeurs', name: 'processor_ids', options: processors, selected: data.processor_ids },
                { label: 'Alimentations', name: 'power_supply_ids', options: powerSupplies, selected: data.power_supply_ids },
                { label: 'Cartes mères', name: 'motherboard_ids', options: motherboards, selected: data.motherboard_ids },
                { label: 'Cartes réseau', name: 'network_card_ids', options: networkCards, selected: data.network_card_ids },
                { label: 'Contrôleurs RAID', name: 'raid_controller_ids', options: raidControllers, selected: data.raid_controller_ids },
                { label: 'Solutions de refroidissement', name: 'cooling_solution_ids', options: coolingSolutions, selected: data.cooling_solution_ids },
                { label: 'Châssis', name: 'chassis_ids', options: chassis, selected: data.chassis_ids },
                { label: 'Cartes graphiques', name: 'graphic_card_ids', options: graphicCards, selected: data.graphic_card_ids },
                { label: 'Cartes optiques à fibre', name: 'fiber_optic_card_ids', options: fiberOpticCards, selected: data.fiber_optic_card_ids },
                { label: 'Cartes d\'extension', name: 'expansion_card_ids', options: expansionCards, selected: data.expansion_card_ids },
            ].map(({ label, name, options, selected }) => (
                <div key={name}>
                    <label className="block font-medium">{label}</label>
                    <select
                        multiple
                        value={selected}
                        onChange={(e) => {
                            const selectedValues = Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                            );
                            setData(name, selectedValues);
                        }}
                        className="w-full border p-2 rounded"
                    >
                        {options?.map((option: { id: number; name: string }) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

<div className="mt-4">
                    <label htmlFor="image" className="block font-medium">Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {selectedImage && (
                        <div className="mt-2">
                            <img src={selectedImage} alt="Prévisualisation" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                    {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                </div>

            <div>
                <label className="block font-medium">Socket CPU</label>
                <input
                    type="text"
                    value={data.cpu_socket}
                    onChange={(e) => setData('cpu_socket', e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Slots RAM</label>
                <input
                    type="number"
                    value={data.ram_slots}
                    onChange={(e) => setData('ram_slots', Number(e.target.value))}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Slots de stockage</label>
                <input
                    type="number"
                    value={data.storage_slots}
                    onChange={(e) => setData('storage_slots', Number(e.target.value))}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Type d'alimentation</label>
                <input
                    type="text"
                    value={data.power_supply_type}
                    onChange={(e) => setData('power_supply_type', e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Montage en rack</label>
                <input
                    type="checkbox"
                    checked={data.rack_mountable}
                    onChange={(e) => setData('rack_mountable', e.target.checked)}
                    className="border p-2"
                />
            </div>

            <div>
                <label className="block font-medium">Facteur de forme</label>
                <input
                    type="text"
                    value={data.form_factor}
                    onChange={(e) => setData('form_factor', e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
                Mettre à jour
            </button>
        </form>
    );
};

export default Edit;
