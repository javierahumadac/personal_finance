import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import SavingsItem from './SavingsItem';

// Componente de sección de ahorros
const SavingsSection = ({ items, onAdd, onToggle, onEdit, onDelete, onPartialPayment }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newName, setNewName] = useState('');
	const [newTarget, setNewTarget] = useState('');
	const [newMonths, setNewMonths] = useState('');

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
					<SavingsItem
						key={index}
						item={item}
						index={index}
						onToggle={onToggle}
						onEdit={onEdit}
						onDelete={onDelete}
						onPartialPayment={onPartialPayment}
					/>
				))}
			</div>
		</div>
	);
};

export default SavingsSection;
