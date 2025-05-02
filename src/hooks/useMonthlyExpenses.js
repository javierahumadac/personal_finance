import { useState, useEffect } from 'react';
import { saveToCSV, loadFromCSV } from '../utils/dataUtils';

const useMonthlyExpenses = (currentMonth, currentYear) => {
	// Estado local
	const [monthlyExpenses, setMonthlyExpenses] = useState([]);

	// Cargar datos cuando cambia el mes o año
	useEffect(() => {
		// Cargar gastos mensuales
		const savedMonthly = loadFromCSV('monthly', currentMonth, currentYear);
		if (savedMonthly) setMonthlyExpenses(savedMonthly);
		else setMonthlyExpenses([]);
	}, [currentMonth, currentYear]);

	const addMonthlyExpense = (expense) => {
		const expenseWithPaid = { ...expense, paid: true }; // Siempre pagado al añadirse
		const updated = [...monthlyExpenses, expenseWithPaid];
		setMonthlyExpenses(updated);
		saveToCSV('monthly', currentMonth, currentYear, updated);
	};

	const editMonthlyExpense = (index, updatedExpense) => {
		const updated = [...monthlyExpenses];
		updated[index] = updatedExpense;
		setMonthlyExpenses(updated);
		saveToCSV('monthly', currentMonth, currentYear, updated);
	};

	const deleteMonthlyExpense = (index) => {
		const updated = monthlyExpenses.filter((_, i) => i !== index);
		setMonthlyExpenses(updated);
		saveToCSV('monthly', currentMonth, currentYear, updated);
	};

	// Retornar estado y funciones
	return {
		monthlyExpenses,
		addMonthlyExpense,
		editMonthlyExpense,
		deleteMonthlyExpense
	};
};

export default useMonthlyExpenses;
