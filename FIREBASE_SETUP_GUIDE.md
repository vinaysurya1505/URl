# Firebase Setup Guide

## What Changed

Your app has been migrated from markdown file storage to **Firebase Firestore**. This allows entries to persist on Vercel!

### Key Changes:
- ✅ Removed authentication requirement - **anyone can add entries**
- ✅ `/admin` page is now public
- ✅ Entries stored in Firestore cloud database (persistent)
- ✅ Homepage (`/`) displays all entries in real-time
- ✅ Works perfectly on Vercel without file system limitations

---

## Quick Setup

### 1. Set Firestore Security Rules

**Go to:** [Firebase Console](https://console.firebase.google.com/project/entries-ca0ea/firestore/rules)

**Replace all rules with:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read all entries
    match /entries/{document=**} {
      allow read: if true;
      allow create: if validateEntry(request.resource.data);
      allow update: if false;
      allow delete: if false;
    }
    
    // Deny access to all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

function validateEntry(data) {
  return data.keys().hasAll(['number', 'topic', 'url']) &&
         data.number is int &&
         data.topic is string &&
         data.url is string &&
         data.topic.size() > 0 &&
         data.url.size() > 0;
}
```

**Click:** Publish

### 2. Create Firestore Collection (Optional - Auto-created on first entry)

The `entries` collection will be created automatically when the first entry is added.

---

## Environment Variables Setup

### For Local Development

Your `.env.local` already has Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBLNW-1hWrLlI1ZvsakwmHEUihav3D__Xk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=entries-ca0ea.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=entries-ca0ea
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=entries-ca0ea.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=649390003479
NEXT_PUBLIC_FIREBASE_APP_ID=1:649390003479:web:def959f3f8cdd9b4fe9352
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-L0LZPDBSDM
```

### For Vercel Deployment

1. Go to your [Vercel Project Dashboard](https://vercel.com/projects)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (copy from `.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

5. **Redeploy** your app from Vercel dashboard

---

## Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000/admin to add entries
# Visit http://localhost:3000 to see all entries
```

### Production Testing (Vercel)
1. Make sure Firestore security rules are published
2. Visit your Vercel deployment URL/admin to add an entry
3. Refresh to see it appear on the homepage
4. Entries persist indefinitely! ✅

---

## Routes

| Route | Purpose | Auth Required |
|-------|---------|---|
| `/` | View all entries | No |
| `/admin` | Add new entries | No |
| `/login` | Login page (deprecated) | No |

---

## Data Structure (Firestore)

```
entries (collection)
├── doc1 (auto-generated ID)
│   ├── number: 1
│   ├── topic: "upload"
│   ├── url: "https://script.google.com/macros/..."
│   └── createdAt: 1234567890
├── doc2
│   ├── number: 2
│   ├── topic: "download"
│   ├── url: "https://example.com"
│   └── createdAt: 1234567891
```

---

## Features

✅ **Public Entry Submission** - Anyone can add entries  
✅ **Real-time Display** - Homepage shows entries in real-time  
✅ **Persistent Storage** - Entries never disappear on Vercel  
✅ **No Authentication** - Simple and accessible  
✅ **Data Validation** - Firestore rules ensure data integrity  

---

## Troubleshooting

### Entries not showing on Vercel
- Check Firestore rules are published
- Check environment variables are added to Vercel project
- Redeploy the project

### Getting 500 error when adding entries
- Check browser console for error message
- Verify Firestore rules are correctly set
- Ensure environment variables are loaded

### Firebase initialization error
- Check all `NEXT_PUBLIC_FIREBASE_*` variables are in `.env.local`
- Make sure they match your Firebase project

---

## File Changes Summary

| File | Change |
|------|--------|
| `lib/firebase.ts` | New - Firebase initialization |
| `lib/entries.ts` | Migrated to Firestore |
| `app/api/add-entry/route.ts` | Removed auth check |
| `app/admin/page.tsx` | Removed auth check |
| `app/page.tsx` | Updated to async, reads from Firestore |
| `components/AdminDashboard.tsx` | Removed logout, updated for public access |
| `middleware.ts` | Simplified (no auth protection) |
| `.env.local` | Added Firebase credentials |
| `.env.example` | Added Firebase template |
| `FIRESTORE_RULES.md` | New - Security rules documentation |

---

## Next Steps

1. ✅ Publish Firestore rules (see Quick Setup above)
2. ✅ Test locally with `npm run dev`
3. ✅ Add environment variables to Vercel
4. ✅ Redeploy on Vercel
5. Start adding entries!

For support, check [FIRESTORE_RULES.md](FIRESTORE_RULES.md) for rules details.
