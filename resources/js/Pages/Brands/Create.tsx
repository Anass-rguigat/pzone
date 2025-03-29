import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Type definition for the form state
interface FormState {
  name: string;
}

const Create: React.FC = () => {
  // Define form state with explicit types
  const [form, setForm] = useState<FormState>({
    name: '',
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    Inertia.post('/brands', { name: form.name }); // Ensure the form data matches expected request format
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <h1>Create Brand</h1>
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
        <button type="submit">Create Brand</button>
      </form>
    </AuthenticatedLayout>
  );
};

export default Create;
