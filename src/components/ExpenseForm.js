import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';

// Componente de formulario para gastos
const ExpenseForm = ({ onSubmit, onCancel }) => {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');

	const handleSubmit = () => {
		if (name && amount) {
			const numericAmount = parseFloat(amount.replace(/\./g, '').replace(/\$/g, ''));
			onSubmit(name, numericAmount);
		}
	};

	return (
		<div className="form">
			<div className="form-field">
				<label className="form-label">Nombre</label>
				<input
					type="text"
					placeholder="Nombre"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="form-input"
				/>
			</div>
			<CurrencyInput
				label="Monto"
				value={amount}
				onChange={setAmount}
				id="expense-amount"
			/>
			<div className="form-actions">
				<button
					onClick={onCancel}
					className="btn btn-secondary"
				>
					Cancelar
				</button>
				<button
					onClick={handleSubmit}
					className="btn btn-primary"
				>
					Agregar
				</button>
			</div>
		</div>
	);
};

export default ExpenseForm;
