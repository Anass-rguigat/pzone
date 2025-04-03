import React from "react";
import { Link } from "@inertiajs/inertia-react";
import { Layout } from "@/Layouts/layout";
import { ArrowLeft, Info } from "lucide-react";


const DiscountShow: React.FC<Props> = ({ discount, components }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-MA", {
            style: "currency",
            currency: "MAD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatTypeName = (type: string) => {
        return type
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    };

    const getStatus = () => {
        const now = new Date();
        const start = new Date(discount.start_date);
        const end = new Date(discount.end_date);
        if (now < start) return "Scheduled";
        if (now > end) return "Expired";
        return "Active";
    };

    const status = getStatus();
    const statusColors = {
        Active: "bg-green-100 text-green-800",
        Expired: "bg-red-100 text-red-800",
        Scheduled: "bg-gray-900 text-gray-100"
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href="/discountComponents/"
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            <span className="font-medium">Retour aux remises</span>
                        </Link>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                            {status}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-black to-white rounded-xl p-6 shadow-lg">
                        <h1 className="text-3xl font-bold text-white mb-2">{discount.name}</h1>
                        <div className="flex items-center text-gray-200">
                            <Info className="h-5 w-5 mr-2" />
                            <p className="text-sm">
                                {discount.discount_type === 'percentage' ?
                                    `${discount.value}% discount applied` :
                                    `${formatCurrency(discount.value)} fixed discount`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Période</h3>
                        <div className="space-y-1">
                            <p className="text-gray-900">
                                {new Date(discount.start_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <span className="text-gray-400">–</span>
                            <p className="text-gray-900">
                                {new Date(discount.end_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Type de remise</h3>
                        <p className="text-gray-900 capitalize">
                            {discount.discount_type === 'percentage' ?
                                'Pourcentage' :
                                'Montant fixe'}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Valeur</h3>
                        <p className="text-2xl font-semibold text-blue-600">
                            {discount.discount_type === 'percentage' ?
                                `${discount.value}%` :
                                formatCurrency(discount.value)}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {Object.entries(components).map(([type, items]) => (
                        items.length > 0 && (
                            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {formatTypeName(type)}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Composant</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Prix original</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Prix actuel</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Économies</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {items.map((component) => {
                                                const savings = component.original_price - component.current_price;
                                                const savingsPercentage = (savings / component.original_price) * 100;

                                                return (
                                                    <tr key={component.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{component.name}</td>
                                                        <td className="px-6 py-4 text-gray-500 line-through">
                                                            {formatCurrency(component.original_price)}
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-green-600">
                                                            {formatCurrency(component.current_price)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-red-600">
                                                                    -{formatCurrency(savings)}
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                                    {savingsPercentage.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default DiscountShow;