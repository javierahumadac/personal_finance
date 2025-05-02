import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import ExpenseItem from './ExpenseItem';

// Componente de sección de gastos (recurrentes o mensuales)
const ExpenseSection = ({ title, items, onAdd, onToggle, onEdit, onDelete, showCheckbox = true }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newName, setNewName] = useState('');
	const [newAmount, setNewAmount] = useState('');

	const handleAdd = () => {
		if (newName && newAmount) {
			onAdd(newName, parseFloat(newAmount));
			setNewName('');
			setNewAmount('');
			setIsAdding(false);
		}
	};

	return (
		<div className="section mb-6">
			<div className="section-header">
				<h2 className="section-title">{title}</h2>
				<button onClick={() => setIsAdding(!isAdding)} className="add-button">
					<PlusCircle size={20} />
				</button>
			</div>

			{isAdding && (
				<div className="form">
					<div className="form-field">
						<label className="form-label">Nombre</label>
						<input
							type="text"
							placeholder="Nombre"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="form-input"
						/>
					</div>
					<div className="form-field">
						<label className="form-label">Monto</label>
						<input
							type="number"
							placeholder="Monto"
							value={newAmount}
							onChange={(e) => setNewAmount(e.target.value)}
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

			<div>
				{items.map((item, index) => (
					<ExpenseItem
						key={index}
						item={item}
						showCheckbox={showCheckbox}
						onToggle={() => onToggle && onToggle(index)}
						onEdit={(updatedItem) => onEdit && onEdit(index, updatedItem)}
						onDelete={() => onDelete && onDelete(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ExpenseSection;
