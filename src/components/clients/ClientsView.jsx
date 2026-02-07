import React, { useState, useMemo } from 'react';
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
  const [pagination, setPagination] = useState({ page: 1, perPage: 25 });
  const [countryFilter, setCountryFilter] = useState('');
  
  // Get unique countries from clients
  const uniqueCountries = useMemo(() => {
    const countries = new Set(clients.map(c => c.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [clients]);
  
  // Optimized filtering with useMemo
  const filteredClients = useMemo(() => {
    let result = clients;
    
    // Apply country filter
    if (countryFilter) {
      result = result.filter(c => c.country === countryFilter);
    }
    
    // Apply search filter (only if search term has more than 1 character)
    if (searchTerm.length > 1) {
      const s = searchTerm.toLowerCase();
      result = result.filter(client => 
        (client.name || '').toLowerCase().includes(s) ||
        (client.phone || '').includes(s) ||
        (client.passportNumber || '').toLowerCase().includes(s)
      );
    }
    
    return result;
  }, [clients, searchTerm, countryFilter]);
  
  // Paginate results
  const totalPages = Math.ceil(filteredClients.length / pagination.perPage);
  const paginatedClients = filteredClients.slice(
    (pagination.page - 1) * pagination.perPage,
    pagination.page * pagination.perPage
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Клиенты</h2>
        <Button onClick={onAddClient}>+ Добавить клиента</Button>
      </div>
      
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClass}
            placeholder="Поиск по имени, телефону, паспорту..."
          />
        </div>
        <div>
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className={inputClass}
          >
            <option value="">Все страны</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Results count and per-page selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Показано {paginatedClients.length} из {filteredClients.length} клиентов
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Показать:</span>
          {[25, 50, 100].map(count => (
            <button
              key={count}
              onClick={() => setPagination({ page: 1, perPage: count })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                pagination.perPage === count
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedClients.map(client => (
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Предыдущая
          </button>
          <span className="px-4 py-2 text-sm text-slate-600">
            Страница {pagination.page} из {totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, page: Math.min(totalPages, pagination.page + 1) })}
            disabled={pagination.page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Следующая →
          </button>
        </div>
      )}
      
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
