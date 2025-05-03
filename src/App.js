import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

// Importaciones de componentes
import IncomeForm from './components/IncomeForm';
import IncomeItem from './components/IncomeItem';
import ExpenseSection from './components/ExpenseSection';
import ExpenseForm from './components/ExpenseForm';
import CreditCardSection from './components/CreditCardSection';
import CreditCardForm from './components/CreditCardForm';
import SavingsSection from './components/SavingsSection';
import SavingsForm from './components/SavingsForm';
import FinancialSummary from './components/FinancialSummary';
import RadialMenu from './components/RadialMenu';
import FloatingModal from './components/FloatingModal';

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
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeForm, setActiveForm] = useState(null);

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

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleSelectOption = (option) => {
		setActiveForm(option);
		setIsMenuOpen(false);
	};

	const handleCloseModal = () => {
		setActiveForm(null);
	};

	const renderModalContent = () => {
		switch (activeForm) {
			case 'income':
				return (
					<IncomeForm
						onAdd={(description, amount) => {
							addIncome({ description, amount });
							handleCloseModal();
						}}
						onCancel={handleCloseModal}
					/>
				);
			case 'recurring':
				return (
					<ExpenseForm
						onSubmit={(name, amount) => {
							addRecurringExpense({ name, amount, paid: false });
							handleCloseModal();
						}}
						onCancel={handleCloseModal}
					/>
				);
			case 'monthly':
				return (
					<ExpenseForm
						onSubmit={(name, amount) => {
							addMonthlyExpense({ name, amount });
							handleCloseModal();
						}}
						onCancel={handleCloseModal}
					/>
				);
			case 'credit':
				return (
					<CreditCardForm
						onSubmit={(name, monthlyPayment, installments) => {
							const totalAmount = monthlyPayment * installments;
							addCreditCard({
								name,
								totalAmount,
								monthlyPayment,
								installments,
								currentInstallment: 1,
								paid: false
							});
							handleCloseModal();
						}}
						onCancel={handleCloseModal}
					/>
				);
			case 'savings':
				return (
					<SavingsForm
						onSubmit={(name, targetAmount, months) => {
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
							handleCloseModal();
						}}
						onCancel={handleCloseModal}
					/>
				);
			default:
				return null;
		}
	};

	const getModalTitle = () => {
		switch (activeForm) {
			case 'income':
				return 'Nuevo Ingreso';
			case 'recurring':
				return 'Nuevo Gasto Recurrente';
			case 'monthly':
				return 'Nuevo Gasto Mensual';
			case 'credit':
				return 'Nueva Tarjeta de Crédito';
			case 'savings':
				return 'Nuevo Ahorro';
			default:
				return '';
		}
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

			{/* Floating Action Button */}
			<button
				onClick={handleMenuToggle}
				className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
			>
				{isMenuOpen ? <X size={20} /> : <Plus size={20} />}
			</button>

			{/* Radial Menu */}
			<RadialMenu
				isOpen={isMenuOpen}
				onSelectOption={handleSelectOption}
				onClose={() => setIsMenuOpen(false)}
			/>

			{/* Floating Modal */}
			<FloatingModal
				isOpen={!!activeForm}
				onClose={handleCloseModal}
				title={getModalTitle()}
			>
				{renderModalContent()}
			</FloatingModal>

			{/* Sección de Ingresos */}
			<div className="section mb-6">
				<div className="section-header">
					<h2 className="section-title">Ingresos</h2>
				</div>

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
				onToggle={toggleRecurringExpense}
				onEdit={editRecurringExpense}
				onDelete={deleteRecurringExpense}
				showCheckbox={true}
				showAddButton={false}
			/>

			{/* Sección de Gastos Mensuales */}
			<ExpenseSection
				title="Gastos mensuales"
				items={monthlyExpenses}
				onEdit={editMonthlyExpense}
				onDelete={deleteMonthlyExpense}
				showCheckbox={false}
				showAddButton={false}
			/>

			{/* Sección de Tarjeta de Crédito */}
			<CreditCardSection
				items={creditCards}
				onToggle={toggleCreditCard}
				onEdit={editCreditCard}
				onDelete={deleteCreditCard}
				showAddButton={false}
			/>

			{/* Sección de Ahorros */}
			<SavingsSection
				items={savings}
				onToggle={toggleSavings}
				onEdit={editSavings}
				onDelete={deleteSavings}
				onPartialPayment={addPartialPayment}
				showAddButton={false}
			/>
		</div>
	);
}
