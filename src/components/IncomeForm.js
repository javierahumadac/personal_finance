import React, { useState } from 'react';
import { X } from 'lucide-react';

// Componente de formulario para ingresos
const IncomeForm = ({ onAdd, onCancel }) => {
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');

	const handleSubmit = () => {
		if (description && amount) {
			onAdd(description, parseFloat(amount));
			setDescription('');
			setAmount('');
		}
	};

	return (
		<div className="form">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-medium">Nuevo Ingreso</h3>
				<button onClick={onCancel} className="action-button">
					<X size={18} />
				</button>
			</div>
			<div className="form-field">
				<label className="form-label">Descripción</label>
				<input
					type="text"
					placeholder="Descripción"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="form-input"
				/>
			</div>
			<div className="form-field">
				<label className="form-label">Monto</label>
				<input
					type="number"
					placeholder="Monto"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="form-input"
				/>
			</div>
			<button
				onClick={handleSubmit}
				className="btn btn-primary w-full"
			>
				Agregar
			</button>
		</div>
	);
};

export default IncomeForm;
