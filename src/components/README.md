# Hostella Components

This directory contains all React components for the Hostella hostel management application, organized by feature domain.

## Directory Structure

### UI Components (`ui/`)
Generic, reusable UI components that can be used throughout the application.

- **Button.jsx** - Flexible button with variants (primary, secondary, danger, success, outline)
- **Card.jsx** - Container component with optional title and hover effects
- **Notification.jsx** - Toast notification system for user feedback
- **NavItem.jsx** - Navigation item with icon, label, and badge support

### Layout Components (`layout/`)
Components for application structure and navigation.

- **Navigation.jsx** - Desktop sidebar navigation with user info and logout
- **MobileNavigation.jsx** - Bottom navigation bar for mobile devices
- **LoginScreen.jsx** - Authentication screen with form validation

### Dashboard Components (`dashboard/`)
Dashboard and statistics visualization.

- **DashboardStats.jsx** - Grid of statistics cards (rooms, occupancy, revenue, debts)
- **ChartsSection.jsx** - Placeholder for revenue and occupancy charts

### Room Management (`rooms/`)
Room inventory and management.

- **RoomCardChess.jsx** - Chess-style room card with status and guest info
- **RoomFormModal.jsx** - Modal form for adding/editing rooms

### Calendar (`calendar/`)
Date-based views and booking calendar.

- **CalendarView.jsx** - Interactive monthly calendar with booking indicators

### Guest Management (`guests/`)
Guest check-in, check-out, and management.

- **CheckInModal.jsx** - Complete check-in form with room selection
- **GuestDetailsModal.jsx** - View guest information and perform actions
- **MoveGuestModal.jsx** - Transfer guest to different room
- **CountdownTimer.jsx** - Real-time countdown to check-out time

### Client Management (`clients/`)
Client database and history tracking.

- **ClientsView.jsx** - Grid view of all clients with search
- **ClientEditModal.jsx** - Form for adding/editing client information
- **ClientImportModal.jsx** - Bulk import clients from CSV/Excel
- **ClientHistoryModal.jsx** - View client's booking history

### Debt Tracking (`debts/`)
Financial debt management.

- **DebtsView.jsx** - List of outstanding debts with payment actions
- **CreateDebtModal.jsx** - Form for recording new debt

### Reports (`reports/`)
Financial reporting and analytics.

- **ReportsView.jsx** - Generate financial reports by date range

### Task Management (`tasks/`)
Todo list and task tracking.

- **TaskManager.jsx** - Add, complete, and delete tasks

### Shift Management (`shifts/`)
Employee shift tracking and cash management.

- **ShiftsView.jsx** - Current shift and shift history
- **ShiftClosingModal.jsx** - Close shift with final balance
- **ShiftBlockScreen.jsx** - Full-screen prompt to open shift

### Expense Tracking (`expenses/`)
Business expense logging.

- **ExpenseModal.jsx** - Form for recording expenses by category

### Staff Management (`staff/`)
Employee management and access control.

- **StaffView.jsx** - List of staff members with roles
- **ChangePasswordModal.jsx** - Update employee password

## Component Patterns

### Props Documentation
All components include JSDoc comments describing:
- Component purpose
- Props interface with types
- Usage examples

### State Management
- Local state for form inputs and UI state
- Props for data and callbacks
- Consistent naming: `onAction` for callbacks

### Styling
- Tailwind CSS utility classes
- Responsive design (mobile-first)
- Consistent color scheme (indigo primary)
- Shared constants from `config/constants.js`

### Modals
Modal components follow a consistent pattern:
```jsx
const Modal = ({ isOpen, onClose, onSave, data }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal content */}
    </div>
  );
};
```

### Forms
Form components use:
- Controlled inputs with local state
- `inputClass` and `labelClass` from constants
- Validation before submission
- Cancel and submit actions

## Usage Examples

### Using UI Components
```jsx
import { Button, Card, Notification } from './components/ui';

<Button variant="primary" onClick={handleClick}>
  Save
</Button>

<Card title="Statistics">
  {/* Card content */}
</Card>

<Notification
  show={showNotif}
  message="Success!"
  type="success"
  onClose={handleClose}
/>
```

### Using Feature Components
```jsx
import CheckInModal from './components/guests/CheckInModal';

<CheckInModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onCheckIn={handleCheckIn}
  availableRooms={rooms}
/>
```

## Best Practices

1. **Keep components focused** - One responsibility per component
2. **Use prop validation** - JSDoc comments for all props
3. **Follow naming conventions** - PascalCase for components, camelCase for functions
4. **Maintain consistency** - Use shared styles and patterns
5. **Make components reusable** - Accept props for customization
6. **Handle edge cases** - Empty states, loading states, errors
7. **Responsive design** - Mobile-first, test on multiple screens
8. **Accessibility** - Semantic HTML, keyboard navigation, ARIA labels

## Adding New Components

When adding a new component:
1. Choose appropriate directory based on feature domain
2. Create file with PascalCase naming (e.g., `NewComponent.jsx`)
3. Add JSDoc comments for props and purpose
4. Import required dependencies
5. Export component as default
6. Update this README if creating a new category
7. Consider creating an index.js barrel export if many related components
