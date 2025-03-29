import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
interface Server {
    id: number;
    name: string;
}

const CreateDiscount: React.FC<{ servers: Server[] }> = ({ servers }) => {
    const [formData, setFormData] = useState({
        name: '',
        discount_type: 'percentage',
        value: 0,
        start_date: '',
        end_date: '',
        server_id: '' // Selected server for discount application
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.post(route('discounts.store'), formData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1>Create Discount</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Discount Type</label>
                    <select name="discount_type" value={formData.discount_type} onChange={handleChange} required>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>
                <div>
                    <label>Value</label>
                    <input type="number" name="value" value={formData.value} onChange={handleChange} required />
                </div>
                <div>
                    <label>Start Date</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Server</label>
                    <select name="server_id" value={formData.server_id} onChange={handleChange}>
                        <option value="">Select Server</option>
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>{server.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Discount</button>
            </form>
        </AuthenticatedLayout>
    );
};

export default CreateDiscount;
