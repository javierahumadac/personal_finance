import React, { useState } from 'react';
import SavingsItem from './SavingsItem';

// Componente de sección de ahorros
const SavingsSection = ({ items, onAdd, onToggle, onEdit, onDelete, onPartialPayment }) => {

	return (
		<div className="section">
			<div className="section-header">
				<h2 className="section-title">Ahorros</h2>
			</div>

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
