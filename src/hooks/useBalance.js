import { useState, useEffect } from 'react';
import { saveToCSV, loadFromCSV } from '../utils/dataUtils';

/**
 * Hook personalizado para gestionar el balance y cálculos de totales
 *
 * @param {number} currentMonth - Mes actual (0-11)
 * @param {number} currentYear - Año actual
 * @param {Array} income - Lista de ingresos
 * @param {Array} recurringExpenses - Lista de gastos recurrentes
 * @param {Array} monthlyExpenses - Lista de gastos mensuales
 * @param {Array} creditCards - Lista de tarjetas de crédito
 * @param {Array} savings - Lista de ahorros
 * @returns {Object} - Balance anterior y totales calculados
 */
const useBalance = (
	currentMonth,
	currentYear,
	income,
	recurringExpenses,
	monthlyExpenses,
	creditCards,
	savings
) => {
	const [previousBalance, setPreviousBalance] = useState(0);
	const [totals, setTotals] = useState({
		totalIncome: 0,
		totalExpenses: 0,
		balance: 0,
		recTotal: 0,
		monTotal: 0,
		credTotal: 0,
		savTotal: 0
	});

	// Cargar el balance anterior al cambiar de mes
	useEffect(() => {
		// Cargar balance anterior
		const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
		const prevBalance = loadFromCSV('balance', prevMonth, prevYear);
		if (prevBalance) setPreviousBalance(prevBalance);
		else setPreviousBalance(0);
	}, [currentMonth, currentYear]);

	// Calcular totales y guardar balance cuando cambian los datos
	useEffect(() => {
		const calculatedTotals = calculateTotals();
		setTotals(calculatedTotals);

		// Guardar el balance actual
		saveToCSV('balance', currentMonth, currentYear, calculatedTotals.balance);
	}, [income, previousBalance, recurringExpenses, monthlyExpenses, creditCards, savings]);

	/**
	 * Calcular totales de ingresos, gastos y balance
	 *
	 * @returns {Object} - Objeto con los totales calculados
	 */
	const calculateTotals = () => {
		// Solo contar gastos recurrentes pagados
		const recTotal = recurringExpenses.reduce((sum, item) =>
			item.paid ? sum + parseFloat(item.amount || 0) : sum, 0);

		const monTotal = monthlyExpenses.reduce((sum, item) =>
			sum + parseFloat(item.amount || 0), 0);

		const credTotal = creditCards.reduce((sum, item) =>
			item.paid ? sum + parseFloat(item.monthlyPayment || 0) : sum, 0);

		const savTotal = savings.reduce((sum, item) =>
			item.paid ? sum + parseFloat(item.monthlyAmount || 0) : sum, 0);

		// Calcular ingresos totales
		const totalIncomeValue = Array.isArray(income)
			? income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
			: parseFloat(income || 0);

		const totalIncome = totalIncomeValue + parseFloat(previousBalance) || 0;
		const totalExpenses = recTotal + monTotal + credTotal + savTotal;
		const balance = totalIncome - totalExpenses;

		return {
			totalIncome,
			totalExpenses,
			balance,
			recTotal,
			monTotal,
			credTotal,
			savTotal
		};
	};

	return {
		previousBalance,
		totals
	};
};

export default useBalance;
