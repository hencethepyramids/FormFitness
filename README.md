# Form Fitness

Form Fitness is a modern, full-stack fitness tracking app designed to help you log workouts, track progress, and stay motivated. Built with a focus on extensibility, security, and a beautiful user experience, Form Fitness is your companion for a healthier lifestyle.

---

## 🚀 Features

### Current
- **Google Authentication**: Secure sign-in with your Google account
- **Email/Password Authentication**: (UI ready, backend in progress)
- **Workout Logging**: Track exercises, sets, reps, and more
- **Workout Plans**: Create and manage custom workout plans
- **Progress Tracking**: Visualize your progress over time
- **Nutrition Tracking**: Log meals and monitor nutrition (basic)
- **Personal Records**: Track your best lifts and achievements
- **Mobile-Ready UI**: Responsive design for desktop and mobile

### Coming Soon
- **Apple ID Authentication**: Sign in with your Apple account (for iOS and web)
- **Social Features**: Share progress, follow friends, and join challenges
- **Advanced Analytics**: Deeper insights into your fitness journey
- **Push Notifications**: Reminders and motivational nudges
- **iOS & Android Apps**: Native app support

---

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Express, TypeScript, Passport.js, Drizzle ORM
- **Database**: (Configurable, e.g., PostgreSQL)
- **Authentication**: Passport (Google OAuth, Local), JWT
- **Other**: Vite, React Query, Radix UI, and more

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hencethepyramids/FormFitness.git
cd FormFitness
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

### 4. Start the development server
```bash
npm run dev
```

The app will be available at [http://localhost:5000](http://localhost:5000)

---

## 📝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change or add.

---

## 📬 Contact
Questions, suggestions, or feedback? Open an issue or contact [@hencethepyramids](https://github.com/hencethepyramids).

---

## 📅 Roadmap
- [x] Google Authentication
- [x] Modern, mobile-friendly UI
- [ ] Email/Password Authentication (backend)
- [ ] Apple ID Authentication
- [ ] Social and community features
- [ ] Native mobile apps

---

**Form Fitness** — Track. Improve. Succeed.
