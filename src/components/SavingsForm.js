import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';

// Componente de formulario para ahorros
const SavingsForm = ({ onSubmit, onCancel }) => {
	const [name, setName] = useState('');
	const [target, setTarget] = useState('');
	const [months, setMonths] = useState('');

	const handleSubmit = () => {
		if (name && target && months) {
			const numericTarget = parseFloat(target.replace(/\./g, '').replace(/\$/g, ''));
			onSubmit(name, numericTarget, parseInt(months));
		}
	};

	return (
		<div className="form">
			<div className="form-field">
				<label className="form-label">Objetivo</label>
				<input
					type="text"
					placeholder="Objetivo"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="form-input"
				/>
			</div>
			<CurrencyInput
				label="Monto objetivo"
				value={target}
				onChange={setTarget}
				placeholder="Monto objetivo"
				id="savings-target"
			/>
			<div className="form-field">
				<label className="form-label">Meses para completar</label>
				<input
					type="number"
					placeholder="Meses para completar"
					value={months}
					onChange={(e) => setMonths(e.target.value)}
					className="form-input"
				/>
			</div>
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

export default SavingsForm;
