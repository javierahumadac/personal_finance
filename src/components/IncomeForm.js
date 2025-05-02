import React, { useState } from 'react';
import { X } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

// Componente de formulario para ingresos
const IncomeForm = ({ onAdd, onCancel }) => {
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');

	const handleSubmit = () => {
		if (description && amount) {
			// Convertir el string de monto con formato a número
			const numericAmount = parseFloat(amount.replace(/\./g, '').replace(/\$/g, ''));
			onAdd(description, numericAmount);
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
			<CurrencyInput
				label="Monto"
				value={amount}
				onChange={setAmount}
				placeholder="Monto"
				id="income-amount"
			/>
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
