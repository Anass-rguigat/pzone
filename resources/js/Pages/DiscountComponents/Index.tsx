// resources/js/Pages/DiscountComponents/Index.tsx

import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

interface Discount {
  id: number;
  name: string;
  discount_type: string;
  value: number;
  start_date: string;
  end_date: string;
}

const Index = ({ discounts }: { discounts: Discount[] }) => {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      Inertia.delete(route('discountComponents.destroy', id));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Discounts</h1>

      <Link href={route('discountComponents.create')} className="btn btn-primary mb-4">Create New Discount</Link>

      {discounts.length === 0 ? (
        <p>No discounts available</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Discount Type</th>
              <th>Value</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td>{discount.name}</td>
                <td>{discount.discount_type}</td>
                <td>{discount.value}{discount.discount_type === 'percentage' ? '%' : ''}</td>
                <td>{new Date(discount.start_date).toLocaleDateString()}</td>
                <td>{new Date(discount.end_date).toLocaleDateString()}</td>
                <td>
                  <Link href={route('discountComponents.edit', discount.id)} className="btn btn-sm btn-info mr-2">Edit</Link>
                  <button onClick={() => handleDelete(discount.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Index;
