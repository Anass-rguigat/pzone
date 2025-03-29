import { Link } from '@inertiajs/react';

interface Brand {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Ram {
    id: number;
    name: string;
}

interface HardDrive {
    id: number;
    name: string;
    capacity: string;
}

interface Processor {
    id: number;
    name: string;
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: number;
    boost_clock: number;
    socket: string;
    thermal_design_power: number;
}

interface PowerSupply {
    id: number;
    name: string;
    wattage: string;
}

interface Motherboard {
    id: number;
    name: string;
}

interface NetworkCard {
    id: number;
    name: string;
}

interface RaidController {
    id: number;
    name: string;
}

interface CoolingSolution {
    id: number;
    name: string;
}

interface Chassis {
    id: number;
    name: string;
}

interface GraphicCard {
    id: number;
    name: string;
}

interface FiberOpticCard {
    id: number;
    name: string;
}

interface ExpansionCard {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
    price: string;
    brand: Brand;
    model: string;
    cpu_socket: string;
    ram_slots: number;
    storage_slots: number;
    power_supply_type: string;
    rack_mountable: boolean;
    form_factor: string;
    image: Image;
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
}

interface Props {
    server: Server;
}

export default function Show({ server }: Props) {
    return (
        <div>
            <h1>Détails du Serveur</h1>
            <div className="mt-4">
                <strong>Nom:</strong> {server.name}
            </div>
            <div className="mt-2">
                <strong>Marque:</strong> {server.brand.name}
            </div>
            <div className="mt-2">
                <strong>Modèle:</strong> {server.model}
            </div>
            <div className="mt-2">
                <strong>Prix:</strong> {server.price} €
            </div>
            <div className="mt-2">
                <strong>CPU Socket:</strong> {server.cpu_socket}
            </div>
            <div className="mt-2">
                <strong>Nombre de slots RAM:</strong> {server.ram_slots}
            </div>
            <div className="mt-2">
                <strong>Nombre de slots de stockage:</strong> {server.storage_slots}
            </div>
            <div className="mt-2">
                <strong>Type d'alimentation:</strong> {server.power_supply_type}
            </div>
            <div className="mt-2">
                <strong>Montable en rack:</strong> {server.rack_mountable ? 'Oui' : 'Non'}
            </div>
            <div className="mt-2">
                <strong>Form Factor:</strong> {server.form_factor}
            </div>

            {server.image && (
                <div className="mt-2">
                    <strong>Image:</strong>
                    <img
                        src={`/storage/${server.image.url}`}
                        alt={server.name}
                        width="200"
                    />
                </div>
            )}

            {server.rams.length > 0 && (
                <div className="mt-2">
                    <strong>RAM:</strong>
                    <ul className="ml-4 list-disc">
                        {server.rams.map((ram) => (
                            <li key={ram.id}>{ram.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.hard_drives.length > 0 && (
                <div className="mt-2">
                    <strong>Disques durs:</strong>
                    <ul className="ml-4 list-disc">
                        {server.hard_drives.map((disk) => (
                            <li key={disk.id}>{disk.name} - {disk.capacity} Go</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.processors.length > 0 && (
                <div className="mt-2">
                    <strong>Processeurs:</strong>
                    <ul className="ml-4 list-disc">
                        {server.processors.map((processor) => (
                            <li key={processor.id}>
                                {processor.name} ({processor.model}) - {processor.core_count} cores, {processor.thread_count} threads
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {server.power_supplies.length > 0 && (
                <div className="mt-2">
                    <strong>Alimentations:</strong>
                    <ul className="ml-4 list-disc">
                        {server.power_supplies.map((powerSupply) => (
                            <li key={powerSupply.id}>{powerSupply.name} - {powerSupply.wattage} W</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.motherboards.length > 0 && (
                <div className="mt-2">
                    <strong>Cartes mères:</strong>
                    <ul className="ml-4 list-disc">
                        {server.motherboards.map((motherboard) => (
                            <li key={motherboard.id}>{motherboard.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.network_cards.length > 0 && (
                <div className="mt-2">
                    <strong>Cartes réseau:</strong>
                    <ul className="ml-4 list-disc">
                        {server.network_cards.map((networkCard) => (
                            <li key={networkCard.id}>{networkCard.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.raid_controllers.length > 0 && (
                <div className="mt-2">
                    <strong>Contrôleurs RAID:</strong>
                    <ul className="ml-4 list-disc">
                        {server.raid_controllers.map((raidController) => (
                            <li key={raidController.id}>{raidController.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.cooling_solutions.length > 0 && (
                <div className="mt-2">
                    <strong>Systèmes de refroidissement:</strong>
                    <ul className="ml-4 list-disc">
                        {server.cooling_solutions.map((coolingSolution) => (
                            <li key={coolingSolution.id}>{coolingSolution.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.chassis.length > 0 && (
                <div className="mt-2">
                    <strong>Châssis:</strong>
                    <ul className="ml-4 list-disc">
                        {server.chassis.map((chassis) => (
                            <li key={chassis.id}>{chassis.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.graphic_cards.length > 0 && (
                <div className="mt-2">
                    <strong>Cartes graphiques:</strong>
                    <ul className="ml-4 list-disc">
                        {server.graphic_cards.map((graphicCard) => (
                            <li key={graphicCard.id}>{graphicCard.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.fiber_optic_cards.length > 0 && (
                <div className="mt-2">
                    <strong>Cartes fibre optique:</strong>
                    <ul className="ml-4 list-disc">
                        {server.fiber_optic_cards.map((fiberOpticCard) => (
                            <li key={fiberOpticCard.id}>{fiberOpticCard.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {server.expansion_cards.length > 0 && (
                <div className="mt-2">
                    <strong>Cartes d'expansion:</strong>
                    <ul className="ml-4 list-disc">
                        {server.expansion_cards.map((expansionCard) => (
                            <li key={expansionCard.id}>{expansionCard.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4">
                <Link href="/servers" className="btn btn-secondary">Retour à la liste des serveurs</Link>
            </div>
        </div>
    );
}
