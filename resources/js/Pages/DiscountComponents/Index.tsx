import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Layout } from '@/Layouts/layout';

interface Discount {
  id: number;
  name: string;
  discount_type: string;
  value: number;
  start_date: string;
  end_date: string;
}

interface Props {
  discounts: Discount[];
}

const Index = ({ discounts }: Props) => {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      destroy(route('discountComponents.destroy', id));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 p-2">List of Discounts</h1>

      <div className="flex justify-between items-start mb-4">
        <Link
          href={route('discountComponents.create')}
          className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        >
          Create New Discount
        </Link>

        <input
          type="text"
          className="px-4 py-2 border rounded-lg w-1/3"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Discount Type</th>
              <th scope="col" className="px-6 py-3">Value</th>
              <th scope="col" className="px-6 py-3">Start Date</th>
              <th scope="col" className="px-6 py-3">End Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((discount) => (
                <tr
                  key={discount.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {discount.name}
                  </th>
                  <td className="px-6 py-4">{discount.discount_type}</td>
                  <td className="px-6 py-4">
                    {discount.value}
                    {discount.discount_type === 'percentage' ? '%' : ''}
                  </td>
                  <td className="px-6 py-4">{new Date(discount.start_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(discount.end_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex space-x-2">
                      <Link
                        href={route('discountComponents.edit', discount.id)}
                        className="font-medium text-green-600 dark:text-green-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <Link href={`/discountComponents/${discount.id}`} className="font-medium text-blue-600 hover:underline">
                                                Voir
                                            </Link>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No discounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Index;
