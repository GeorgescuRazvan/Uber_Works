# TaskHub: Community Help & Micro-Task Coordination App

A React-based platform that connects people who need assistance with those willing to help, powered by Google Cloud Platform and Firebase services.

## Features

- Real-time task mapping and coordination
- Location-based task discovery
- Volunteer and paid task support
- User reputation system
- Real-time chat between users
- Push notifications for task updates
- Analytics and reporting

## Cloud Services Integration

### Google Cloud Platform (GCP)
- **App Engine**: Hosts the React frontend and Node.js/Express backend
- **Cloud SQL (PostgreSQL)**: Main database with PostGIS for spatial queries
- **Cloud Storage**: Media storage for task attachments
- **Cloud Functions**: Serverless backend logic
- **Cloud Monitoring & Logging**: Application monitoring
- **BigQuery**: Analytics data warehouse

### Firebase Services
- **Authentication**: User management
- **Cloud Firestore**: Real-time data sync
- **Cloud Storage**: Media files
- **Cloud Messaging**: Push notifications

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key

# Google Cloud Configuration
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCbcG4F8svpjrg9QIEcxv4OsYiMyDTlojE
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Cloud Infrastructure Setup

1. **Google Cloud Project**:
   - Create a new project in Google Cloud Console
   - Enable required APIs (Maps, Cloud SQL, App Engine, etc.)
   - Set up service accounts and API keys

2. **Firebase Project**:
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Cloud Messaging
   - Add a web app and get configuration details

3. **Database Setup**:
   - Create a Cloud SQL PostgreSQL instance
   - Enable PostGIS extension
   - Run database migrations

4. **Cloud Functions**:
   - Deploy serverless functions for:
     - Geospatial queries
     - Push notifications
     - Analytics processing
     - Task matching

## Architecture

The application follows a modern cloud-native architecture:

- **Frontend**: React with TypeScript
- **State Management**: React Context + Firebase
- **UI Components**: shadcn/ui + Tailwind CSS
- **Real-time Updates**: Firestore + Cloud Messaging
- **Geospatial**: PostGIS + Cloud Functions
- **Media Storage**: Cloud Storage
- **Analytics**: BigQuery + Cloud Monitoring

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud SDK
- Firebase CLI

### Local Development
1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`

### Deployment
1. Build the application: `npm run build`
2. Deploy to App Engine: `gcloud app deploy`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
