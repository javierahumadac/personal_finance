import { useState, useEffect } from 'react';
import {
	saveToCSV,
	loadFromCSV,
	propagateToFutureMonths,
	propagateDeletionToFutureMonths
} from '../utils/dataUtils';

const useRecurringExpenses = (currentMonth, currentYear) => {
	// Estado local
	const [recurringExpenses, setRecurringExpenses] = useState([]);

	// Cargar datos cuando cambia el mes o año
	useEffect(() => {
		// Cargar gastos recurrentes
		const savedRecurring = loadFromCSV('recurring', currentMonth, currentYear);
		if (savedRecurring) setRecurringExpenses(savedRecurring);
		else setRecurringExpenses([]);
	}, [currentMonth, currentYear]);

	const addRecurringExpense = (expense) => {
		const updated = [...recurringExpenses, expense];
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);
		// Propagar a meses futuros
		propagateToFutureMonths('recurring', currentMonth, currentYear, updated);
	};

	const editRecurringExpense = (index, updatedExpense) => {
		const updated = [...recurringExpenses];
		updated[index] = updatedExpense;
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);
		// Propagar a meses futuros
		propagateToFutureMonths('recurring', currentMonth, currentYear, updated);
	};

	const deleteRecurringExpense = (index) => {
		// Guardar el nombre del gasto antes de eliminarlo para propagar la eliminación
		const deletedItemName = recurringExpenses[index].name;

		// Eliminar el gasto del mes actual
		const updated = recurringExpenses.filter((_, i) => i !== index);
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);

		// Propagar la eliminación a meses futuros
		propagateDeletionToFutureMonths('recurring', currentMonth, currentYear, deletedItemName);
	};

	const toggleRecurringExpense = (index) => {
		const updated = [...recurringExpenses];
		updated[index].paid = !updated[index].paid;
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);
	};

	// Retornar estado y funciones
	return {
		recurringExpenses,
		addRecurringExpense,
		editRecurringExpense,
		deleteRecurringExpense,
		toggleRecurringExpense
	};
};

export default useRecurringExpenses;
