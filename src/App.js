import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

// Importaciones de componentes
import IncomeForm from './components/IncomeForm';
import IncomeItem from './components/IncomeItem';
import ExpenseSection from './components/ExpenseSection';
import CreditCardSection from './components/CreditCardSection';
import SavingsSection from './components/SavingsSection';
import FinancialSummary from './components/FinancialSummary'; // Importar el nuevo componente

// Importaciones de utilidades
import { saveToCSV, loadFromCSV, propagateToFutureMonths } from './utils/dataUtils';

// Componente principal de la aplicación
export default function App() {
	const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	const currentDate = new Date();

	const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
	const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
	const [income, setIncome] = useState([]);
	const [isAddingIncome, setIsAddingIncome] = useState(false);
	const [previousBalance, setPreviousBalance] = useState(0);
	const [recurringExpenses, setRecurringExpenses] = useState([]);
	const [monthlyExpenses, setMonthlyExpenses] = useState([]);
	const [creditCards, setCreditCards] = useState([]);
	const [savings, setSavings] = useState([]);

	// Calcular totales y balance
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

	// Navegación al mes anterior
	const goToPrevMonth = () => {
		setCurrentMonth(prev => {
			if (prev === 0) {
				setCurrentYear(currentYear - 1);
				return 11;
			}
			return prev - 1;
		});
	};

	// Navegación al mes siguiente
	const goToNextMonth = () => {
		setCurrentMonth(prev => {
			if (prev === 11) {
				setCurrentYear(currentYear + 1);
				return 0;
			}
			return prev + 1;
		});
	};

	// Cargar datos cuando cambia el mes
	useEffect(() => {
		// Cargar ingresos
		const savedIncome = loadFromCSV('income', currentMonth, currentYear);
		if (savedIncome) setIncome(savedIncome);
		else setIncome([]);

		// Cargar balance anterior
		const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
		const prevBalance = loadFromCSV('balance', prevMonth, prevYear);
		if (prevBalance) setPreviousBalance(prevBalance);
		else setPreviousBalance(0);

		// Cargar gastos recurrentes
		const savedRecurring = loadFromCSV('recurring', currentMonth, currentYear);
		if (savedRecurring) setRecurringExpenses(savedRecurring);
		else setRecurringExpenses([]);

		// Cargar gastos mensuales
		const savedMonthly = loadFromCSV('monthly', currentMonth, currentYear);
		if (savedMonthly) setMonthlyExpenses(savedMonthly);
		else setMonthlyExpenses([]);

		// Cargar tarjetas de crédito
		const savedCredit = loadFromCSV('credit', currentMonth, currentYear);
		if (savedCredit) setCreditCards(savedCredit);
		else setCreditCards([]);

		// Cargar ahorros
		const savedSavings = loadFromCSV('savings', currentMonth, currentYear);
		if (savedSavings) setSavings(savedSavings);
		else setSavings([]);
	}, [currentMonth, currentYear]);

	// Guardar balance cuando cambia
	useEffect(() => {
		const { balance } = calculateTotals();
		saveToCSV('balance', currentMonth, currentYear, balance);
	}, [income, previousBalance, recurringExpenses, monthlyExpenses, creditCards, savings]);

	// Funciones para manipular ingresos
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

	// Funciones para manipular gastos recurrentes
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
		const updated = recurringExpenses.filter((_, i) => i !== index);
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);
	};

	const toggleRecurringExpense = (index) => {
		const updated = [...recurringExpenses];
		updated[index].paid = !updated[index].paid;
		setRecurringExpenses(updated);
		saveToCSV('recurring', currentMonth, currentYear, updated);
	};

	// Funciones para manipular gastos mensuales
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

	// Funciones para manipular tarjetas de crédito
	const addCreditCard = (card) => {
		const updated = [...creditCards, card];
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);
		// Propagar a meses futuros
		propagateToFutureMonths('credit', currentMonth, currentYear, updated);
	};

	const editCreditCard = (index, updatedCard) => {
		const updated = [...creditCards];
		updated[index] = updatedCard;
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);
		// Propagar cambios a meses futuros
		propagateToFutureMonths('credit', currentMonth, currentYear, updated);
	};

	const deleteCreditCard = (index) => {
		const updated = creditCards.filter((_, i) => i !== index);
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);
	};

	const toggleCreditCard = (index) => {
		const updated = [...creditCards];
		updated[index].paid = !updated[index].paid;
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);
	};

	// Funciones para manipular ahorros
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
		const updated = savings.filter((_, i) => i !== index);
		setSavings(updated);
		saveToCSV('savings', currentMonth, currentYear, updated);
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

	// Calcular todos los totales y balance
	const totals = calculateTotals();

	return (
		<div className="app-container">
			{/* Navegación de Meses */}
			<div className="month-header">
				<button onClick={goToPrevMonth} className="month-nav-button">
					<ChevronLeft size={20} />
				</button>
				<h1 className="month-title">
					{months[currentMonth]} {currentYear}
				</h1>
				<button onClick={goToNextMonth} className="month-nav-button">
					<ChevronRight size={20} />
				</button>
			</div>

			{/* Sección de Resumen del Balance - Reemplazada por el nuevo componente */}
			<FinancialSummary totals={totals} previousBalance={previousBalance} />


			{/* Sección de Ingresos */}
			<div className="section mb-6">
				<div className="section-header">
					<h2 className="section-title">Ingresos</h2>
					<button onClick={() => setIsAddingIncome(!isAddingIncome)} className="add-button">
						<PlusCircle size={20} />
					</button>
				</div>

				{isAddingIncome && (
					<IncomeForm
						onAdd={(description, amount) => {
							addIncome({ description, amount });
							setIsAddingIncome(false);
						}}
						onCancel={() => setIsAddingIncome(false)}
					/>
				)}

				<div>
					{Array.isArray(income) && income.map((item, index) => (
						<IncomeItem
							key={index}
							item={item}
							onEdit={(updatedIncome) => editIncome(index, updatedIncome)}
							onDelete={() => deleteIncome(index)}
						/>
					))}
				</div>
			</div>

			{/* Sección de Gastos Recurrentes */}
			<ExpenseSection
				title="Gastos recurrentes"
				items={recurringExpenses}
				onAdd={(name, amount) => addRecurringExpense({ name, amount, paid: false })}
				onToggle={toggleRecurringExpense}
				onEdit={editRecurringExpense}
				onDelete={deleteRecurringExpense}
				showCheckbox={true}
			/>

			{/* Sección de Gastos Mensuales */}
			<ExpenseSection
				title="Gastos mensuales"
				items={monthlyExpenses}
				onAdd={(name, amount) => addMonthlyExpense({ name, amount })}
				onEdit={editMonthlyExpense}
				onDelete={deleteMonthlyExpense}
				showCheckbox={false}
			/>

			{/* Sección de Tarjeta de Crédito */}
			<CreditCardSection
				items={creditCards}
				onAdd={(name, monthlyPayment, installments) => {
					const totalAmount = monthlyPayment * installments;
					addCreditCard({
						name,
						totalAmount,
						monthlyPayment,
						installments,
						currentInstallment: 1,
						paid: false
					});
				}}
				onToggle={toggleCreditCard}
				onEdit={editCreditCard}
				onDelete={deleteCreditCard}
			/>

			{/* Sección de Ahorros */}
			<SavingsSection
				items={savings}
				onAdd={(name, targetAmount, months) => {
					const monthlyAmount = targetAmount / months;
					addSavings({
						name,
						targetAmount,
						totalMonths: months,
						currentMonth: 1,
						monthlyAmount,
						paid: false,
						partialPayments: []
					});
				}}
				onToggle={toggleSavings}
				onEdit={editSavings}
				onDelete={deleteSavings}
				onPartialPayment={addPartialPayment}
			/>
		</div>
	);
}
