import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente de sección de tarjetas de crédito
const CreditCardSection = ({ items, onAdd, onToggle, onEdit, onDelete }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [isEditing, setIsEditing] = useState(null);
	const [newName, setNewName] = useState('');
	const [newPayment, setNewPayment] = useState('');
	const [newInstallments, setNewInstallments] = useState('');

	// Estados para edición
	const [editName, setEditName] = useState('');
	const [editPayment, setEditPayment] = useState('');
	const [editInstallments, setEditInstallments] = useState('');
	const [editCurrentInstallment, setEditCurrentInstallment] = useState('');

	const handleAdd = () => {
		if (newName && newPayment && newInstallments) {
			// Convertir el string de monto con formato a número
			const numericPayment = parseFloat(newPayment.replace(/\./g, '').replace(/\$/g, ''));
			onAdd(newName, numericPayment, parseInt(newInstallments));
			setNewName('');
			setNewPayment('');
			setNewInstallments('');
			setIsAdding(false);
		}
	};

	const startEditing = (item, index) => {
		setEditName(item.name);
		setEditPayment(item.monthlyPayment.toString());
		setEditInstallments(item.installments.toString());
		setEditCurrentInstallment(item.currentInstallment.toString());
		setIsEditing(index);
	};

	const handleUpdate = (index) => {
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
				paid: items[index].paid
			});
			setIsEditing(null);
		}
	};

	return (
		<div className="section">
			<div className="section-header">
				<h2 className="section-title">Tarjeta de crédito</h2>
				<button onClick={() => setIsAdding(!isAdding)} className="add-button">
					<PlusCircle size={20} />
				</button>
			</div>

			{isAdding && (
				<div className="form">
					<div className="form-field">
						<label className="form-label">Descripción</label>
						<input
							type="text"
							placeholder="Descripción"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="form-input"
						/>
					</div>
					<CurrencyInput
						label="Monto cuota"
						value={newPayment}
						onChange={setNewPayment}
						placeholder="Monto cuota"
						id="credit-payment"
					/>
					<div className="form-field">
						<label className="form-label">Número de cuotas</label>
						<input
							type="number"
							placeholder="Número de cuotas"
							value={newInstallments}
							onChange={(e) => setNewInstallments(e.target.value)}
							className="form-input"
						/>
					</div>
					<div className="form-actions">
						<button
							onClick={() => setIsAdding(false)}
							className="btn btn-secondary"
						>
							Cancelar
						</button>
						<button
							onClick={handleAdd}
							className="btn btn-primary"
						>
							Agregar
						</button>
					</div>
				</div>
			)}

			{items.map((item, index) => (
				<div key={index} className="item">
					{isEditing === index ? (
						<div className="w-full">
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
									onClick={() => setIsEditing(null)}
									className="btn btn-secondary"
								>
									Cancelar
								</button>
								<button
									onClick={() => handleUpdate(index)}
									className="btn btn-primary"
								>
									Guardar
								</button>
							</div>
						</div>
					) : (
						<>
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
								<div className="progress-info">
									<div className="progress-bar">
										<div
											className="progress-fill"
											style={{ width: `${(item.currentInstallment / item.installments) * 100}%` }}
										></div>
									</div>
									<div className="progress-text">
										{Math.round((item.currentInstallment / item.installments) * 100)}%
									</div>
								</div>
							</div>
							<div className="item-actions">
								<button onClick={() => startEditing(item, index)} className="action-button edit-button">
									<Edit size={18} />
								</button>
								<button onClick={() => onDelete && onDelete(index)} className="action-button delete-button">
									<Trash2 size={18} />
								</button>
								<button onClick={() => onToggle && onToggle(index)} className="action-button">
									{item.paid ?
										<CheckSquare size={20} className="text-purple-600" /> :
										<Square size={20} className="text-gray-400" />
									}
								</button>
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default CreditCardSection;
