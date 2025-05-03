import React, { useState } from 'react';
import CreditCardItem from './CreditCardItem';

// Componente de sección de tarjetas de crédito
const CreditCardSection = ({ items, onAdd, onToggle, onEdit, onDelete }) => {


	return (
		<div className="section">
			<div className="section-header">
				<h2 className="section-title">Tarjeta de crédito</h2>
			</div>

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
