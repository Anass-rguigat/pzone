import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
interface Server {
    id: number;
    name: string;
}

interface Discount {
    id: number;
    name: string;
    discount_type: string;
    value: number;
    start_date: string;
    end_date: string;
}

const EditDiscount: React.FC<{ discount: Discount; servers: Server[]; associatedServers: Server[] }> = ({ discount, servers, associatedServers }) => {
    const [formData, setFormData] = useState({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        server_ids: associatedServers.map(server => server.id) // Keep the associated servers selected
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServers = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({
            ...formData,
            server_ids: selectedServers
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.put(route('discounts.update', discount.id), formData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <h1>Edit Discount</h1>
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
                    <label>Servers</label>
                    <select multiple name="server_ids" value={formData.server_ids} onChange={handleServerChange}>
                        {servers.map((server) => (
                            <option key={server.id} value={server.id}>{server.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Update Discount</button>
            </form>
        </AuthenticatedLayout>
    );
};

export default EditDiscount;
