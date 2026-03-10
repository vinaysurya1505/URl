
# Firestore Security Rules

Copy and paste the following rules into your Firestore Database Rules at [Firebase Console](https://console.firebase.google.com/project/entries-ca0ea/firestore/rules):

## Rules Configuration

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

## Steps to Deploy Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `entries-ca0ea`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the current rules with the code above
5. Click **Publish**

## Rules Explanation

- **Read**: Anyone can read all entries without authentication
- **Create**: Anyone can add new entries (no authentication required)
- **Update/Delete**: No one can update or delete entries
- **Validation**: Validates that each entry has `number`, `topic`, and `url` fields

This allows public submissions while maintaining data integrity.
