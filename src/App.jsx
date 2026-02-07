import React, { useState, useEffect } from 'react';
import { db, auth } from './config/firebase';
import { DEFAULT_USERS } from './config/constants';
import { sendTelegramMessage } from './utils/telegram';

// Layout Components
import LoginScreen from './components/layout/LoginScreen';
import Navigation from './components/layout/Navigation';
import MobileNavigation from './components/layout/MobileNavigation';

// UI Components
import Notification from './components/ui/Notification';

// View Components
import DashboardView from './components/Views/DashboardView';
import RoomsView from './components/Views/RoomsView';
import ExpensesView from './components/Views/ExpensesView';
import TasksView from './components/Views/TasksView';

// Room Components
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
// (Now using TasksView which wraps TaskManager)

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

  const handleCheckOut = async (guest) => {
    // TODO: Implement Firebase logic
    showNotification('Гость выселен', 'success');
    await sendTelegramMessage(`🚪 Выселение: ${guest.name} из комнаты ${guest.room?.number}`);
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

  // Report Handler
  const handleGenerateReport = (dateRange) => {
    // TODO: Implement report generation logic
    return {
      revenue: 1000000,
      expenses: 500000,
    };
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
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="container mx-auto p-6">
          {/* Dashboard */}
          {currentTab === 'dashboard' && (
            <DashboardView
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
              revenueData={[]}
              occupancyData={[]}
            />
          )}

          {/* Rooms */}
          {currentTab === 'rooms' && (
            <RoomsView
              rooms={rooms}
              onRoomClick={(room) => setSelectedRoom(room)}
              onAddRoom={() => setRoomFormModalOpen(true)}
            />
          )}

          {/* Calendar */}
          {currentTab === 'calendar' && (
            <CalendarView bookings={guests} onDateClick={(date) => console.log(date)} />
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
            <ReportsView onGenerateReport={handleGenerateReport} />
          )}

          {/* Tasks */}
          {currentTab === 'tasks' && (
            <TasksView
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
            <ExpensesView
              expenses={expenses}
              onAddExpense={() => setExpenseModalOpen(true)}
            />
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
