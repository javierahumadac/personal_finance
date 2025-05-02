import React, { useState } from 'react';
import { Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente para mostrar un item de ahorro
const SavingsItem = ({ item, onToggle, onEdit, onDelete, onPartialPayment, index }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isAddingPartial, setIsAddingPartial] = useState(false);
	const [partialAmount, setPartialAmount] = useState('');

	// Estados para edición
	const [editName, setEditName] = useState(item.name);
	const [editTarget, setEditTarget] = useState(item.targetAmount.toString());
	const [editMonths, setEditMonths] = useState(item.totalMonths.toString());
	const [editCurrentMonth, setEditCurrentMonth] = useState(item.currentMonth.toString());

	const handlePartialPayment = () => {
		if (partialAmount) {
			// Convertir el string de monto con formato a número
			const numericPartial = parseFloat(partialAmount.replace(/\./g, '').replace(/\$/g, ''));
			onPartialPayment(index, numericPartial);
			setPartialAmount('');
			setIsAddingPartial(false);
		}
	};

	const handleUpdate = () => {
		if (editName && editTarget && editMonths) {
			// Convertir el string de monto con formato a número
			const numericTarget = parseFloat(editTarget.replace(/\./g, '').replace(/\$/g, ''));
			const monthlyAmount = numericTarget / parseInt(editMonths);
			onEdit(index, {
				name: editName,
				targetAmount: numericTarget,
				totalMonths: parseInt(editMonths),
				currentMonth: parseInt(editCurrentMonth),
				monthlyAmount: monthlyAmount,
				paid: item.paid,
				partialPayments: item.partialPayments || []
			});
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="form w-full">
				<div className="form-field">
					<label className="form-label">Objetivo</label>
					<input
						type="text"
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						className="form-input"
					/>
				</div>
				<CurrencyInput
					label="Monto objetivo"
					value={editTarget}
					onChange={setEditTarget}
					id={`edit-savings-target-${index}`}
				/>
				<div className="form-field">
					<label className="form-label">Meses para completar</label>
					<input
						type="number"
						value={editMonths}
						onChange={(e) => setEditMonths(e.target.value)}
						className="form-input"
					/>
				</div>
				<div className="form-field">
					<label className="form-label">Mes actual</label>
					<input
						type="number"
						value={editCurrentMonth}
						onChange={(e) => setEditCurrentMonth(e.target.value)}
						className="form-input"
					/>
				</div>
				<div className="form-actions">
					<button
						onClick={() => setIsEditing(false)}
						className="btn btn-secondary"
					>
						Cancelar
					</button>
					<button
						onClick={handleUpdate}
						className="btn btn-primary"
					>
						Guardar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="item">
			<div className="flex justify-between items-center w-full">
				<div className="item-info">
					<div className="item-name">{item.name}</div>
					<div className="item-amount">
						{parseFloat(item.monthlyAmount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
						<span className="ml-2 text-sm">
							{item.currentMonth}/{item.totalMonths}
						</span>
					</div>
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
					<button onClick={() => setIsEditing(true)} className="action-button edit-button">
						<Edit size={18} />
					</button>
					<button onClick={() => onDelete(index)} className="action-button delete-button">
						<Trash2 size={18} />
					</button>
					<button onClick={() => onToggle(index)} className="action-button">
						{item.paid ?
							<CheckSquare size={20} className="text-purple-600" /> :
							<Square size={20} className="text-gray-400" />
						}
					</button>
				</div>
			</div>

			{isAddingPartial ? (
				<div className="mt-4 pt-2 border-t">
					<div className="flex items-center space-x-2">
						<CurrencyInput
							value={partialAmount}
							onChange={setPartialAmount}
							placeholder="Monto parcial"
							id={`partial-payment-${index}`}
						/>
						<button
							onClick={handlePartialPayment}
							className="btn btn-primary"
						>
							Guardar
						</button>
						<button
							onClick={() => {
								setIsAddingPartial(false);
								setPartialAmount('');
							}}
							className="btn btn-secondary"
						>
							Cancelar
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setIsAddingPartial(true)}
					className="mt-2 w-full p-1 bg-gray-100 text-gray-600 rounded text-sm"
				>
					Registrar pago parcial
				</button>
			)}
		</div>
	);
};

export default SavingsItem;
