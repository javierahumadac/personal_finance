import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente de sección de ahorros
const SavingsSection = ({ items, onAdd, onToggle, onEdit, onDelete, onPartialPayment }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [isAddingPartial, setIsAddingPartial] = useState(null);
	const [isEditing, setIsEditing] = useState(null);
	const [newName, setNewName] = useState('');
	const [newTarget, setNewTarget] = useState('');
	const [newMonths, setNewMonths] = useState('');
	const [partialAmount, setPartialAmount] = useState('');

	// Estados para edición
	const [editName, setEditName] = useState('');
	const [editTarget, setEditTarget] = useState('');
	const [editMonths, setEditMonths] = useState('');
	const [editCurrentMonth, setEditCurrentMonth] = useState('');

	const handleAdd = () => {
		if (newName && newTarget && newMonths) {
			// Convertir el string de monto con formato a número
			const numericTarget = parseFloat(newTarget.replace(/\./g, '').replace(/\$/g, ''));
			onAdd(newName, numericTarget, parseInt(newMonths));
			setNewName('');
			setNewTarget('');
			setNewMonths('');
			setIsAdding(false);
		}
	};

	const handlePartialPayment = (index) => {
		if (partialAmount) {
			// Convertir el string de monto con formato a número
			const numericPartial = parseFloat(partialAmount.replace(/\./g, '').replace(/\$/g, ''));
			onPartialPayment(index, numericPartial);
			setPartialAmount('');
			setIsAddingPartial(null);
		}
	};

	const startEditing = (item, index) => {
		setEditName(item.name);
		setEditTarget(item.targetAmount.toString());
		setEditMonths(item.totalMonths.toString());
		setEditCurrentMonth(item.currentMonth.toString());
		setIsEditing(index);
	};

	const handleUpdate = (index) => {
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
				paid: items[index].paid,
				partialPayments: items[index].partialPayments || []
			});
			setIsEditing(null);
		}
	};

	return (
		<div className="section">
			<div className="section-header">
				<h2 className="section-title">Ahorros</h2>
				<button onClick={() => setIsAdding(!isAdding)} className="add-button">
					<PlusCircle size={20} />
				</button>
			</div>

			{isAdding && (
				<div className="form">
					<div className="form-field">
						<label className="form-label">Objetivo</label>
						<input
							type="text"
							placeholder="Objetivo"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="form-input"
						/>
					</div>
					<CurrencyInput
						label="Monto objetivo"
						value={newTarget}
						onChange={setNewTarget}
						placeholder="Monto objetivo"
						id="savings-target"
					/>
					<div className="form-field">
						<label className="form-label">Meses para completar</label>
						<input
							type="number"
							placeholder="Meses para completar"
							value={newMonths}
							onChange={(e) => setNewMonths(e.target.value)}
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

			<div className="space-y-2">
				{items.map((item, index) => (
					<div key={index} className="item" style={{ display: "block" }}>
						{isEditing === index ? (
							<div className="w-full">
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
								<div className="flex justify-between items-center">
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
										<div className="progress-info">
											<div className="progress-bar">
												<div
													className="progress-fill"
													style={{ width: `${(item.currentMonth / item.totalMonths) * 100}%` }}
												></div>
											</div>
											<div className="progress-text">
												{Math.round((item.currentMonth / item.totalMonths) * 100)}%
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
								</div>

								{isAddingPartial === index ? (
									<div className="mt-4 pt-2 border-t">
										<div className="flex items-center space-x-2">
											<CurrencyInput
												value={partialAmount}
												onChange={setPartialAmount}
												placeholder="Monto parcial"
												id={`partial-payment-${index}`}
											/>
											<button
												onClick={() => handlePartialPayment(index)}
												className="btn btn-primary"
											>
												Guardar
											</button>
											<button
												onClick={() => {
													setIsAddingPartial(null);
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
										onClick={() => setIsAddingPartial(index)}
										className="mt-2 w-full p-1 bg-gray-100 text-gray-600 rounded text-sm"
									>
										Registrar pago parcial
									</button>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default SavingsSection;
