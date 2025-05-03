import React from 'react';
import {
	PiggyBank,
	CreditCard,
	ShoppingCart,
	CalendarSync,
	Banknote,
	SquareX
} from 'lucide-react';

const RadialMenu = ({ isOpen, onSelectOption, onClose }) => {
	if (!isOpen) return null;

	const menuItems = [
		{ icon: Banknote, label: 'Ingresos', action: 'income', angle: 180 },
		{ icon: CalendarSync, label: 'Gastos recurrentes', action: 'recurring', angle: 157.5 },
		{ icon: ShoppingCart, label: 'Gastos mensuales', action: 'monthly', angle: 135 },
		{ icon: CreditCard, label: 'Tarjeta de crédito', action: 'credit', angle: 112.5 },
		{ icon: PiggyBank, label: 'Ahorros', action: 'savings', angle: 90 }
	];

	const radius = 145; // Radio del menú aumentado para mejor visualización

	const calculatePosition = (angle) => {
		const radian = (angle * Math.PI) / 180;
		const x = Math.cos(radian) * radius;
		const y = Math.sin(radian) * radius;
		return { x, y };
	};

	return (
		<div
			className="fixed inset-0 z-40"
			onClick={onClose}
		>
			{menuItems.map((item) => {
				const { x, y } = calculatePosition(item.angle);
				return (
					<button
						key={item.action}
						onClick={(e) => {
							e.stopPropagation();
							onSelectOption(item.action);
						}}
						className="absolute bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-all duration-200 transform hover:scale-110 shadow-lg z-50"
						style={{
							bottom: `${10 + y}px`,
							right: `${10 - x}px`,
							animation: `fadeInScale 0.2s ease-out ${menuItems.indexOf(item) * 0.05}s forwards`,
							opacity: 0,
							transform: 'scale(0)'
						}}
						title={item.label}
					>
						<item.icon size={24} />
					</button>
				);
			})}
			<style jsx>{`
                @keyframes fadeInScale {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
		</div>
	);
};

export default RadialMenu;
