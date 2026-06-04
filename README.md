# TaskFlow - Task Management Dashboard

A modern, responsive Task Management App built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 📸 Screenshots

### Login Page
![Login Page](public/login.png)

### Dashboard - Dark Mode
![Dashboard Dark](public/dashboard-dark.png)
![Dashboard Dark Tasks](public/dashboard-dark-2.png)

### Dashboard - Light Mode
![Dashboard Light](public/dashboard-light.png)
![Dashboard Light Tasks](public/dashboard-light-2.png)

## 🚀 Features

- **Mock Authentication** - Login with session stored in localStorage
- **Task Dashboard** - View all tasks in a clean card layout
- **CRUD Operations** - Create, Edit, Delete tasks
- **Status Management** - Todo / In Progress / Completed
- **Filtering** - Filter tasks by status
- **Sorting** - Sort by due date (ascending/descending)
- **Search** - Search tasks by title
- **Pagination** - 4 tasks per page
- **Dark/Light Mode** - Toggle between dark and light themes
- **Progress Tracker** - Visual progress bar showing completion percentage
- **Responsive Design** - Works on all screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React useState/useEffect
- **Auth**: Mock authentication with localStorage

## 📦 Setup Steps

### Prerequisites
- Node.js 18+
- npm

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/nikhilzzz540/Task-Management-App.git
cd task-dashboard
```

**2. Install dependencies**
```bash
npm install
```

**3. Install shadcn/ui components**
```bash
npx shadcn@latest add button input label card dialog select badge
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in browser**

http://localhost:3000

## 🔐 Login Credentials

Username: admin
Password: admin123

## 📁 Folder Structure

```
Task-Management-App/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── data/
│   │   └── tasks.ts
│   ├── types/
│   │   └── index.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       └── badge.tsx
├── public/
│   ├── login.png
│   ├── dashboard-dark.png
│   ├── dashboard-dark-2.png
│   ├── dashboard-light.png
│   └── dashboard-light-2.png
├── components.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md


## 🎨 Design Decisions

- **Dark-first Design**: Deep dark background (`#0d0d1a`) with purple/indigo gradient orbs for a modern, professional aesthetic
- **Glass Morphism**: Used `backdrop-blur` and `bg-white/5` for frosted glass effect on cards and modals
- **CSS-only Background**: No external images — pure CSS gradients for fast loading and consistent look across all devices
- **shadcn/ui Components**: Used for accessible, customizable UI components (Dialog, Select, Input, Badge etc.)
- **Mock Authentication**: localStorage-based auth as per requirements — no backend needed for this task
- **Pagination**: 4 tasks per page for clean UX and better readability
- **Dark/Light Mode Toggle**: Smooth instant transition between themes without page reload
- **Progress Bar**: Visual indicator showing overall task completion percentage
- **TypeScript**: Strict typing with no `any` — all interfaces defined in `app/types/index.ts`
- **Reusable Structure**: Clean separation of data, types, and pages for maintainability

