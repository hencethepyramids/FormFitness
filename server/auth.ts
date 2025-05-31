import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import MemoryStore from 'memorystore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Configure session store
const MemoryStoreSession = MemoryStore(session);

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Helper functions for password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Configure Passport
export const configurePassport = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Here you would typically:
          // 1. Check if the user exists in your database
          // 2. If not, create a new user
          // 3. Return the user object
          
          const user = {
            id: profile.id,
            email: profile.emails?.[0].value,
            displayName: profile.displayName,
            picture: profile.photos?.[0].value
          };
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Local Strategy for email/password
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          // TODO: Replace with your database lookup
          // const user = await db.findUserByEmail(email);
          // if (!user) return done(null, false, { message: 'User not found' });
          // const isMatch = await comparePassword(password, user.password);
          // if (!isMatch) return done(null, false, { message: 'Invalid password' });
          // return done(null, user);

          // Mock user for now
          const user = { id: '1', email, displayName: 'Test User' };
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
};

// JWT token generation
export const generateToken = (user: any): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1d' });
}; 