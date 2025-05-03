import React from 'react';
import { X } from 'lucide-react';

const FloatingModal = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-slideUp">
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button
						onClick={onClose}
						className="p-1 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>
				<div className="p-4">
					{children}
				</div>
			</div>

			<style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.2s ease-out forwards;
                }
            `}</style>
		</div>
	);
};

export default FloatingModal;
