/**
 * Utilidades para cálculos financieros
 */

export const formatCurrency = (value, withDecimals = false) => {
	return value.toLocaleString('es-CL', {
		style: 'currency',
		currency: 'CLP',
		maximumFractionDigits: withDecimals ? 2 : 0
	});
};

export const calculateSavingProgress = (savingGoal) => {
	const { currentMonth, totalMonths, partialPayments } = savingGoal;

	// Porcentaje base por meses transcurridos
	let baseProgress = (currentMonth / totalMonths) * 100;

	// Si hay pagos parciales, los consideramos como progreso adicional
	if (partialPayments && partialPayments.length > 0) {
		const totalPaid = partialPayments.reduce((sum, p) => sum + p.amount, 0);
		const partialProgress = (totalPaid / savingGoal.targetAmount) * 100;

		// Combinamos el progreso base con el progreso por pagos parciales
		baseProgress = Math.min(100, baseProgress + partialProgress);
	}

	return Math.round(baseProgress);
};

export const parseCurrencyToNumber = (formattedValue) => {
	if (!formattedValue) return 0;

	// Elimina símbolos de moneda, puntos y cualquier carácter no numérico
	const numericString = formattedValue.replace(/[^\d,-]/g, '')
		.replace(/\./g, '')  // Elimina puntos (separadores de miles)
		.replace(/,/g, '.'); // Reemplaza comas por puntos (para decimales)

	return parseFloat(numericString) || 0;
};

export const calculateCompoundInterest = (principal, rate, time, frequency = 12) => {
	const r = rate / 100 / frequency;
	const n = frequency * time;

	return principal * Math.pow(1 + r, n);
};

export const calculateSavingCapacity = (income, expenses) => {
	const savingAmount = income - expenses;
	const savingPercentage = income > 0 ? (savingAmount / income) * 100 : 0;

	return {
		amount: savingAmount,
		percentage: savingPercentage
	};
};
