import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

// Componente para mostrar un item de ingreso
const IncomeItem = ({ item, onEdit, onDelete }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(item.description);
	const [amount, setAmount] = useState(item.amount);

	const handleSave = () => {
		onEdit({ description, amount: parseFloat(amount) });
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<div className="form">
				<div className="form-field">
					<label className="form-label">Descripción</label>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="form-input"
					/>
				</div>
				<div className="form-field">
					<label className="form-label">Monto</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
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
						onClick={handleSave}
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
				<div className="item-name">{item.description}</div>
				<div className="item-amount">
					{parseFloat(item.amount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
				</div>
			</div>
			<div className="item-actions">
				<button onClick={() => setIsEditing(true)} className="action-button edit-button">
					<Edit size={18} />
				</button>
				<button onClick={onDelete} className="action-button delete-button">
					<Trash2 size={18} />
				</button>
			</div>
		</div>
	);
};

export default IncomeItem;
