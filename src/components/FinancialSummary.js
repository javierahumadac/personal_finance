import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FinancialSummary = ({ totals, previousBalance }) => {
	const [showDetails, setShowDetails] = useState(false);

	// Formatear valores monetarios
	const formatCurrency = (value) => {
		return value.toLocaleString('es-CL', {
			style: 'currency',
			currency: 'CLP',
			maximumFractionDigits: 0 // Sin decimales
		});
	};

	return (
		<div className="section mb-6">
			<div className="section-header">
				<h2 className="section-title">Resumen Financiero</h2>
				<div onClick={() => setShowDetails(!showDetails)}>
					<div className="flex items-center">
						<div className={`font-bold text-xl mr-2 ${totals.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
							{formatCurrency(totals.balance)}
						</div>
						{showDetails ?
							<ChevronUp className="text-gray-400" size={18} /> :
							<ChevronDown className="text-gray-400" size={18} />
						}
					</div>
				</div>
			</div>

			{showDetails && (
				<div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
					<div className="space-y-3">
						<div className="flex justify-between items-center py-1">
							<div className="text-gray-600">Ingresos Totales:</div>
							<div className="text-emerald-600 font-medium">
								{formatCurrency(totals.totalIncome)}
							</div>
						</div>

						<div className="flex justify-between items-center py-1">
							<div className="text-gray-600">Gastos Totales:</div>
							<div className="text-red-500 font-medium">
								{formatCurrency(totals.totalExpenses)}
							</div>
						</div>

						<div className="flex justify-between items-center py-1">
							<div className="text-gray-600">Balance Anterior:</div>
							<div className="font-medium">
								{formatCurrency(parseFloat(previousBalance))}
							</div>
						</div>

						<div className="mt-2 pt-2 border-t border-gray-200">
							<div className="flex justify-between items-center py-1">
								<div className="text-gray-500 text-sm">Gastos Recurrentes:</div>
								<div className="text-gray-600 text-sm">
									{formatCurrency(totals.recTotal)}
								</div>
							</div>

							<div className="flex justify-between items-center py-1">
								<div className="text-gray-500 text-sm">Gastos Mensuales:</div>
								<div className="text-gray-600 text-sm">
									{formatCurrency(totals.monTotal)}
								</div>
							</div>

							<div className="flex justify-between items-center py-1">
								<div className="text-gray-500 text-sm">Pagos de Tarjetas:</div>
								<div className="text-gray-600 text-sm">
									{formatCurrency(totals.credTotal)}
								</div>
							</div>

							<div className="flex justify-between items-center py-1">
								<div className="text-gray-500 text-sm">Ahorros:</div>
								<div className="text-gray-600 text-sm">
									{formatCurrency(totals.savTotal)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FinancialSummary;
