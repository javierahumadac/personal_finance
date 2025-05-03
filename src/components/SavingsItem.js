import React, { useState } from 'react';
import { Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente para mostrar un item de ahorro
const SavingsItem = ({ item, onToggle, onEdit, onDelete, onPartialPayment, index }) => {
	const [isEditingMonthlyAmount, setIsEditingMonthlyAmount] = useState(false);
	const [monthlyAmount, setMonthlyAmount] = useState(item.monthlyAmount.toString());

	const handleMonthlyAmountUpdate = () => {
		if (monthlyAmount) {
			// Convertir el string de monto con formato a número
			const numericAmount = parseFloat(monthlyAmount.replace(/\./g, '').replace(/\$/g, ''));

			// Actualizamos solo el monto mensual
			onEdit(index, {
				...item,
				monthlyAmount: numericAmount
			});

			setIsEditingMonthlyAmount(false);
		}
	};

	return (
		<div className="item">
			<div className="flex justify-between items-center w-full">
				<div className="item-info">
					<div className="item-name">{item.name}</div>
					{!isEditingMonthlyAmount ? (
						<div className="item-amount">
							{parseFloat(item.monthlyAmount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
							<span className="ml-2 text-sm">
								{item.currentMonth}/{item.totalMonths}
							</span>
						</div>
					) : (
						<div className="mt-2">
							<CurrencyInput
								value={monthlyAmount}
								onChange={setMonthlyAmount}
								placeholder="Monto mensual"
								id={`edit-monthly-amount-${index}`}
							/>
							<div className="flex gap-2 mt-2">
								<button
									onClick={handleMonthlyAmountUpdate}
									className="btn btn-primary text-sm"
								>
									Guardar
								</button>
								<button
									onClick={() => {
										setIsEditingMonthlyAmount(false);
										setMonthlyAmount(item.monthlyAmount.toString());
									}}
									className="btn btn-secondary text-sm"
								>
									Cancelar
								</button>
							</div>
						</div>
					)}
					<div className="text-gray-500 text-sm">
						Meta: {parseFloat(item.targetAmount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
					</div>
					{item.partialPayments && item.partialPayments.length > 0 && (
						<div className="text-gray-500 text-xs mt-1">
							Pagos parciales: {item.partialPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
						</div>
					)}
				</div>
				<div className="item-actions">
					<button
						onClick={() => setIsEditingMonthlyAmount(true)}
						className="action-button edit-button"
						title="Editar monto de este mes"
					>
						<Edit size={18} />
					</button>
					<button
						onClick={() => onDelete(index)}
						className="action-button delete-button"
					>
						<Trash2 size={18} />
					</button>
					<button
						onClick={() => onToggle(index)}
						className="action-button"
					>
						{item.paid ?
							<CheckSquare size={20} className="text-purple-600" /> :
							<Square size={20} className="text-gray-400" />
						}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SavingsItem;
