import React, { useState, useEffect } from 'react';
import { db, auth } from './config/firebase';
import { DEFAULT_USERS, HOSTELS } from './config/constants';
import { sendTelegramMessage } from './utils/telegram';
// FIX ISSUE #5 & #6: Import helper functions for Excel export and printing
import { exportToExcel, printCheck, printRegistrationForm, printReference } from './utils/helpers';

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
  
  // Hostel view state
  const [viewHostel, setViewHostel] = useState('hostel1');
  
  // Update viewHostel when user changes
  React.useEffect(() => {
    if (user) {
      const hostelId = user.hostelId === 'all' ? 'hostel1' : user.hostelId;
      setViewHostel(hostelId);
    }
  }, [user]);

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

  // FIX ISSUE #4: Permission Helpers with viewHostels/editHostels support
  const canViewHostel = (hostelId) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    // Use viewHostels array if available, otherwise fall back to hostelId
    const viewHostels = user.viewHostels || [user.hostelId];
    return viewHostels.includes(hostelId);
  };

  const canModifyHostel = (hostelId) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    // Use editHostels array if available, otherwise fall back to hostelId
    const editHostels = user.editHostels || [user.hostelId];
    return editHostels.includes(hostelId);
  };

  // FIX ISSUE #4: Check if current user is in read-only mode for current hostel
  const isReadOnly = () => {
    return !canModifyHostel(viewHostel);
  };

  // FIX ISSUE #4: Hostel Change Handler with permission check
  const handleHostelChange = (hostelId) => {
    if (!canViewHostel(hostelId)) {
      showNotification('У вас нет доступа к этому хостелу', 'error');
      return;
    }
    setViewHostel(hostelId);
    const hostelName = HOSTELS[hostelId]?.name || hostelId;
    const readOnlyMsg = !canModifyHostel(hostelId) ? ' (только просмотр)' : '';
    showNotification(`Переключено на ${hostelName}${readOnlyMsg}`, 'info');
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
    // Calculate balance (debt) with type coercion
    const totalPrice = parseFloat(guest.totalPrice) || 0;
    const paidAmount = parseFloat(guest.paidAmount) || 0;
    const balance = totalPrice - paidAmount;
    
    // Check if stay has expired (current date > checkOutDate)
    const checkOutDate = new Date(guest.checkOutDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);
    const isExpired = currentDate >= checkOutDate;
    
    // FIX ISSUE #1: Allow checkout if debt <= 0 OR if stay has expired (admin can checkout expired guests)
    // Block checkout only if guest has debt AND stay hasn't expired yet
    if (balance > 0 && !isExpired) {
      showNotification(`Ошибка! Долг: ${balance.toLocaleString()}. Невозможно выселить.`, 'error');
      return;
    }
    
    // If guest has debt but stay expired, allow checkout (debt will remain in system)
    if (balance > 0 && isExpired) {
      showNotification(`Внимание! Выселение с долгом ${balance.toLocaleString()}. Долг будет зафиксирован.`, 'warning');
      // Debt will be recorded in debts collection
    }
    
    // Calculate refund: use provided amount or calculate from overpayment
    const refund = checkoutData?.refundAmount || (balance < 0 ? Math.abs(balance) : 0);
    
    // TODO: Implement Firebase logic
    showNotification('Гость выселен', 'success');
    await sendTelegramMessage(`🚪 Выселение: ${guest.name || guest.fullName} из комнаты ${guest.room?.number || guest.roomNumber}. Возврат: ${refund.toLocaleString()}`);
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

  // FIX ISSUE #6: Print Handler using imported functions from helpers.js
  const handlePrint = (type, guest, hostel) => {
    try {
      if (type === 'check') {
        printCheck(guest, hostel);
      } else if (type === 'regcard') {
        printRegistrationForm(guest, hostel);
      } else if (type === 'reference') {
        printReference(guest, hostel);
      }
    } catch (error) {
      showNotification('Ошибка при печати: ' + error.message, 'error');
    }
  };

  // Report Handler
  const handleGenerateReport = (dateRange) => {
    // TODO: Implement report generation logic
    const reportData = {
      revenue: 1000000,
      expenses: 500000,
    };
    
    // FIX ISSUE #5: Use imported exportToExcel function
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
          canModifyHostel={canModifyHostel} // FIX ISSUE #4: Pass permission check function
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="container mx-auto p-6">
          {/* FIX ISSUE #4: Multi-hostel Switcher with Read-Only Indicator */}
          {user && user.viewHostels && user.viewHostels.length > 1 && (
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 rounded-lg border border-slate-300 overflow-hidden">
                  {user.viewHostels.map(hostelId => {
                    const hostelName = HOSTELS[hostelId]?.name || hostelId;
                    const canEdit = canModifyHostel(hostelId);
                    const icon = canEdit ? '✏️' : '👁️';
                    const label = canEdit ? 'Работа' : 'Просмотр';
                    
                    return (
                      <button 
                        key={hostelId}
                        onClick={() => handleHostelChange(hostelId)}
                        className={`px-6 py-3 font-medium transition-colors ${
                          viewHostel === hostelId 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {icon} {hostelName} ({label})
                      </button>
                    );
                  })}
                </div>
                
                {/* FIX ISSUE #4: Show read-only warning when user cannot edit current hostel */}
                {isReadOnly() && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                    <span>ℹ️</span>
                    <span>Только просмотр. Изменения доступны только в хостелах, где у вас есть права редактирования.</span>
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
                {/* FIX ISSUE #4: Disable add room button in read-only mode */}
                <button
                  onClick={() => setRoomFormModalOpen(true)}
                  disabled={isReadOnly()}
                  className={`px-4 py-2 rounded-xl ${
                    isReadOnly() 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title={isReadOnly() ? 'Только просмотр' : 'Добавить комнату'}
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
                {/* FIX ISSUE #4: Disable check-in button in read-only mode */}
                <button
                  onClick={() => setCheckInModalOpen(true)}
                  disabled={isReadOnly()}
                  className={`px-4 py-2 rounded-xl ${
                    isReadOnly() 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title={isReadOnly() ? 'Только просмотр' : 'Заселить гостя'}
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
        onCheckOut={!isReadOnly() ? handleCheckOut : null} // FIX ISSUE #4: Disable checkout in read-only mode
        onMove={!isReadOnly() ? (guest) => {
          setSelectedGuest(guest);
          setMoveGuestModalOpen(true);
        } : null} // FIX ISSUE #4: Disable move in read-only mode
        onPrint={handlePrint}
        hostelInfo={HOSTELS[viewHostel] || HOSTELS.hostel1}
        isReadOnly={isReadOnly()} // FIX ISSUE #4: Pass read-only flag
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
