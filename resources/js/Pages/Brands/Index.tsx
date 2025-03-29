import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
// Define a type for the Brand object
interface Brand {
  id: number;
  name: string;
}

// Define the props for the Index component
interface IndexProps {
  brands: Brand[];
}

const Index: React.FC<IndexProps> = ({ brands }) => {
  // Function to handle the delete action
  const handleDelete = (id: number) => {
   
      Inertia.delete(`/brands/${id}`);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <h1>Brand List</h1>
      <Link href="/brands/create" className="btn btn-primary">
        Add Brand
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.name}</td>
              <td>
                <Link href={`/brands/${brand.id}`} className="btn btn-info">
                  View
                </Link>
                <Link href={`/brands/${brand.id}/edit`} className="btn btn-warning">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AuthenticatedLayout>
  );
};

export default Index;
