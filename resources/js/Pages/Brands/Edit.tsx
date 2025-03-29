import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Type definition for the form state
interface BrandForm {
  name: string;
}

interface EditProps {
  brand: {
    id: number;
    name: string;
  };
}

const Edit: React.FC<EditProps> = ({ brand }) => {
  // Set the initial state using the brand data
  const [form, setForm] = useState<BrandForm>({
    name: brand.name,
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Inertia.put(`/brands/${brand.id}`, { name: form.name });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <h1>Edit Brand</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Brand</button>
      </form>
    </AuthenticatedLayout>
  );
};

export default Edit;
