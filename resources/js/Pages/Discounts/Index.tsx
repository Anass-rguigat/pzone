import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/inertia-react";
import { Link } from "@inertiajs/inertia-react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
  const [loadingId, setLoadingId] = useState<number | null>(null); // Track loading state for each discount

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      setLoadingId(id); // Set loading for the specific discount
      Inertia.delete(route("discounts.destroy", id), {
        onFinish: () => setLoadingId(null), // Reset loading state after action finishes
      });
    }
  };

  // Function to format date (you can adjust this to your preferred format)
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString(); // Example: "MM/DD/YYYY"
  };

  return (
    <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Discount Server
                </h2>
            }
        >
      
      <div className="container mt-5">
        <h1>Discounts</h1>
        <div className="mb-4">
          <Link href={route("discounts.create")} className="btn btn-primary">
            Create Discount
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
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
              {discounts.length > 0 ? (
                discounts.map((discount) => (
                  <tr key={discount.id}>
                    <td>{discount.name}</td>
                    <td>{discount.discount_type}</td>
                    <td>{discount.value}</td>
                    <td>{formatDate(discount.start_date)}</td>
                    <td>{formatDate(discount.end_date)}</td>
                    <td>
                      <Link
                        href={route("discounts.edit", discount.id)}
                        className="btn btn-sm btn-warning mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="btn btn-sm btn-danger"
                        disabled={loadingId === discount.id} // Disable the button for the discount being deleted
                      >
                        {loadingId === discount.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No discounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default DiscountsIndex;
