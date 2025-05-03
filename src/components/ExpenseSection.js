import React, { useState } from 'react';
import ExpenseItem from './ExpenseItem';

// Componente de sección de gastos (recurrentes o mensuales)
const ExpenseSection = ({ title, items, onAdd, onToggle, onEdit, onDelete, showCheckbox = true }) => {

	return (
		<div className="section mb-6">
			<div className="section-header">
				<h2 className="section-title">{title}</h2>
			</div>

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
