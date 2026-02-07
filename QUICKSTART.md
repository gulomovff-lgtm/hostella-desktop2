# Hostella App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account (for backend)
- Telegram Bot Token (for notifications)

### Installation

```bash
# Clone the repository
git clone https://github.com/gulomovff-lgtm/hostella-desktop2.git
cd hostella-desktop2

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── App.jsx              # Main application coordinator
├── config/              # Configuration files
├── utils/               # Helper functions
└── components/          # React components
    ├── ui/              # Reusable UI components
    ├── layout/          # Navigation and layout
    ├── dashboard/       # Dashboard features
    ├── rooms/           # Room management
    ├── calendar/        # Calendar view
    ├── guests/          # Guest management
    ├── clients/         # Client database
    ├── debts/           # Debt tracking
    ├── reports/         # Financial reports
    ├── tasks/           # Task management
    ├── shifts/          # Shift management
    ├── expenses/        # Expense tracking
    └── staff/           # Staff management
```

## 🔑 Default Login Credentials

```javascript
Admin:
  - Login: admin
  - Password: admin

Cashiers:
  - Login: dilafruz | Password: 123
  - Login: nargiza   | Password: 123
  - Login: fazliddin | Password: 123
  - Login: olimjon   | Password: 123
```

## 🎯 Key Features

### 1. Dashboard
- Real-time statistics
- Room occupancy overview
- Revenue tracking
- Debt monitoring

### 2. Room Management
- Chess-style grid view
- Status tracking (available, occupied, cleaning)
- Quick room actions

### 3. Guest Management
- Check-in/Check-out workflow
- Guest details and history
- Room transfer functionality
- Countdown timers

### 4. Client Database
- Searchable client list
- Visit history
- Import from CSV/Excel
- Client statistics

### 5. Financial Tools
- Debt tracking and payment
- Date-range reports
- Expense logging
- Shift balance management

## 📝 Common Tasks

### Adding a New Component

1. Create the component file:
```bash
touch src/components/[feature]/NewComponent.jsx
```

2. Write the component:
```jsx
import React from 'react';
import { Button, Card } from '../ui';

const NewComponent = ({ data, onAction }) => {
  return (
    <Card title="New Feature">
      {/* Your content */}
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
};

export default NewComponent;
```

3. Import in App.jsx:
```jsx
import NewComponent from './components/[feature]/NewComponent';
```

4. Use in render:
```jsx
{currentTab === 'newfeature' && (
  <NewComponent data={data} onAction={handleAction} />
)}
```

### Creating a Modal

```jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../config/constants';

const MyModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ /* fields */ });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Modal content */}
      </div>
    </div>
  );
};

export default MyModal;
```

### Adding a New Tab

1. Add navigation item in `Navigation.jsx`:
```jsx
{ id: 'newtab', label: 'New Tab', icon: '🎯' }
```

2. Add conditional render in `App.jsx`:
```jsx
{currentTab === 'newtab' && <NewTabComponent />}
```

## 🎨 Styling Guide

### Using Tailwind CSS
```jsx
<div className="bg-indigo-600 hover:bg-indigo-700 rounded-xl p-4">
  Content
</div>
```

### Using Shared Constants
```jsx
import { inputClass, labelClass } from './config/constants';

<label className={labelClass}>Name</label>
<input className={inputClass} />
```

### Color Scheme
- Primary: Indigo (indigo-600)
- Success: Green (green-600)
- Danger: Red (red-600)
- Warning: Yellow (yellow-600)
- Neutral: Slate (slate-600)

## 🔥 Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com

2. Enable Firestore Database

3. Update `src/config/firebase.js` with your config:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...
};
```

4. Set up Firestore collections:
```
/rooms - Room inventory
/guests - Active guests
/clients - Client database
/debts - Outstanding debts
/shifts - Shift history
/expenses - Expense records
```

## 📱 Telegram Notifications

1. Create a bot with @BotFather on Telegram

2. Get your bot token

3. Update `src/config/constants.js`:
```javascript
export const TG_BOT_TOKEN = "YOUR_BOT_TOKEN";
export const TG_CHAT_IDS = ["YOUR_CHAT_ID"];
```

4. Notifications are sent automatically for:
   - User login/logout
   - Guest check-in/check-out
   - Shift opening/closing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- ComponentName
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Option 1: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues
- Check Firebase config in `src/config/firebase.js`
- Verify Firestore rules allow read/write
- Check browser console for errors

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify all imports are correct

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or issues:
- Open a GitHub issue
- Contact the development team
- Check the documentation in `/docs`

---

Happy coding! 🎉
