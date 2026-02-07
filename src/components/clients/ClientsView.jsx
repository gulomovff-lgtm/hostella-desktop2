import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { inputClass } from '../../config/constants';

/**
 * Clients View component
 * @param {Object} props - ClientsView properties
 * @param {Array} props.clients - Array of client objects
 * @param {function} props.onClientClick - Client click handler
 * @param {function} props.onAddClient - Add client handler
 */
const ClientsView = ({ clients = [], onClientClick, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm) ||
    client.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Клиенты</h2>
        <Button onClick={onAddClient}>+ Добавить клиента</Button>
      </div>
      
      {/* Search */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClass}
          placeholder="Поиск по имени, телефону, стране..."
        />
      </div>
      
      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <Card
            key={client.id}
            hoverable
            onClick={() => onClientClick(client)}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span>📞</span>
                <span>{client.phone}</span>
              </p>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <span>🌍</span>
                <span>{client.country}</span>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">Визитов: {client.visitsCount || 0}</span>
                <span className="text-xs text-slate-500">Последний: {client.lastVisit || 'Н/Д'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-6xl mb-4">👥</p>
          <p>Клиенты не найдены</p>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
