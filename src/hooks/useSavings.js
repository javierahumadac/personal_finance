import { useState, useEffect } from 'react';
import {
	saveToCSV,
	loadFromCSV,
	propagateToFutureMonths,
	propagateDeletionToFutureMonths
} from '../utils/dataUtils';

const useSavings = (currentMonth, currentYear) => {
	// Estado local
	const [savings, setSavings] = useState([]);

	// Cargar datos cuando cambia el mes o año
	useEffect(() => {
		// Cargar ahorros
		const savedSavings = loadFromCSV('savings', currentMonth, currentYear);
		if (savedSavings) setSavings(savedSavings);
		else setSavings([]);
	}, [currentMonth, currentYear]);

	const addSavings = (goal) => {
		const updated = [...savings, goal];
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);
		// Propagar a meses futuros
		propagateToFutureMonths('savings', currentMonth, currentYear, updated);
	};

	const editSavings = (index, updatedGoal) => {
		const updated = [...savings];
		updated[index] = updatedGoal;
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);
		// Propagar cambios a meses futuros
		propagateToFutureMonths('savings', currentMonth, currentYear, updated);
	};

	const deleteSavings = (index) => {
		// Guardar el nombre del ahorro antes de eliminarlo
		const deletedItemName = savings[index].name;

		// Eliminar el ahorro del mes actual
		const updated = savings.filter((_, i) => i !== index);
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);

		// Propagar la eliminación a meses futuros
		propagateDeletionToFutureMonths('savings', currentMonth, currentYear, deletedItemName);
	};

	const toggleSavings = (index) => {
		const updated = [...savings];
		updated[index].paid = !updated[index].paid;
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);
	};

	const addPartialPayment = (index, amount) => {
		const updated = [...savings];
		if (!updated[index].partialPayments) {
			updated[index].partialPayments = [];
		}
		updated[index].partialPayments.push({
			date: new Date().toISOString(),
			amount: parseFloat(amount)
		});
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);
	};

	// Retornar estado y funciones
	return {
		savings,
		addSavings,
		editSavings,
		deleteSavings,
		toggleSavings,
		addPartialPayment
	};
};

export default useSavings;
