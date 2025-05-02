import React from 'react';
import CurrencyInputField from 'react-currency-input-field';

// Componente personalizado para entrada de moneda CLP
const CurrencyInput = ({ value, onChange, placeholder, label, id }) => {
	return (
		<div className="form-field">
			{label && <label className="form-label" htmlFor={id}>{label}</label>}
			<CurrencyInputField
				id={id}
				name={id}
				placeholder={placeholder || "Monto"}
				defaultValue={value}
				decimalsLimit={0}
				onValueChange={(value) => onChange(value || '')}
				prefix="$"
				groupSeparator="."
				decimalSeparator=","
				className="form-input"
			/>
		</div>
	);
};

export default CurrencyInput;
