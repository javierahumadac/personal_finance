// Utilidades para manejo de datos

// Guardar datos en CSV
// En una implementación real, esto escribiría en un archivo CSV
export const saveToCSV = (type, month, year, data) => {
	console.log(`Guardando ${type} para ${month}/${year}:`, data);
	localStorage.setItem(`finance-${type}-${month}-${year}`, JSON.stringify(data));
};

// Cargar datos desde CSV
// En una implementación real, esto leería de un archivo CSV
export const loadFromCSV = (type, month, year) => {
	const data = localStorage.getItem(`finance-${type}-${month}-${year}`);
	return data ? JSON.parse(data) : null;
};

// Propagar datos recurrentes a meses futuros
export const propagateToFutureMonths = (type, currentMonth, currentYear, data) => {
	// Obtener fecha actual
	const now = new Date();
	const thisMonth = now.getMonth();
	const thisYear = now.getFullYear();

	// Solo propagar si estamos en el mes actual o anterior
	if (currentYear > thisYear || (currentYear === thisYear && currentMonth > thisMonth)) {
		return;
	}

	// Para los próximos 12 meses
	for (let i = 1; i <= 12; i++) {
		let futureMonth = (currentMonth + i) % 12;
		let futureYear = currentYear + Math.floor((currentMonth + i) / 12);

		// No propagar más allá de "ahora + 1 año"
		if (futureYear > thisYear + 1 || (futureYear === thisYear + 1 && futureMonth > thisMonth)) {
			break;
		}

		// Cargar datos existentes para este mes futuro
		let existingData = loadFromCSV(type, futureMonth, futureYear) || [];

		// Para tarjetas de crédito y ahorros, necesitamos aumentar la cuota actual / mes actual
		let updatedData = [];
		if (type === 'credit' || type === 'savings') {
			updatedData = data.map(item => {
				// Clonar el item
				const newItem = { ...item };

				// Solo propagar si no está completado
				if (type === 'credit' && (newItem.currentInstallment < newItem.installments)) {
					// Ajustamos el número de cuota para el mes futuro
					newItem.currentInstallment = Math.min(parseInt(item.currentInstallment) + i, parseInt(item.installments));
					newItem.paid = false;
					return newItem;
				}
				else if (type === 'savings' && (newItem.currentMonth < newItem.totalMonths)) {
					// Ajustamos el número de mes para el mes futuro
					newItem.currentMonth = Math.min(parseInt(item.currentMonth) + i, parseInt(item.totalMonths));
					newItem.paid = false;
					return newItem;
				}
				return null;
			}).filter(item => item !== null);
		}
		else if (type === 'recurring') {
			// Para gastos recurrentes, solo los propagamos con paid = false
			updatedData = data.map(item => {
				const newItem = { ...item, paid: false };
				return newItem;
			});
		}

		// Fusionar con datos existentes
		// Primero eliminamos los items existentes con el mismo nombre
		const namesInNewData = updatedData.map(item => item.name);

		// Filtramos los items existentes que coinciden con nombres en los datos nuevos
		let filteredExisting = existingData;
		if (namesInNewData.length > 0) {
			filteredExisting = existingData.filter(item => !namesInNewData.includes(item.name));
		}

		// Unimos los datos
		const mergedData = [...filteredExisting, ...updatedData];

		// Guardar para el mes futuro
		saveToCSV(type, futureMonth, futureYear, mergedData);
	}
};
