import React, { useState, useEffect } from 'react';
import { db, auth } from './config/firebase';
import { DEFAULT_USERS, HOSTELS } from './config/constants';
import { sendTelegramMessage } from './utils/telegram';

// Layout Components
import LoginScreen from './components/layout/LoginScreen';
import Navigation from './components/layout/Navigation';
import MobileNavigation from './components/layout/MobileNavigation';

// UI Components
import Notification from './components/ui/Notification';

// Dashboard Components
import DashboardStats from './components/dashboard/DashboardStats';
import ChartsSection from './components/dashboard/ChartsSection';

// Room Components
import RoomCardChess from './components/rooms/RoomCardChess';
import RoomFormModal from './components/rooms/RoomFormModal';

// Calendar Components
import CalendarView from './components/calendar/CalendarView';

// Guest Components
import CheckInModal from './components/guests/CheckInModal';
import GuestDetailsModal from './components/guests/GuestDetailsModal';
import MoveGuestModal from './components/guests/MoveGuestModal';

// Client Components
import ClientsView from './components/clients/ClientsView';
import ClientEditModal from './components/clients/ClientEditModal';
import ClientImportModal from './components/clients/ClientImportModal';
import ClientHistoryModal from './components/clients/ClientHistoryModal';

// Debt Components
import DebtsView from './components/debts/DebtsView';
import CreateDebtModal from './components/debts/CreateDebtModal';

// Reports Components
import ReportsView from './components/reports/ReportsView';

// Task Components
import TaskManager from './components/tasks/TaskManager';

// Shift Components
import ShiftsView from './components/shifts/ShiftsView';
import ShiftClosingModal from './components/shifts/ShiftClosingModal';
import ShiftBlockScreen from './components/shifts/ShiftBlockScreen';

// Expense Components
import ExpenseModal from './components/expenses/ExpenseModal';

// Staff Components
import StaffView from './components/staff/StaffView';
import ChangePasswordModal from './components/staff/ChangePasswordModal';

/**
 * Main App Component
 * Orchestrates all application state and routing
 */
