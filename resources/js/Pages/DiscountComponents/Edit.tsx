import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

const EditDiscount = ({
    discount,
    rams,
    hard_drives,
    processors,
    power_supplies,
    motherboards,
    network_cards,
    raid_controllers,
    cooling_solutions,
    chassis,
    graphic_cards,
    fiber_optic_cards,
    expansion_cards
}: any) => {
    const [formData, setFormData] = useState({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        selectedComponents: {
            rams: discount.rams ? discount.rams.map((ram: any) => ram.id) : [],
            hard_drives: discount.hardDrives ? discount.hardDrives.map((hardDrive: any) => hardDrive.id) : [],
            processors: discount.processors ? discount.processors.map((processor: any) => processor.id) : [],
            power_supplies: discount.powerSupplies ? discount.powerSupplies.map((powerSupply: any) => powerSupply.id) : [],
            motherboards: discount.motherboards ? discount.motherboards.map((motherboard: any) => motherboard.id) : [],
            network_cards: discount.networkCards ? discount.networkCards.map((networkCard: any) => networkCard.id) : [],
            raid_controllers: discount.raidControllers ? discount.raidControllers.map((raidController: any) => raidController.id) : [],
            cooling_solutions: discount.coolingSolutions ? discount.coolingSolutions.map((coolingSolution: any) => coolingSolution.id) : [],
            chassis: discount.chassis ? discount.chassis.map((chassis: any) => chassis.id) : [],
            graphic_cards: discount.graphicCards ? discount.graphicCards.map((graphicCard: any) => graphicCard.id) : [],
            fiber_optic_cards: discount.fiberOpticCards ? discount.fiberOpticCards.map((fiberOpticCard: any) => fiberOpticCard.id) : [],
            expansion_cards: discount.expansionCards ? discount.expansionCards.map((expansionCard: any) => expansionCard.id) : [],
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>, componentType: string) => {
        const { value, checked } = e.target;
        const updatedComponents = { ...formData.selectedComponents };
        const componentList = updatedComponents[componentType];

        if (checked) {
            componentList.push(Number(value));
        } else {
            const index = componentList.indexOf(Number(value));
            if (index > -1) {
                componentList.splice(index, 1);
            }
        }

        setFormData(prevData => ({
            ...prevData,
            selectedComponents: updatedComponents,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Préparer les composants dans le format attendu par Laravel
        const components = Object.keys(formData.selectedComponents).map((componentType) => {
            return formData.selectedComponents[componentType].map((id: number) => {
                // Transforme chaque clé (comme "rams") en "ram_id", etc.
                const key = `${componentType.slice(0, -1)}_id`; // Enlève le "s" pour avoir "ram_id" au lieu de "rams"
                return { [key]: id };
            });
        }).flat();

        // Envoi de la mise à jour via PUT
        Inertia.put(route('discountComponents.update', discount.id), {
            ...formData,
            components: components,  // Envoi du tableau de composants avec tous les composants sélectionnés
        });
    };

    return (
        <div>
            <h1>Edit Discount</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Discount Type:</label>
                    <select
                        name="discount_type"
                        value={formData.discount_type}
                        onChange={handleChange}
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>
                <div>
                    <label>Value:</label>
                    <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <h3>Select Components to Apply Discount</h3>

                    {/* RAMs */}
                    <div>
                        <h4>RAM</h4>
                        {rams && rams.length > 0 ? (
                            rams.map((ram) => (
                                <div key={ram.id}>
                                    <input
                                        type="checkbox"
                                        value={ram.id}
                                        checked={formData.selectedComponents.rams.includes(ram.id)}
                                        onChange={(e) => handleComponentChange(e, 'rams')}
                                    />
                                    <label>{ram.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No RAMs available</p>
                        )}
                    </div>

                    {/* Hard Drives */}
                    <div>
                        <h4>Hard Drives</h4>
                        {hard_drives && hard_drives.length > 0 ? (
                            hard_drives.map((hardDrive) => (
                                <div key={hardDrive.id}>
                                    <input
                                        type="checkbox"
                                        value={hardDrive.id}
                                        checked={formData.selectedComponents.hard_drives.includes(hardDrive.id)}
                                        onChange={(e) => handleComponentChange(e, 'hard_drives')}
                                    />
                                    <label>{hardDrive.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Hard Drives available</p>
                        )}
                    </div>

                    {/* Processors */}
                    <div>
                        <h4>Processors</h4>
                        {processors && processors.length > 0 ? (
                            processors.map((processor) => (
                                <div key={processor.id}>
                                    <input
                                        type="checkbox"
                                        value={processor.id}
                                        checked={formData.selectedComponents.processors.includes(processor.id)}
                                        onChange={(e) => handleComponentChange(e, 'processors')}
                                    />
                                    <label>{processor.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Processors available</p>
                        )}
                    </div>

                    {/* Power Supplies */}
                    <div>
                        <h4>Power Supplies</h4>
                        {power_supplies && power_supplies.length > 0 ? (
                            power_supplies.map((powerSupply) => (
                                <div key={powerSupply.id}>
                                    <input
                                        type="checkbox"
                                        value={powerSupply.id}
                                        checked={formData.selectedComponents.power_supplies.includes(powerSupply.id)}
                                        onChange={(e) => handleComponentChange(e, 'power_supplies')}
                                    />
                                    <label>{powerSupply.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Power Supplies available</p>
                        )}
                    </div>

                    {/* Motherboards */}
                    <div>
                        <h4>Motherboards</h4>
                        {motherboards && motherboards.length > 0 ? (
                            motherboards.map((motherboard) => (
                                <div key={motherboard.id}>
                                    <input
                                        type="checkbox"
                                        value={motherboard.id}
                                        checked={formData.selectedComponents.motherboards.includes(motherboard.id)}
                                        onChange={(e) => handleComponentChange(e, 'motherboards')}
                                    />
                                    <label>{motherboard.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Motherboards available</p>
                        )}
                    </div>

                    {/* Network Cards */}
                    <div>
                        <h4>Network Cards</h4>
                        {network_cards && network_cards.length > 0 ? (
                            network_cards.map((networkCard) => (
                                <div key={networkCard.id}>
                                    <input
                                        type="checkbox"
                                        value={networkCard.id}
                                        checked={formData.selectedComponents.network_cards.includes(networkCard.id)}
                                        onChange={(e) => handleComponentChange(e, 'network_cards')}
                                    />
                                    <label>{networkCard.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Network Cards available</p>
                        )}
                    </div>

                    {/* RAID Controllers */}
                    <div>
                        <h4>RAID Controllers</h4>
                        {raid_controllers && raid_controllers.length > 0 ? (
                            raid_controllers.map((raidController) => (
                                <div key={raidController.id}>
                                    <input
                                        type="checkbox"
                                        value={raidController.id}
                                        checked={formData.selectedComponents.raid_controllers.includes(raidController.id)}
                                        onChange={(e) => handleComponentChange(e, 'raid_controllers')}
                                    />
                                    <label>{raidController.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No RAID Controllers available</p>
                        )}
                    </div>

                    {/* Cooling Solutions */}
                    <div>
                        <h4>Cooling Solutions</h4>
                        {cooling_solutions && cooling_solutions.length > 0 ? (
                            cooling_solutions.map((coolingSolution) => (
                                <div key={coolingSolution.id}>
                                    <input
                                        type="checkbox"
                                        value={coolingSolution.id}
                                        checked={formData.selectedComponents.cooling_solutions.includes(coolingSolution.id)}
                                        onChange={(e) => handleComponentChange(e, 'cooling_solutions')}
                                    />
                                    <label>{coolingSolution.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Cooling Solutions available</p>
                        )}
                    </div>

                    {/* Chassis */}
                    <div>
                        <h4>Chassis</h4>
                        {chassis && chassis.length > 0 ? (
                            chassis.map((chassisItem) => (
                                <div key={chassisItem.id}>
                                    <input
                                        type="checkbox"
                                        value={chassisItem.id}
                                        checked={formData.selectedComponents.chassis.includes(chassisItem.id)}
                                        onChange={(e) => handleComponentChange(e, 'chassis')}
                                    />
                                    <label>{chassisItem.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Chassis available</p>
                        )}
                    </div>

                    {/* Graphic Cards */}
                    <div>
                        <h4>Graphic Cards</h4>
                        {graphic_cards && graphic_cards.length > 0 ? (
                            graphic_cards.map((graphicCard) => (
                                <div key={graphicCard.id}>
                                    <input
                                        type="checkbox"
                                        value={graphicCard.id}
                                        checked={formData.selectedComponents.graphic_cards.includes(graphicCard.id)}
                                        onChange={(e) => handleComponentChange(e, 'graphic_cards')}
                                    />
                                    <label>{graphicCard.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Graphic Cards available</p>
                        )}
                    </div>

                    {/* Fiber Optic Cards */}
                    <div>
                        <h4>Fiber Optic Cards</h4>
                        {fiber_optic_cards && fiber_optic_cards.length > 0 ? (
                            fiber_optic_cards.map((fiberOpticCard) => (
                                <div key={fiberOpticCard.id}>
                                    <input
                                        type="checkbox"
                                        value={fiberOpticCard.id}
                                        checked={formData.selectedComponents.fiber_optic_cards.includes(fiberOpticCard.id)}
                                        onChange={(e) => handleComponentChange(e, 'fiber_optic_cards')}
                                    />
                                    <label>{fiberOpticCard.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Fiber Optic Cards available</p>
                        )}
                    </div>

                    {/* Expansion Cards */}
                    <div>
                        <h4>Expansion Cards</h4>
                        {expansion_cards && expansion_cards.length > 0 ? (
                            expansion_cards.map((expansionCard) => (
                                <div key={expansionCard.id}>
                                    <input
                                        type="checkbox"
                                        value={expansionCard.id}
                                        checked={formData.selectedComponents.expansion_cards.includes(expansionCard.id)}
                                        onChange={(e) => handleComponentChange(e, 'expansion_cards')}
                                    />
                                    <label>{expansionCard.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>No Expansion Cards available</p>
                        )}
                    </div>
                </div>

                <div>
                    <button type="submit">Save Discount</button>
                </div>
            </form>
        </div>
    );
};

export default EditDiscount;
