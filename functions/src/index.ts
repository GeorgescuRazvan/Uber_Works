import * as admin from 'firebase-admin';
import { Pool } from 'pg';
import { Request, Response } from 'express';
import * as functions from '@google-cloud/functions-framework';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

function setCorsHeaders(res: Response) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

// Geospatial Functions
functions.http('nearbyTasks', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { lat, lng, radius } = req.query;
  
  if (!lat || !lng || !radius) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  const latNum = parseFloat(lat as string);
  const lngNum = parseFloat(lng as string);
  const radiusNum = parseFloat(radius as string);
  
  if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum)) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }
  
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE ST_DWithin(
         location::geography,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         $3
       )`,
      [lngNum, latNum, radiusNum * 1000] // Convert km to meters
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying nearby tasks:', error);
    res.status(500).json({ error: 'Failed to query nearby tasks' });
  }
});

functions.http('tasksInBounds', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { swLat, swLng, neLat, neLng } = req.query;
  
  if (!swLat || !swLng || !neLat || !neLng) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  const swLatNum = parseFloat(swLat as string);
  const swLngNum = parseFloat(swLng as string);
  const neLatNum = parseFloat(neLat as string);
  const neLngNum = parseFloat(neLng as string);
  
  if (isNaN(swLatNum) || isNaN(swLngNum) || isNaN(neLatNum) || isNaN(neLngNum)) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }
  
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE ST_Within(
         location::geography,
         ST_MakeEnvelope($1, $2, $3, $4, 4326)::geography
       )`,
      [swLngNum, swLatNum, neLngNum, neLatNum]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error querying tasks in bounds:', error);
    res.status(500).json({ error: 'Failed to query tasks in bounds' });
  }
});

// Push Notification Functions
functions.http('subscribeToTopic', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { token, topic } = req.body;
  
  if (!token || !topic) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  
  try {
    await admin.messaging().subscribeToTopic(token, topic);
    res.json({ success: true });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    res.status(500).json({ error: 'Failed to subscribe to topic' });
  }
});

functions.http('unsubscribeFromTopic', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { token, topic } = req.body;
  
  if (!token || !topic) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  
  try {
    await admin.messaging().unsubscribeFromTopic(token, topic);
    res.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    res.status(500).json({ error: 'Failed to unsubscribe from topic' });
  }
});

// Analytics Functions
functions.http('getTaskAnalytics', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_tasks,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
         AVG(CASE WHEN status = 'completed' 
           THEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 
           END) as avg_completion_time,
         COUNT(CASE WHEN type = 'volunteer' THEN 1 END) as volunteer_tasks,
         COUNT(CASE WHEN type = 'paid' THEN 1 END) as paid_tasks
       FROM tasks
       WHERE created_at BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting task analytics:', error);
    res.status(500).json({ error: 'Failed to get task analytics' });
  }
});

functions.http('getUserAnalytics', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(DISTINCT user_id) as total_users,
         COUNT(DISTINCT CASE WHEN last_active > NOW() - INTERVAL '7 days' 
           THEN user_id END) as active_users,
         AVG(reputation) as avg_reputation,
         COUNT(*)::float / NULLIF(COUNT(DISTINCT user_id), 0) as tasks_per_user
       FROM users
       WHERE created_at BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({ error: 'Failed to get user analytics' });
  }
});

functions.http('logAnalyticsEvent', async (req: Request, res: Response) => {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { eventName, eventData, timestamp } = req.body;
  
  if (!eventName || !eventData || !timestamp) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  
  try {
    await pool.query(
      `INSERT INTO analytics_events (event_name, event_data, timestamp)
       VALUES ($1, $2, $3)`,
      [eventName, JSON.stringify(eventData), timestamp]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    res.status(500).json({ error: 'Failed to log analytics event' });
  }
}); 