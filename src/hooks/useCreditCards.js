import { useState, useEffect } from 'react';
import {
	saveToCSV,
	loadFromCSV,
	propagateToFutureMonths,
	propagateDeletionToFutureMonths
} from '../utils/dataUtils';

const useCreditCards = (currentMonth, currentYear) => {
	// Estado local
	const [creditCards, setCreditCards] = useState([]);

	// Cargar datos cuando cambia el mes o año
	useEffect(() => {
		// Cargar tarjetas de crédito
		const savedCredit = loadFromCSV('credit', currentMonth, currentYear);
		if (savedCredit) setCreditCards(savedCredit);
		else setCreditCards([]);
	}, [currentMonth, currentYear]);

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
		// Guardar el nombre de la tarjeta antes de eliminarla
		const deletedItemName = creditCards[index].name;

		// Eliminar la tarjeta del mes actual
		const updated = creditCards.filter((_, i) => i !== index);
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);

		// Propagar la eliminación a meses futuros
		propagateDeletionToFutureMonths('credit', currentMonth, currentYear, deletedItemName);
	};

	const toggleCreditCard = (index) => {
		const updated = [...creditCards];
		updated[index].paid = !updated[index].paid;
		setCreditCards(updated);
		saveToCSV('credit', currentMonth, currentYear, updated);
	};

	// Retornar estado y funciones
	return {
		creditCards,
		addCreditCard,
		editCreditCard,
		deleteCreditCard,
		toggleCreditCard
	};
};

export default useCreditCards;
