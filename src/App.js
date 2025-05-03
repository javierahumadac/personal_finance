import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, DiamondPlus } from 'lucide-react';

// Importaciones de componentes
import IncomeForm from './components/IncomeForm';
import IncomeItem from './components/IncomeItem';
import ExpenseSection from './components/ExpenseSection';
import CreditCardSection from './components/CreditCardSection';
import SavingsSection from './components/SavingsSection';
import FinancialSummary from './components/FinancialSummary';

// Importaciones de hooks personalizados
import useIncome from './hooks/useIncome';
import useRecurringExpenses from './hooks/useRecurringExpenses';
import useMonthlyExpenses from './hooks/useMonthlyExpenses';
import useCreditCards from './hooks/useCreditCards';
import useSavings from './hooks/useSavings';
import useBalance from './hooks/useBalance';

// Componente principal de la aplicación
export default function App() {
	const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	const currentDate = new Date();

	const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
	const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
	const [isAddingIncome, setIsAddingIncome] = useState(false);

	// Usar hooks personalizados
	const {
		income,
		addIncome,
		editIncome,
		deleteIncome
	} = useIncome(currentMonth, currentYear);

	const {
		recurringExpenses,
		addRecurringExpense,
		editRecurringExpense,
		deleteRecurringExpense,
		toggleRecurringExpense
	} = useRecurringExpenses(currentMonth, currentYear);

	const {
		monthlyExpenses,
		addMonthlyExpense,
		editMonthlyExpense,
		deleteMonthlyExpense
	} = useMonthlyExpenses(currentMonth, currentYear);

	const {
		creditCards,
		addCreditCard,
		editCreditCard,
		deleteCreditCard,
		toggleCreditCard
	} = useCreditCards(currentMonth, currentYear);

	const {
		savings,
		addSavings,
		editSavings,
		deleteSavings,
		toggleSavings,
		addPartialPayment
	} = useSavings(currentMonth, currentYear);

	const {
		previousBalance,
		totals,
	} = useBalance(currentMonth, currentYear, income, recurringExpenses, monthlyExpenses, creditCards, savings);

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

			{/* Sección de Resumen del Balance */}
			<FinancialSummary totals={totals} previousBalance={previousBalance} />
			<button
				onClick={() => { }}
				className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
			>
				<DiamondPlus size={20} />
			</button>
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
