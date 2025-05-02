import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import CreditCardItem from './CreditCardItem';

// Componente de sección de tarjetas de crédito
const CreditCardSection = ({ items, onAdd, onToggle, onEdit, onDelete }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newName, setNewName] = useState('');
	const [newPayment, setNewPayment] = useState('');
	const [newInstallments, setNewInstallments] = useState('');

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
				<CreditCardItem
					key={index}
					item={item}
					index={index}
					onToggle={onToggle}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
};

export default CreditCardSection;
