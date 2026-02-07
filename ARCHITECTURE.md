# Hostella Application Architecture

## Overview
A modular React application for hostel management with Firebase backend and Telegram notifications.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx (538 lines)                      │
│                      Main Application Coordinator                 │
│                                                                   │
│  - Authentication State                                          │
│  - Navigation State                                              │
│  - Modal Management                                              │
│  - Data State (rooms, guests, clients, etc.)                    │
│  - Event Handlers                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ imports & orchestrates
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Config      │    │    Utils      │    │  Components   │
│               │    │               │    │               │
│ • firebase    │    │ • helpers     │    │ • ui/         │
│ • constants   │    │ • telegram    │    │ • layout/     │
│ • translations│    │               │    │ • dashboard/  │
│               │    │               │    │ • rooms/      │
└───────────────┘    └───────────────┘    │ • calendar/   │
                                           │ • guests/     │
                                           │ • clients/    │
                                           │ • debts/      │
                                           │ • reports/    │
                                           │ • tasks/      │
                                           │ • shifts/     │
                                           │ • expenses/   │
                                           │ • staff/      │
                                           └───────────────┘
```

## Data Flow

```
┌──────────────┐
│    User      │
│  Interaction │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   App.jsx    │ ◄─── State Management
│  (Handler)   │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  Firebase   │   │  Telegram   │
│  Firestore  │   │     Bot     │
└─────┬───────┘   └─────────────┘
      │
      │ Update
      ▼
┌─────────────┐
│  Component  │
│  Re-render  │
└─────────────┘
```

## Component Hierarchy

```
App
├── LoginScreen (when not authenticated)
│
└── Main Application (when authenticated)
    ├── Navigation (Desktop)
    │   └── NavItem (multiple)
    │
    ├── MobileNavigation (Mobile)
    │
    ├── Content Area
    │   ├── Dashboard Tab
    │   │   ├── DashboardStats
    │   │   │   └── Card (multiple)
    │   │   └── ChartsSection
    │   │       └── Card (multiple)
    │   │
    │   ├── Rooms Tab
    │   │   └── RoomCardChess (multiple)
    │   │
    │   ├── Calendar Tab
    │   │   └── CalendarView
    │   │
    │   ├── Guests Tab
    │   │   └── Guest List
    │   │
    │   ├── Clients Tab
    │   │   └── ClientsView
    │   │       └── Card (multiple)
    │   │
    │   ├── Debts Tab
    │   │   └── DebtsView
    │   │       └── Card (multiple)
    │   │
    │   ├── Reports Tab
    │   │   └── ReportsView
    │   │       └── Card (multiple)
    │   │
    │   ├── Tasks Tab
    │   │   └── TaskManager
    │   │       └── Card (multiple)
    │   │
    │   ├── Shifts Tab
    │   │   └── ShiftsView
    │   │       └── Card (multiple)
    │   │
    │   ├── Expenses Tab (Admin)
    │   │   └── Expense List
    │   │
    │   └── Staff Tab (Admin)
    │       └── StaffView
    │           └── Card (multiple)
    │
    ├── Modals (Conditional Rendering)
    │   ├── CheckInModal
    │   ├── GuestDetailsModal
    │   ├── MoveGuestModal
    │   ├── RoomFormModal
    │   ├── ClientEditModal
    │   ├── ClientImportModal
    │   ├── ClientHistoryModal
    │   ├── CreateDebtModal
    │   ├── ExpenseModal
    │   ├── ShiftClosingModal
    │   └── ChangePasswordModal
    │
    └── Notification (Toast)
```

## State Management

### App-Level State
```javascript
// Authentication
- user: Object | null
- isAuthenticated: boolean

// Navigation
- currentTab: string

// Notifications
- notification: { show, message, type }

// Modals (boolean flags)
- checkInModalOpen
- guestDetailsModalOpen
- roomFormModalOpen
// ... etc

// Data Collections
- rooms: Array
- guests: Array
- clients: Array
- debts: Array
- tasks: Array
- shifts: Array
- currentShift: Object | null
- expenses: Array
- staff: Array

// Selected Items (for modals)
- selectedGuest
- selectedRoom
- selectedClient
- selectedStaff
```

### Component-Level State
Each component manages its own:
- Form inputs
- Loading states
- Local UI state
- Validation errors

## Key Patterns

### 1. Modal Pattern
```javascript
// State
const [modalOpen, setModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

// Open modal
<button onClick={() => {
  setSelectedItem(item);
  setModalOpen(true);
}}>

// Modal component
<Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  data={selectedItem}
  onSave={handleSave}
/>
```

### 2. Handler Pattern
```javascript
const handleAction = async (data) => {
  // 1. Perform action (Firebase operation)
  // 2. Show notification
  // 3. Send Telegram notification
  // 4. Update local state
};
```

### 3. Tab Navigation Pattern
```javascript
const handleTabChange = (tab) => {
  setCurrentTab(tab);
};

// Conditional rendering
{currentTab === 'dashboard' && <DashboardStats />}
{currentTab === 'rooms' && <RoomsView />}
```

## Security Model

### Role-Based Access
```javascript
// Admin-only features
{user?.role === 'admin' && <AdminFeature />}

// Navigation filtering
const filteredItems = user?.role === 'admin' 
  ? allItems 
  : userItems;
```

### Authentication Flow
```
1. User enters credentials
2. Check against DEFAULT_USERS (or Firebase Auth)
3. Set user state
4. Send Telegram notification
5. Render authenticated app
```

## Integration Points

### Firebase
```javascript
// Firestore initialization with offline persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
```

### Telegram
```javascript
// Notification on important events
await sendTelegramMessage(`✅ Вход: ${user.name}`);
await sendTelegramMessage(`🏠 Заселение: ${guest.name}`);
```

### Styling
```javascript
// Tailwind CSS utilities
className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"

// Shared constants
import { inputClass, labelClass } from './config/constants';
```

## Performance Considerations

1. **Component Splitting**: Large features split into focused components
2. **Lazy Loading**: Components loaded only when needed (via tabs)
3. **Memoization**: Can add React.memo for expensive renders
4. **Firebase Caching**: Offline persistence enabled
5. **Conditional Rendering**: Modals only render when open

## Scalability

### Adding New Features
1. Create component in appropriate feature directory
2. Add to App.jsx imports
3. Add navigation item (if needed)
4. Implement handlers in App.jsx
5. Connect to Firebase
6. Add Telegram notifications

### Code Organization
- **Vertical**: Feature-based (rooms, guests, etc.)
- **Horizontal**: Layer-based (UI, layout, business logic)
- **Shared**: Common utilities and components

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock props and handlers
- Test rendering, user interactions, edge cases

### Integration Tests
- Test component combinations
- Test data flow through App.jsx
- Test modal interactions

### E2E Tests
- Test complete user workflows
- Login → Check-in → View guest → Check-out
- Test across different roles

## Deployment

### Build Process
```bash
npm run build  # Create production build
```

### Environment Variables
- Firebase configuration
- Telegram bot token
- API endpoints

### Hosting Options
- Firebase Hosting
- Netlify
- Vercel
- Custom server

## Future Enhancements

1. **State Management**: Redux/Zustand for complex state
2. **Real-time Updates**: Firebase listeners for live data
3. **Offline Support**: Service workers + IndexedDB
4. **Internationalization**: Full i18n support
5. **Analytics**: User behavior tracking
6. **PWA**: Progressive Web App capabilities
7. **Testing**: Comprehensive test coverage
8. **CI/CD**: Automated testing and deployment
