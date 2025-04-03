import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Layout } from "@/Layouts/layout";

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

const DiscountsIndex: React.FC<Props> = ({ discounts }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      setLoadingId(id); 
      Inertia.delete(route("discounts.destroy", id), {
        onFinish: () => setLoadingId(null), 
      });
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString(); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Discounts</h1>

        <div className="flex justify-between items-center mb-4">
          <Link
            href={route("discounts.create")}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Create Discount
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
                  <tr key={discount.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td className="px-6 py-4">{discount.name}</td>
                    <td className="px-6 py-4">{discount.discount_type}</td>
                    <td className="px-6 py-4">{discount.value}{discount.discount_type === 'percentage' ? "%" : ""}</td>
                    <td className="px-6 py-4">{formatDate(discount.start_date)}</td>
                    <td className="px-6 py-4">{formatDate(discount.end_date)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex space-x-2">
                        <Link href={route("discounts.edit", discount.id)} className="font-medium text-green-600 dark:green-blue-500 hover:underline">
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(discount.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                          disabled={loadingId === discount.id} 
                        >
                          {loadingId === discount.id ? "Deleting..." : "Delete"}
                        </button>
                        <Link
                          href={route("discounts.show", discount.id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View
                        </Link>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No discounts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DiscountsIndex;
