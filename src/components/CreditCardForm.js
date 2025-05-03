import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';

// Componente de formulario para tarjetas de crédito
const CreditCardForm = ({ onSubmit, onCancel }) => {
	const [name, setName] = useState('');
	const [payment, setPayment] = useState('');
	const [installments, setInstallments] = useState('');

	const handleSubmit = () => {
		if (name && payment && installments) {
			const numericPayment = parseFloat(payment.replace(/\./g, '').replace(/\$/g, ''));
			onSubmit(name, numericPayment, parseInt(installments));
		}
	};

	return (
		<div className="form">
			<div className="form-field">
				<label className="form-label">Descripción</label>
				<input
					type="text"
					placeholder="Descripción"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="form-input"
				/>
			</div>
			<CurrencyInput
				label="Monto cuota"
				value={payment}
				onChange={setPayment}
				placeholder="Monto cuota"
				id="credit-payment"
			/>
			<div className="form-field">
				<label className="form-label">Número de cuotas</label>
				<input
					type="number"
					placeholder="Número de cuotas"
					value={installments}
					onChange={(e) => setInstallments(e.target.value)}
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

export default CreditCardForm;
