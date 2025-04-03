import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react'; 
import { Layout } from '@/Layouts/layout';

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
    expansion_cards,
    cable_connectors,
    batteries,
}: any) => {
    const [formData, setFormData] = useState({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        selectedComponents: {
            rams: discount.rams ? discount.rams.map((ram: any) => ram.id) : [],
            hard_drives: discount.hard_drives ? discount.hard_drives.map((hardDrive: any) => hardDrive.id) : [],
            processors: discount.processors ? discount.processors.map((processor: any) => processor.id) : [],
            power_supplies: discount.power_supplies ? discount.power_supplies.map((powerSupply: any) => powerSupply.id) : [],
            motherboards: discount.motherboards ? discount.motherboards.map((motherboard: any) => motherboard.id) : [],
            network_cards: discount.network_cards ? discount.network_cards.map((networkCard: any) => networkCard.id) : [],
            raid_controllers: discount.raid_controllers ? discount.raid_controllers.map((raidController: any) => raidController.id) : [],
            cooling_solutions: discount.cooling_solutions ? discount.cooling_solutions.map((coolingSolution: any) => coolingSolution.id) : [],
            chassis: discount.chassis ? discount.chassis.map((chassis: any) => chassis.id) : [],
            graphic_cards: discount.graphic_cards ? discount.graphic_cards.map((graphicCard: any) => graphicCard.id) : [],
            fiber_optic_cards: discount.fiber_optic_cards ? discount.fiber_optic_cards.map((fiberOpticCard: any) => fiberOpticCard.id) : [],
            expansion_cards: discount.expansion_cards ? discount.expansion_cards.map((expansionCard: any) => expansionCard.id) : [],
            batteries: discount.batteries ? discount.batteries.map((battery: any) => battery.id) : [],
            cable_connectors: discount.cable_connectors ? discount.cable_connectors.map((cable: any) => cable.id) : []
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleComponentChange = (componentType: string, itemId: number) => {
        const updatedComponents = { ...formData.selectedComponents };
        const componentList = updatedComponents[componentType];

        if (componentList.includes(itemId)) {
            updatedComponents[componentType] = componentList.filter((id: number) => id !== itemId);
        } else {
            updatedComponents[componentType] = [...componentList, itemId];
        }

        setFormData(prevData => ({
            ...prevData,
            selectedComponents: updatedComponents,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const components = Object.keys(formData.selectedComponents).map((componentType) => {
            return formData.selectedComponents[componentType].map((id: number) => {
    
                const key = `${componentType.slice(0, -1)}_id`;
                return { [key]: id };
            });
        }).flat();

        // Envoi de la mise à jour via PUT
        Inertia.put(route('discountComponents.update', discount.id), {
            ...formData,
            components: components, 
        });
    };

    const componentGroups = [
        { name: 'RAM', type: 'rams', items: rams },
        { name: 'Disques durs', type: 'hard_drives', items: hard_drives },
        { name: 'Processeurs', type: 'processors', items: processors },
        { name: 'Alimentations', type: 'power_supplies', items: power_supplies },
        { name: 'Cartes mères', type: 'motherboards', items: motherboards },
        { name: 'Cartes réseau', type: 'network_cards', items: network_cards },
        { name: 'Contrôleurs RAID', type: 'raid_controllers', items: raid_controllers },
        { name: 'Systèmes de refroidissement', type: 'cooling_solutions', items: cooling_solutions },
        { name: 'Châssis', type: 'chassis', items: chassis },
        { name: 'Cartes graphiques', type: 'graphic_cards', items: graphic_cards },
        { name: 'Cartes fibre optique', type: 'fiber_optic_cards', items: fiber_optic_cards },
        { name: 'Cartes d\'expansion', type: 'expansion_cards', items: expansion_cards },
        { name: 'Câbles', type: 'cable_connectors', items: cable_connectors },
        { name: 'Batteries', type: 'batteries', items: batteries },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Modifier la remise</h1>
                    <Link 
                        href="/discountComponents"
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Retour
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la remise</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de remise</label>
                                <select
                                    name="discount_type"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.discount_type}
                                    onChange={handleChange}
                                >
                                    <option value="percentage">Pourcentage</option>
                                    <option value="fixed">Montant fixe</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
                                <input
                                    type="number"
                                    name="value"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.value}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold mb-6">Composants concernés</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {componentGroups.map((group) => (
                                <div key={group.type} className="border rounded-lg p-4 bg-gray-50">
                                    <h4 className="font-medium mb-3">{group.name}</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {group.items.length === 0 ? (
                                            <p className="text-gray-500 text-sm">Aucun élément disponible</p>
                                        ) : (
                                            group.items.map((item: any) => {
                                                const isSelected = formData.selectedComponents[group.type].includes(item.id);

                                                return (
                                                    <label 
                                                        key={item.id}
                                                        className={`flex items-center p-2 rounded cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleComponentChange(group.type, item.id)}
                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm">{item.name}</span>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                        >
                            {formData.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                        <Link 
                            href="/discountComponents"
                            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditDiscount;
