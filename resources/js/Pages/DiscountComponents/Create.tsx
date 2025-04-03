import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Link } from '@inertiajs/inertia-react';
import { Layout } from '@/Layouts/layout';

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
  cable_connector,
  battery,
}: any) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    discount_type: 'percentage',
    value: 0,
    start_date: '',
    end_date: '',
    components: [],
  });

  const toggleComponent = (type: string, id: number) => {
    const componentIndex = data.components.findIndex(
      (c: any) => c.type === type && c[`${type.slice(0, -1)}_id`] === id
    );

    if (componentIndex > -1) {
      setData('components', data.components.filter((_, i) => i !== componentIndex));
    } else {
      setData('components', [
        ...data.components,
        { [`${type.slice(0, -1)}_id`]: id, type }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('discountComponents.store'));
  };

  const componentGroups = [
    { name: 'RAMs', items: rams, type: 'rams' },
    { name: 'Processeurs', items: processors, type: 'processors' },
    { name: 'Cartes mères', items: motherboards, type: 'motherboards' },
    { name: 'Contrôleurs RAID', items: raid_controllers, type: 'raid_controllers' },
    { name: 'Châssis', items: chassis, type: 'chassis' },
    { name: 'Cartes fibre optique', items: fiber_optic_cards, type: 'fiber_optic_cards' },
    { name: 'Disques durs', items: hard_drives, type: 'hard_drives' },
    { name: 'Cartes réseau', items: network_cards, type: 'network_cards' },
    { name: 'Alimentations', items: power_supplies, type: 'power_supplies' },
    { name: 'Refroidissements', items: cooling_solutions, type: 'cooling_solutions' },
    { name: 'Cartes graphiques', items: graphic_cards, type: 'graphic_cards' },
    { name: "Cartes d'extension", items: expansion_cards, type: 'expansion_cards' },
    { name: 'Connecteurs câble', items: cable_connector, type: 'cable_connectors' },
    { name: 'Batteries', items: battery, type: 'batteries' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer une remise</h1>
          <Link 
            href={route('discountComponents.index')}
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de remise</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data.discount_type}
                  onChange={(e) => setData('discount_type', e.target.value)}
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data.value}
                  onChange={(e) => setData('value', parseFloat(e.target.value))}
                />
                {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
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
                        const isSelected = data.components.some(
                          (c: any) => c.type === group.type && c[`${group.type.slice(0, -1)}_id`] === item.id
                        );

                        return (
                          <label 
                            key={item.id}
                            className={`flex items-center p-2 rounded cursor-pointer ${
                              isSelected ? 'bg-blue-100' : 'hover:bg-gray-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleComponent(group.type, item.id)}
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
              disabled={processing}
              className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 mr-2"
            >
              {processing ? 'Création en cours...' : 'Créer la remise'}
            </button>
            <Link href="/discountComponents" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            Retour à la liste
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Create;