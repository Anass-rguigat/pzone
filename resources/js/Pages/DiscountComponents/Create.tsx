import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia-react';
import { Link } from '@inertiajs/inertia-react';

const Create = ({
  rams,
  processors,
  motherboards,
  raid_controllers,
  chassis,
  fiber_optic_cards,
  hard_drives,
  network_cards,
  power_supplies,
  cooling_solutions,
  graphic_cards,
  expansion_cards,
}: any) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    discount_type: 'percentage',
    value: 0,
    start_date: '',
    end_date: '',
    components: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('discountComponents.store'));
  };

  const handleComponentChange = (type: string, id: number) => {
    const fieldName = `${type.slice(0, -1)}_id`; // 'rams' -> 'ram_id'

    // Add the selected component to the components array
    setData('components', [
      ...data.components,
      { [fieldName]: id, type },
    ]);
  };

  const handleRemoveComponent = (type: string, id: number) => {
    const fieldName = `${type.slice(0, -1)}_id`; // 'rams' -> 'ram_id'

    // Remove the component from the components array
    setData('components', data.components.filter((item) => item[fieldName] !== id || item.type !== type));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Discount</h1>
      <Link href={route('discountComponents.index')} className="btn btn-secondary mb-4">Back to List</Link>

      <form onSubmit={handleSubmit}>
        {/* Discount Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block">Discount Name</label>
          <input
            type="text"
            id="name"
            className="form-input w-full"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Discount Type */}
        <div className="mb-4">
          <label htmlFor="discount_type" className="block">Discount Type</label>
          <select
            id="discount_type"
            className="form-select w-full"
            value={data.discount_type}
            onChange={(e) => setData('discount_type', e.target.value)}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          {errors.discount_type && <p className="text-red-500 text-sm">{errors.discount_type}</p>}
        </div>

        {/* Discount Value */}
        <div className="mb-4">
          <label htmlFor="value" className="block">Discount Value</label>
          <input
            type="number"
            id="value"
            className="form-input w-full"
            value={data.value}
            onChange={(e) => setData('value', parseFloat(e.target.value))}
          />
          {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="start_date" className="block">Start Date</label>
          <input
            type="date"
            id="start_date"
            className="form-input w-full"
            value={data.start_date}
            onChange={(e) => setData('start_date', e.target.value)}
          />
          {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="end_date" className="block">End Date</label>
          <input
            type="date"
            id="end_date"
            className="form-input w-full"
            value={data.end_date}
            onChange={(e) => setData('end_date', e.target.value)}
          />
          {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
        </div>

        {/* Component Selections */}
        
        {/* RAM Selection */}
        <div className="mb-4">
          <h4>RAMs</h4>
          {rams.length === 0 ? (
            <p>No RAMs available</p>
          ) : (
            rams.map((ram: any) => (
              <div key={ram.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`ram-${ram.id}`}
                  onChange={() => handleComponentChange('rams', ram.id)}
                />
                <label htmlFor={`ram-${ram.id}`} className="ml-2">{ram.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Processor Selection */}
        <div className="mb-4">
          <h4>Processors</h4>
          {processors.length === 0 ? (
            <p>No Processors available</p>
          ) : (
            processors.map((processor: any) => (
              <div key={processor.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`processor-${processor.id}`}
                  onChange={() => handleComponentChange('processors', processor.id)}
                />
                <label htmlFor={`processor-${processor.id}`} className="ml-2">{processor.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Motherboard Selection */}
        <div className="mb-4">
          <h4>Motherboards</h4>
          {motherboards.length === 0 ? (
            <p>No Motherboards available</p>
          ) : (
            motherboards.map((motherboard: any) => (
              <div key={motherboard.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`motherboard-${motherboard.id}`}
                  onChange={() => handleComponentChange('motherboards', motherboard.id)}
                />
                <label htmlFor={`motherboard-${motherboard.id}`} className="ml-2">{motherboard.name}</label>
              </div>
            ))
          )}
        </div>

        {/* RAID Controller Selection */}
        <div className="mb-4">
          <h4>RAID Controllers</h4>
          {raid_controllers.length === 0 ? (
            <p>No RAID Controllers available</p>
          ) : (
            raid_controllers.map((raid: any) => (
              <div key={raid.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`raid_controller-${raid.id}`}
                  onChange={() => handleComponentChange('raid_controllers', raid.id)}
                />
                <label htmlFor={`raid_controller-${raid.id}`} className="ml-2">{raid.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Chassis Selection */}
        <div className="mb-4">
          <h4>Chassis</h4>
          {chassis.length === 0 ? (
            <p>No Chassis available</p>
          ) : (
            chassis.map((chassisItem: any) => (
              <div key={chassisItem.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`chassis-${chassisItem.id}`}
                  onChange={() => handleComponentChange('chassis', chassisItem.id)}
                />
                <label htmlFor={`chassis-${chassisItem.id}`} className="ml-2">{chassisItem.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Fiber Optic Card Selection */}
        <div className="mb-4">
          <h4>Fiber Optic Cards</h4>
          {fiber_optic_cards.length === 0 ? (
            <p>No Fiber Optic Cards available</p>
          ) : (
            fiber_optic_cards.map((fiber: any) => (
              <div key={fiber.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`fiber_optic_card-${fiber.id}`}
                  onChange={() => handleComponentChange('fiber_optic_cards', fiber.id)}
                />
                <label htmlFor={`fiber_optic_card-${fiber.id}`} className="ml-2">{fiber.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Hard Drive Selection */}
        <div className="mb-4">
          <h4>Hard Drives</h4>
          {hard_drives.length === 0 ? (
            <p>No Hard Drives available</p>
          ) : (
            hard_drives.map((hardDrive: any) => (
              <div key={hardDrive.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`hard_drive-${hardDrive.id}`}
                  onChange={() => handleComponentChange('hard_drives', hardDrive.id)}
                />
                <label htmlFor={`hard_drive-${hardDrive.id}`} className="ml-2">{hardDrive.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Network Card Selection */}
        <div className="mb-4">
          <h4>Network Cards</h4>
          {network_cards.length === 0 ? (
            <p>No Network Cards available</p>
          ) : (
            network_cards.map((networkCard: any) => (
              <div key={networkCard.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`network_card-${networkCard.id}`}
                  onChange={() => handleComponentChange('network_cards', networkCard.id)}
                />
                <label htmlFor={`network_card-${networkCard.id}`} className="ml-2">{networkCard.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Power Supply Selection */}
        <div className="mb-4">
          <h4>Power Supplies</h4>
          {power_supplies.length === 0 ? (
            <p>No Power Supplies available</p>
          ) : (
            power_supplies.map((powerSupply: any) => (
              <div key={powerSupply.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`power_supply-${powerSupply.id}`}
                  onChange={() => handleComponentChange('power_supplies', powerSupply.id)}
                />
                <label htmlFor={`power_supply-${powerSupply.id}`} className="ml-2">{powerSupply.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Cooling Solution Selection */}
        <div className="mb-4">
          <h4>Cooling Solutions</h4>
          {cooling_solutions.length === 0 ? (
            <p>No Cooling Solutions available</p>
          ) : (
            cooling_solutions.map((coolingSolution: any) => (
              <div key={coolingSolution.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`cooling_solution-${coolingSolution.id}`}
                  onChange={() => handleComponentChange('cooling_solutions', coolingSolution.id)}
                />
                <label htmlFor={`cooling_solution-${coolingSolution.id}`} className="ml-2">{coolingSolution.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Graphic Card Selection */}
        <div className="mb-4">
          <h4>Graphic Cards</h4>
          {graphic_cards.length === 0 ? (
            <p>No Graphic Cards available</p>
          ) : (
            graphic_cards.map((graphicCard: any) => (
              <div key={graphicCard.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`graphic_card-${graphicCard.id}`}
                  onChange={() => handleComponentChange('graphic_cards', graphicCard.id)}
                />
                <label htmlFor={`graphic_card-${graphicCard.id}`} className="ml-2">{graphicCard.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Expansion Card Selection */}
        <div className="mb-4">
          <h4>Expansion Cards</h4>
          {expansion_cards.length === 0 ? (
            <p>No Expansion Cards available</p>
          ) : (
            expansion_cards.map((expansionCard: any) => (
              <div key={expansionCard.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`expansion_card-${expansionCard.id}`}
                  onChange={() => handleComponentChange('expansion_cards', expansionCard.id)}
                />
                <label htmlFor={`expansion_card-${expansionCard.id}`} className="ml-2">{expansionCard.name}</label>
              </div>
            ))
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={processing}>
          {processing ? 'Processing...' : 'Create Discount'}
        </button>
      </form>
    </div>
  );
};

export default Create;
