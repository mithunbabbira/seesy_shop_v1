# Les Petites Pépites Vertes - Grocery Store App

A modern React-based grocery store application built with TypeScript, Firebase, and Tailwind CSS. Configured for automatic Netlify deployment.

## 🚀 Quick Netlify Deployment

### Option 1: Auto-Deploy from Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy Site"

3. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add these variables:
     ```
     REACT_APP_FIREBASE_API_KEY=AIzaSyD8tPSnskFn27dFXVfV5ctDcnU-Elv25PA
     REACT_APP_FIREBASE_AUTH_DOMAIN=seesy-shop.firebaseapp.com
     REACT_APP_FIREBASE_DATABASE_URL=https://seesy-shop-default-rtdb.europe-west1.firebasedatabase.app
     REACT_APP_FIREBASE_PROJECT_ID=seesy-shop
     REACT_APP_FIREBASE_STORAGE_BUCKET=seesy-shop.firebasestorage.app
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=359255298457
     REACT_APP_FIREBASE_APP_ID=1:359255298457:web:d40ff94ec3914628084308
     REACT_APP_FIREBASE_MEASUREMENT_ID=G-N27FN5NL0G
     ```

4. **Trigger Redeploy**: After setting env vars, trigger a redeploy from the Netlify dashboard

🎉 **That's it! Your app will be live!**

### Option 2: Manual Deploy

```bash
# Build the project locally
npm run build

# Drag and drop the 'build' folder to Netlify dashboard
```

## ✅ What's Pre-Configured for Netlify

- ✅ `netlify.toml` configuration file
- ✅ Build settings (`npm run build`)
- ✅ SPA routing redirects
- ✅ Asset optimization headers
- ✅ Security headers
- ✅ Environment variable support
- ✅ Node.js 18 runtime

## 🛠 Local Development

### Prerequisites
- Node.js (v18 or higher)
- Firebase account

### Setup
```bash
# Clone and install
git clone <your-repo>
cd seesy_2
npm install

# Start development server
npm start
```

The app uses environment variables with fallbacks, so it works out of the box for development.

## 🔥 Firebase Configuration

Your Firebase project should have:

### Services Enabled:
- ✅ Firestore Database
- ✅ Authentication (Email/Password)  
- ✅ Storage
- ✅ Hosting (optional)

### Security Rules:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /items/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }
  }
}
```

## 📱 Features

### Customer Features
- 🏪 Browse product categories with modern UI
- 🛍️ View items with prices and availability
- 📱 Fully responsive design
- 📞 Contact integration for orders
- 🎨 Beautiful animations and transitions

### Admin Features (`/admin/dashboard`)
- 🔐 Secure authentication
- 📂 Category management with image upload
- 🛒 Item management with image upload  
- 🖼️ Drag & drop image uploads to Firebase Storage
- 📊 Real-time inventory management
- 🎯 Availability toggle for items

## 🗂 Data Structure

### Categories
```typescript
interface Category {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Items
```typescript
interface Item {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string; // "per kg", "per unit", etc.
  imageUrl: string;
  isAvailable: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔧 Scripts

- `npm start` - Development server
- `npm run build` - Production build  
- `npm test` - Run tests

## 🌍 Environment Variables

The app uses these environment variables (with fallbacks):

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_DATABASE_URL=your_db_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

For local development, copy `.env.example` to `.env.local` and fill in your values.

## 📞 Contact Information

- **Phone**: 06 93 60 76 83
- **Email**: lespetitespepitesvertes@gmail.com

## 🚦 Admin Access

1. Create an admin user in Firebase Console → Authentication
2. Go to `/admin/login` on your deployed site
3. Login with your credentials
4. Access dashboard at `/admin/dashboard`

## 🎯 Production Ready

- ⚡ Optimized builds with code splitting
- 🔒 Secure Firebase configuration  
- 📱 Mobile-first responsive design
- 🖼️ Image compression and optimization
- 🚀 CDN-friendly asset caching
- 🛡️ Security headers configured
- 📈 Performance optimized
- 🇫🇷 French localization

## 🔄 Automatic Deployments

Once connected to Netlify:
- Push to main branch → Auto deploy
- Pull requests → Deploy previews  
- Environment variables → Secure config
- Build logs → Easy debugging

## 📚 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Forms**: React Hook Form + Yup
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Routing**: React Router DOM
- **Deployment**: Netlify
- **Build Tool**: Create React App

---

**Ready to deploy? Just push to your Git repository and connect to Netlify! 🚀**