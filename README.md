# Form Fitness

Form Fitness is a modern, full-stack fitness tracking app designed to help you log workouts, track progress, and stay motivated. Built with a focus on extensibility, security, and a beautiful user experience, Form Fitness is your companion for a healthier lifestyle.

---

## 🚀 Features

### Current
- **Supabase Authentication**: Secure sign-in with Google, Apple, or email/password
- **Workout Logging**: Track exercises, sets, reps, and more
- **Workout Plans**: Create and manage custom workout plans
- **Progress Tracking**: Visualize your progress over time
- **Nutrition Tracking**: Log meals and monitor nutrition (basic)
- **Personal Records**: Track your best lifts and achievements
- **Mobile-Ready UI**: Responsive design for desktop and mobile

### Coming Soon
- **Social Features**: Share progress, follow friends, and join challenges
- **Advanced Analytics**: Deeper insights into your fitness journey
- **Push Notifications**: Reminders and motivational nudges
- **iOS & Android Apps**: Native app support

---

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Express, TypeScript, Drizzle ORM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google, Apple, Email/Password)
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
npm install @supabase/supabase-js
```

### 3. Set up environment variables
Create a `.env` file in the project root (this file is gitignored for security):
```env
VITE_SUPABASE_URL=https://kjfsyanuttobhhtqgavr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.kjfsyanuttobhhtqgavr.supabase.co:5432/postgres
```

### 4. Set up Supabase Auth in your frontend
Create `client/src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 5. Use Supabase Auth in your login/signup UI
#### Email sign up:
```ts
const { user, error } = await supabase.auth.signUp({
  email: 'user@email.com',
  password: 'password'
});
```
#### Google sign-in:
```ts
await supabase.auth.signInWithOAuth({ provider: 'google' });
```
#### Apple sign-in:
```ts
await supabase.auth.signInWithOAuth({ provider: 'apple' });
```

### 6. Remove Passport.js
- Remove all Passport.js authentication logic and routes from your backend.
- Use Supabase Auth for all authentication flows.

### 7. Protect backend routes
- For any backend routes that require authentication, verify the Supabase JWT in the request headers.

---

## 📝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change or add.

---

## 📬 Contact
Questions, suggestions, or feedback? Open an issue or contact [@hencethepyramids](https://github.com/hencethepyramids).

---

## 📅 Roadmap
- [x] Supabase Authentication (Google, Apple, Email/Password)
- [x] Modern, mobile-friendly UI
- [ ] Social and community features
- [ ] Native mobile apps

---

**Form Fitness** — Track. Improve. Succeed.
