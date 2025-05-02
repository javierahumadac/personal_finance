import { useState, useEffect } from 'react';
import { saveToCSV, loadFromCSV } from '../utils/dataUtils';

const useIncome = (currentMonth, currentYear) => {
	// Estado local
	const [income, setIncome] = useState([]);

	// Cargar datos cuando cambia el mes o año
	useEffect(() => {
		// Cargar ingresos
		const savedIncome = loadFromCSV('income', currentMonth, currentYear);
		if (savedIncome) setIncome(savedIncome);
		else setIncome([]);
	}, [currentMonth, currentYear]);

	const addIncome = (newIncome) => {
		const updatedIncome = [...income, newIncome];
		setIncome(updatedIncome);
		saveToCSV('income', currentMonth, currentYear, updatedIncome);
	};

	const editIncome = (index, updatedIncome) => {
		const updated = [...income];
		updated[index] = updatedIncome;
		setIncome(updated);
		saveToCSV('income', currentMonth, currentYear, updated);
	};

	const deleteIncome = (index) => {
		const updated = income.filter((_, i) => i !== index);
		setIncome(updated);
		saveToCSV('income', currentMonth, currentYear, updated);
	};

	// Retornar estado y funciones
	return {
		income,
		addIncome,
		editIncome,
		deleteIncome
	};
};

export default useIncome;
