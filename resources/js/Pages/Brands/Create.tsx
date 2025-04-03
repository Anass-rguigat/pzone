import React, { useState, FormEvent } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Layout } from '@/Layouts/layout';
import { Link, useForm } from '@inertiajs/react';

interface Props {
  brands: { id: number; name: string }[]; 
}

const Create: React.FC<Props> = ({ brands = [] }) => {  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    brand_id: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/brands');
  };

  return (
    <Layout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <div className="px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold mb-6">Ajouter une Nouvelle Marque</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>
          </div>

          {brands && brands.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">
                  Marque
                </label>
                <select
                  name="brand_id"
                  id="brand_id"
                  value={data.brand_id}
                  onChange={(e) => setData('brand_id', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner une Marque</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brand_id && <p className="text-red-600 text-sm">{errors.brand_id}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <button
              type="submit"
              className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
              disabled={processing}
            >
              {processing ? 'Enregistrement...' : 'Créer la Marque'}
            </button>
            <Link href="/brands" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                Retour à la liste
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Create;
