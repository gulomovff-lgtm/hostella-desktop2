import React from 'react';
import Button from '../ui/Button';
import { formatDateDisplay, formatCurrency } from '../../utils/helpers';

/**
 * Guest Details Modal component
 * @param {Object} props - GuestDetailsModal properties
 * @param {Object} props.guest - Guest data object
 * @param {boolean} props.isOpen - Modal open state
 * @param {function} props.onClose - Close handler
 * @param {function} props.onCheckOut - Check-out handler
 * @param {function} props.onMove - Move guest handler
 * @param {function} props.onPrint - Print handler (for check, regcard, reference)
 * @param {Object} props.hostelInfo - Hostel information for printing
 * @param {boolean} props.isReadOnly - Whether user is in read-only mode (FIX ISSUE #4)
 */
const GuestDetailsModal = ({ guest, isOpen, onClose, onCheckOut, onMove, onPrint, hostelInfo, isReadOnly }) => {
  if (!isOpen || !guest) return null;
  
  const {
    name,
    phone,
    country,
    passportNumber,
    room,
    checkInDate,
    checkOutDate,
    pricePerNight,
    totalPrice,
    paidAmount,
    debt,
    notes,
  } = guest;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Информация о госте</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Личные данные</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Имя</p>
                <p className="font-semibold text-slate-800">{name}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Телефон</p>
                <p className="font-semibold text-slate-800">{phone}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Страна</p>
                <p className="font-semibold text-slate-800">{country}</p>
              </div>
              {passportNumber && (
                <div>
                  <p className="text-slate-500 mb-1">Паспорт</p>
                  <p className="font-semibold text-slate-800">{passportNumber}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Информация о бронировании</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Комната</p>
                <p className="font-semibold text-slate-800">№{room?.number}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Цена за ночь</p>
                <p className="font-semibold text-slate-800">{formatCurrency(pricePerNight)}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Дата заселения</p>
                <p className="font-semibold text-slate-800">{formatDateDisplay(checkInDate)}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Дата выселения</p>
                <p className="font-semibold text-slate-800">{formatDateDisplay(checkOutDate)}</p>
              </div>
            </div>
          </div>
          
          {/* Financial Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Финансы</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-slate-500 mb-1">Всего</p>
                <p className="font-bold text-blue-600 text-lg">{formatCurrency(totalPrice)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-slate-500 mb-1">Оплачено</p>
                <p className="font-bold text-green-600 text-lg">{formatCurrency(paidAmount)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-slate-500 mb-1">Долг</p>
                <p className="font-bold text-red-600 text-lg">{formatCurrency(debt)}</p>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {notes && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Примечания</h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">{notes}</p>
            </div>
          )}
          
          {/* Print Options */}
          {onPrint && hostelInfo && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Печать документов</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" onClick={() => onPrint('check', guest, hostelInfo)}>
                  🧾 Чек
                </Button>
                <Button variant="outline" onClick={() => onPrint('regcard', guest, hostelInfo)}>
                  📋 Анкета
                </Button>
                <Button variant="outline" onClick={() => onPrint('reference', guest, hostelInfo)}>
                  📄 Справка
                </Button>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Закрыть
            </Button>
            {/* FIX ISSUE #4: Show move and checkout buttons only if user has edit permissions */}
            {onMove && !isReadOnly && (
              <Button variant="outline" onClick={() => onMove(guest)} className="flex-1">
                Переселить
              </Button>
            )}
            {onCheckOut && !isReadOnly && (
              <Button variant="danger" onClick={() => onCheckOut(guest)} className="flex-1">
                Выселить
              </Button>
            )}
            {isReadOnly && (
              <div className="flex-1 flex items-center justify-center text-amber-600 text-sm font-medium">
                <span>🔒 Только просмотр</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsModal;
