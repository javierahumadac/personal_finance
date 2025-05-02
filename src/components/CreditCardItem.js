import React, { useState } from 'react';
import { Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente para mostrar un item de tarjeta de crédito
const CreditCardItem = ({ item, onToggle, onEdit, onDelete, index }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(item.name);
	const [editPayment, setEditPayment] = useState(item.monthlyPayment.toString());
	const [editInstallments, setEditInstallments] = useState(item.installments.toString());
	const [editCurrentInstallment, setEditCurrentInstallment] = useState(item.currentInstallment.toString());

	const handleUpdate = () => {
		if (editName && editPayment && editInstallments) {
			// Convertir el string de monto con formato a número
			const numericPayment = parseFloat(editPayment.replace(/\./g, '').replace(/\$/g, ''));
			const totalAmount = numericPayment * parseInt(editInstallments);
			onEdit(index, {
				name: editName,
				monthlyPayment: numericPayment,
				installments: parseInt(editInstallments),
				currentInstallment: parseInt(editCurrentInstallment),
				totalAmount: totalAmount,
				paid: item.paid
			});
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="form">
				<div className="form-field">
					<label className="form-label">Descripción</label>
					<input
						type="text"
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						className="form-input"
					/>
				</div>
				<CurrencyInput
					label="Monto cuota"
					value={editPayment}
					onChange={setEditPayment}
					id={`edit-credit-payment-${index}`}
				/>
				<div className="form-field">
					<label className="form-label">Número de cuotas</label>
					<input
						type="number"
						value={editInstallments}
						onChange={(e) => setEditInstallments(e.target.value)}
						className="form-input"
					/>
				</div>
				<div className="form-field">
					<label className="form-label">Cuota actual</label>
					<input
						type="number"
						value={editCurrentInstallment}
						onChange={(e) => setEditCurrentInstallment(e.target.value)}
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
			<div className="item-info">
				<div className="item-name">{item.name}</div>
				<div className="item-amount">
					{parseFloat(item.monthlyPayment).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
					<span className="ml-2 text-sm">
						{item.currentInstallment}/{item.installments}
					</span>
				</div>
				<div className="text-gray-500 text-sm">
					Total: {parseFloat(item.totalAmount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
				</div>
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
	);
};

export default CreditCardItem;
