import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Define the type for the brand prop
interface ShowProps {
  brand: {
    name: string;
  };
}

const Show: React.FC<ShowProps> = ({ brand }) => {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <h1>{brand.name}</h1>
      <Link href="/brands" className="btn btn-primary">
        Back to List
      </Link>
    </AuthenticatedLayout>
  );
};

export default Show;