function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Notification State
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  // Modal States
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [guestDetailsModalOpen, setGuestDetailsModalOpen] = useState(false);
  const [moveGuestModalOpen, setMoveGuestModalOpen] = useState(false);
  const [roomFormModalOpen, setRoomFormModalOpen] = useState(false);
  const [clientEditModalOpen, setClientEditModalOpen] = useState(false);
  const [clientImportModalOpen, setClientImportModalOpen] = useState(false);
  const [clientHistoryModalOpen, setClientHistoryModalOpen] = useState(false);
  const [createDebtModalOpen, setCreateDebtModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [shiftClosingModalOpen, setShiftClosingModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  // Data State (placeholder - will be connected to Firebase)
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [clients, setClients] = useState([]);
  const [debts, setDebts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [staff, setStaff] = useState(DEFAULT_USERS);

  // Selected items for modals
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Hostel view for Fazliddin
  const [viewHostel, setViewHostel] = useState(() => {
    // Initialize based on user's hostelId, default to hostel1 if not set
    if (!user) return 'hostel1';
    return user.hostelId === 'all' ? 'hostel1' : user.hostelId;
  });

  // Authentication Handlers
  const handleLogin = async (login, password) => {
    // Simple authentication logic
    const foundUser = DEFAULT_USERS.find(
      u => u.login === login && u.pass === password
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      showNotification('Успешный вход!', 'success');
      
      // Send Telegram notification
      await sendTelegramMessage(`✅ Вход: ${foundUser.name} (${foundUser.role})`);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await sendTelegramMessage(`🚪 Выход: ${user?.name}`);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTab('dashboard');
    showNotification('Вы вышли из системы', 'info');
  };

  // Notification Helper
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // Permission Helpers
  const canViewHostel = (hostelId) => {
    if (user?.role === 'admin') return true;
    if (user?.login === 'fazliddin') return true; // Can view all hostels
    return user?.hostelId === hostelId;
  };

  const canModifyHostel = (hostelId) => {
    if (user?.role === 'admin') return true;
    if (user?.login === 'fazliddin' && hostelId === 'hostel2') return true; // Can only modify hostel2
    return user?.hostelId === hostelId && user?.role === 'cashier';
  };

  // Hostel Change Handler
  const handleHostelChange = (hostelId) => {
    setViewHostel(hostelId);
    showNotification(`Переключено на ${hostelId === 'hostel1' ? 'Хостел №1' : 'Хостел №2'}`, 'info');
  };

  // Tab Change Handler
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  // Guest Handlers
  const handleCheckIn = async (guestData) => {
    // TODO: Implement Firebase logic
    showNotification('Гость успешно заселен', 'success');
    await sendTelegramMessage(`🏠 Заселение: ${guestData.name} в комнату ${guestData.roomId}`);
  };

  const handleCheckOut = async (guest, checkoutData) => {
    // Calculate balance (debt)
    const balance = (guest.totalPrice || 0) - (guest.paidAmount || 0);
    
    // Block checkout if guest has debt (balance > 0 means they owe money)
    // Allow checkout when balance <= 0 (fully paid or overpaid)
    if (balance > 0) {
      showNotification(`Ошибка! Долг: ${balance}. Невозможно выселить.`, 'error');
      return;
    }
    
    // Calculate refund for overpayment (when balance is negative)
    const calculateRefund = (bal) => bal < 0 ? Math.abs(bal) : 0;
    const refund = checkoutData?.refundAmount || calculateRefund(balance);
    
    // TODO: Implement Firebase logic
    showNotification('Гость выселен', 'success');
    await sendTelegramMessage(`🚪 Выселение: ${guest.name || guest.fullName} из комнаты ${guest.room?.number || guest.roomNumber}. Возврат: ${refund}`);
  };

  const handleMoveGuest = async (guestId, newRoomId) => {
    // TODO: Implement Firebase logic
    showNotification('Гость переселен', 'success');
  };

  // Room Handlers
  const handleSaveRoom = (roomData) => {
    // TODO: Implement Firebase logic
    showNotification('Комната сохранена', 'success');
  };

  // Client Handlers
  const handleSaveClient = (clientData) => {
    // TODO: Implement Firebase logic
    showNotification('Клиент сохранен', 'success');
  };

  const handleImportClients = (file) => {
    // TODO: Implement import logic
    showNotification('Клиенты импортированы', 'success');
  };

  // Debt Handlers
  const handleCreateDebt = (debtData) => {
    // TODO: Implement Firebase logic
    showNotification('Долг добавлен', 'success');
  };

  const handlePayDebt = (debt) => {
    // TODO: Implement Firebase logic
    showNotification('Долг оплачен', 'success');
  };

  // Task Handlers
  const handleAddTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText, completed: false };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Shift Handlers
  const handleOpenShift = async () => {
    const shift = {
      id: Date.now(),
      employeeName: user?.name,
      startTime: new Date(),
      startBalance: 0,
      currentBalance: 0,
    };
    setCurrentShift(shift);
    showNotification('Смена открыта', 'success');
    await sendTelegramMessage(`⏰ Открыта смена: ${user?.name}`);
  };

  const handleCloseShift = (closingData) => {
    // TODO: Implement Firebase logic
    setShifts([...shifts, { ...currentShift, ...closingData }]);
    setCurrentShift(null);
    showNotification('Смена закрыта', 'success');
  };

  // Expense Handler
  const handleAddExpense = (expenseData) => {
    // TODO: Implement Firebase logic
    showNotification('Расход добавлен', 'success');
  };

  // Staff Handlers
  const handleAddStaff = () => {
    // TODO: Implement add staff logic
    showNotification('Сотрудник добавлен', 'success');
  };

  const handleEditStaff = (staffMember) => {
    // TODO: Implement edit staff logic
    setSelectedStaff(staffMember);
  };

  const handleChangePassword = (staffId, newPassword) => {
    // TODO: Implement password change logic
    showNotification('Пароль изменен', 'success');
  };

  // Excel Export Function
  const exportToExcel = (data, filename, totalIncome = 0, totalExpense = 0) => {
    const balance = totalIncome - totalExpense;
    let tableContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #4f46e5; color: #fff; font-weight: bold; }
          .total-row { background-color: #f3f4f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>`;
    
    // Add headers
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        tableContent += `<th>${key}</th>`;
      });
      tableContent += `</tr></thead><tbody>`;
      
      // Add data rows
      data.forEach(row => {
        tableContent += `<tr>`;
        Object.values(row).forEach(value => {
          tableContent += `<td>${value}</td>`;
        });
        tableContent += `</tr>`;
      });
    }
    
    // Add totals if provided
    if (totalIncome || totalExpense) {
      const colCount = data.length > 0 ? Object.keys(data[0]).length : 5;
      tableContent += `
        <tr class="total-row">
          <td colspan="${colCount - 1}">ИТОГО ПРИХОД:</td>
          <td>${totalIncome.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="${colCount - 1}">ИТОГО РАСХОД:</td>
          <td>${totalExpense.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="${colCount - 1}">БАЛАНС:</td>
          <td>${balance.toLocaleString()}</td>
        </tr>`;
    }
    
    tableContent += `</tbody></table></body></html>`;
    
    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showNotification('Отчет экспортирован', 'success');
  };

  // Print Functions
  const printCheck = (guest, hostel) => {
    const w = window.open('', '', 'width=400,height=600');
    const getTotalPaid = (g) => g.paidAmount || 0;
    
    w.document.write(`
      <html>
      <head>
        <title>Чек оплаты</title>
        <style>
          body { font-family: monospace; width: 300px; padding: 10px; }
          .center { text-align: center; }
          .line { border-bottom: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="center">
          <h2>${hostel.name}</h2>
          <p>${hostel.address}</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>Дата:</span><span>${new Date().toLocaleString()}</span></div>
        <div class="row"><span>Гость:</span><span>${guest.name}</span></div>
        <div class="row"><span>Паспорт:</span><span>${guest.passportNumber || 'Н/Д'}</span></div>
        <div class="line"></div>
        <div class="row"><span>Комната:</span><span>${guest.room?.number || 'Н/Д'}</span></div>
        <div class="row"><span>Дней:</span><span>${guest.days || 'Н/Д'}</span></div>
        <div class="row"><span>Цена/ночь:</span><span>${guest.pricePerNight || 0}</span></div>
        <div class="line"></div>
        <div class="row"><b>ИТОГО:</b><b>${guest.totalPrice || 0}</b></div>
        <div class="row"><span>Оплачено:</span><span>${getTotalPaid(guest)}</span></div>
        <div class="row"><span>Долг:</span><span>${(guest.totalPrice || 0) - getTotalPaid(guest)}</span></div>
        <div class="line"></div>
        <div class="center"><small>Спасибо за визит!</small></div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  const printRegistrationForm = (guest, hostel) => {
    const w = window.open('', '', 'width=800,height=600');
    w.document.write(`
      <html>
      <head>
        <title>Регистрационная анкета</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .field { margin: 15px 0; border-bottom: 1px solid #000; padding: 5px 0; }
          .label { font-weight: bold; display: inline-block; width: 200px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>РЕГИСТРАЦИОННАЯ АНКЕТА ГОСТЯ</h2>
          <p>${hostel.name} • ${hostel.address}</p>
        </div>
        <div class="field"><span class="label">ФИО:</span> ${guest.name}</div>
        <div class="field"><span class="label">Паспорт:</span> ${guest.passportNumber || 'Н/Д'}</div>
        <div class="field"><span class="label">Дата рождения:</span> ${guest.birthDate || 'Н/Д'}</div>
        <div class="field"><span class="label">Гражданство:</span> ${guest.country || 'Н/Д'}</div>
        <div class="field"><span class="label">Комната:</span> ${guest.room?.number || 'Н/Д'}</div>
        <div class="field"><span class="label">Дата заселения:</span> ${new Date(guest.checkInDate).toLocaleDateString()}</div>
        <div class="field"><span class="label">Дата выселения:</span> ${new Date(guest.checkOutDate).toLocaleDateString()}</div>
        <div class="field"><span class="label">Подпись гостя:</span> ________________</div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  const printReference = (guest, hostel) => {
    const w = window.open('', '', 'width=800,height=600');
    w.document.write(`
      <html>
      <head>
        <title>Справка о проживании</title>
        <style>
          body { font-family: 'Times New Roman'; padding: 60px; line-height: 1.8; }
          .header { text-align: center; margin-bottom: 40px; }
          .content { text-indent: 40px; text-align: justify; }
          .signature { margin-top: 60px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>СПРАВКА</h2>
          <p>о проживании в ${hostel.name}</p>
        </div>
        <div class="content">
          <p>Настоящая справка выдана ${guest.name}, паспорт ${guest.passportNumber || 'Н/Д'}, 
          гражданин(ка) ${guest.country || 'Н/Д'}, в том, что он(а) действительно проживал(а) 
          в ${hostel.name} по адресу: ${hostel.address}, в период с 
          ${new Date(guest.checkInDate).toLocaleDateString()} по 
          ${new Date(guest.checkOutDate).toLocaleDateString()}.</p>
          
          <p>Справка выдана для предъявления по месту требования.</p>
        </div>
        <div class="signature">
          <div>Дата: ${new Date().toLocaleDateString()}</div>
          <div>Подпись: ________________</div>
        </div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  // Print Handler
  const handlePrint = (type, guest, hostel) => {
    if (type === 'check') printCheck(guest, hostel);
    if (type === 'regcard') printRegistrationForm(guest, hostel);
    if (type === 'reference') printReference(guest, hostel);
  };

  // Report Handler
  const handleGenerateReport = (dateRange) => {
    // TODO: Implement report generation logic
    const reportData = {
      revenue: 1000000,
      expenses: 500000,
    };
    
    // Example of calling export
    // exportToExcel(data, filename, totalIncome, totalExpense)
    
    return reportData;
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Main App Render
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          user={user}
          onLogout={handleLogout}
          viewHostel={viewHostel}
          onHostelChange={handleHostelChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="container mx-auto p-6">
          {/* Fazliddin Hostel Switcher */}
          {user?.login === 'fazliddin' && (
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 rounded-lg border border-slate-300 overflow-hidden">
                  <button 
                    onClick={() => setViewHostel('hostel1')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      viewHostel === 'hostel1' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    👁️ Хостел №1 (Просмотр)
                  </button>
                  <button 
                    onClick={() => setViewHostel('hostel2')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      viewHostel === 'hostel2' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ✏️ Хостел №2 (Работа)
                  </button>
                </div>
                
                {viewHostel === 'hostel1' && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                    <span>ℹ️</span>
                    <span>Только просмотр. Изменения доступны только в Хостеле №2</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Dashboard */}
          {currentTab === 'dashboard' && (
            <>
              <DashboardStats
                stats={{
                  totalRooms: rooms.length,
                  occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
                  availableRooms: rooms.filter(r => r.status === 'available').length,
                  totalGuests: guests.length,
                  todayCheckIns: 0,
                  todayCheckOuts: 0,
                  totalRevenue: 0,
                  pendingDebts: debts.reduce((sum, d) => sum + d.amount, 0),
                }}
              />
              <ChartsSection revenueData={[]} occupancyData={[]} />
            </>
          )}

          {/* Rooms */}
          {currentTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Комнаты</h2>
                <button
                  onClick={() => setRoomFormModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  + Добавить комнату
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rooms.map(room => (
                  <RoomCardChess
                    key={room.id}
                    room={room}
                    onClick={() => setSelectedRoom(room)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          {currentTab === 'calendar' && (
            <CalendarView 
              bookings={guests} 
              rooms={rooms}
              onGuestClick={(guest) => {
                setSelectedGuest(guest);
                setGuestDetailsModalOpen(true);
              }} 
            />
          )}

          {/* Guests */}
          {currentTab === 'guests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Гости</h2>
                <button
                  onClick={() => setCheckInModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  + Заселить гостя
                </button>
              </div>
              {/* Guest list would go here */}
            </div>
          )}

          {/* Clients */}
          {currentTab === 'clients' && (
            <ClientsView
              clients={clients}
              onClientClick={(client) => {
                setSelectedClient(client);
                setClientHistoryModalOpen(true);
              }}
              onAddClient={() => setClientEditModalOpen(true)}
            />
          )}

          {/* Debts */}
          {currentTab === 'debts' && (
            <DebtsView
              debts={debts}
              onCreateDebt={() => setCreateDebtModalOpen(true)}
              onPayDebt={handlePayDebt}
            />
          )}

          {/* Reports */}
          {currentTab === 'reports' && (
            <ReportsView 
              onGenerateReport={handleGenerateReport}
              onExportExcel={exportToExcel}
            />
          )}

          {/* Tasks */}
          {currentTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* Shifts */}
          {currentTab === 'shifts' && (
            <ShiftsView
              currentShift={currentShift}
              shifts={shifts}
              onOpenShift={handleOpenShift}
              onCloseShift={() => setShiftClosingModalOpen(true)}
            />
          )}

          {/* Expenses */}
          {currentTab === 'expenses' && user?.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Расходы</h2>
                <button
                  onClick={() => setExpenseModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  + Добавить расход
                </button>
              </div>
              {/* Expenses list would go here */}
            </div>
          )}

          {/* Staff */}
          {currentTab === 'staff' && user?.role === 'admin' && (
            <StaffView
              staff={staff}
              onAddStaff={handleAddStaff}
              onEditStaff={handleEditStaff}
              onChangePassword={(staffMember) => {
                setSelectedStaff(staffMember);
                setChangePasswordModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          user={user}
        />
      </div>

      {/* Modals */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        onCheckIn={handleCheckIn}
        availableRooms={rooms.filter(r => r.status === 'available')}
      />

      <GuestDetailsModal
        guest={selectedGuest}
        isOpen={guestDetailsModalOpen}
        onClose={() => {
          setGuestDetailsModalOpen(false);
          setSelectedGuest(null);
        }}
        onCheckOut={handleCheckOut}
        onMove={(guest) => {
          setSelectedGuest(guest);
          setMoveGuestModalOpen(true);
        }}
        onPrint={handlePrint}
        hostelInfo={HOSTELS[viewHostel] || HOSTELS.hostel1}
      />

      <MoveGuestModal
        guest={selectedGuest}
        isOpen={moveGuestModalOpen}
        onClose={() => setMoveGuestModalOpen(false)}
        onMove={handleMoveGuest}
        availableRooms={rooms.filter(r => r.status === 'available')}
      />

      <RoomFormModal
        room={selectedRoom}
        isOpen={roomFormModalOpen}
        onClose={() => {
          setRoomFormModalOpen(false);
          setSelectedRoom(null);
        }}
        onSave={handleSaveRoom}
      />

      <ClientEditModal
        client={selectedClient}
        isOpen={clientEditModalOpen}
        onClose={() => {
          setClientEditModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={handleSaveClient}
      />

      <ClientImportModal
        isOpen={clientImportModalOpen}
        onClose={() => setClientImportModalOpen(false)}
        onImport={handleImportClients}
      />

      <ClientHistoryModal
        client={selectedClient}
        isOpen={clientHistoryModalOpen}
        onClose={() => {
          setClientHistoryModalOpen(false);
          setSelectedClient(null);
        }}
      />

      <CreateDebtModal
        isOpen={createDebtModalOpen}
        onClose={() => setCreateDebtModalOpen(false)}
        onSave={handleCreateDebt}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleAddExpense}
      />

      <ShiftClosingModal
        shift={currentShift}
        isOpen={shiftClosingModalOpen}
        onClose={() => setShiftClosingModalOpen(false)}
        onConfirm={handleCloseShift}
      />

      <ChangePasswordModal
        staff={selectedStaff}
        isOpen={changePasswordModalOpen}
        onClose={() => {
          setChangePasswordModalOpen(false);
          setSelectedStaff(null);
        }}
        onSave={handleChangePassword}
      />

      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App;
