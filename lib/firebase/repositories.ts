import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp, FirestoreError, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from './client';
import { COLLECTIONS } from '../constants';
import type { ZoneReportInput, ZoneReportResult, ZoneReport, ChatMessageInput } from '../../types';

/**
 * Creates a new zone report in Firestore.
 * @param {ZoneReportInput} report The zone report details to save.
 * @returns {Promise<ZoneReportResult>} A result object indicating success or failure.
 * @throws {FirestoreError} If the write operation fails due to permissions or network issues.
 */
export async function createZoneReport(report: ZoneReportInput): Promise<ZoneReportResult> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ZONE_REPORTS), {
      ...report,
      createdAt: serverTimestamp(),
      // In a real app, we'd pull the auth UID here. For now we use a placeholder or assume it's passed.
      reportedBy: 'staff-placeholder' 
    });
    return { success: true, reportId: docRef.id };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw error as FirestoreError;
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create report' };
  }
}

/**
 * Fetches recent zone reports, optionally filtered by a specific zone.
 * @param {string} [zoneId] Optional zone ID to filter reports.
 * @returns {Promise<ZoneReport[]>} An array of the most recent zone reports.
 * @throws {FirestoreError} If the read operation fails.
 */
export async function getRecentZoneReports(zoneId?: string): Promise<ZoneReport[]> {
  const reportsRef = collection(db, COLLECTIONS.ZONE_REPORTS);
  
  let q;
  if (zoneId) {
    q = query(reportsRef, where('zoneId', '==', zoneId), orderBy('createdAt', 'desc'), limit(50));
  } else {
    q = query(reportsRef, orderBy('createdAt', 'desc'), limit(50));
  }

  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      zoneId: data.zoneId,
      crowdLevel: data.crowdLevel,
      incidentType: data.incidentType,
      message: data.message,
      createdAt: data.createdAt?.toMillis?.() || Date.now(),
      reportedBy: data.reportedBy
    } as ZoneReport;
  });
}

/**
 * Saves a single chat message to a chat session subcollection.
 * @param {string} sessionId The ID of the chat session.
 * @param {ChatMessageInput} message The message to save.
 * @returns {Promise<void>} Resolves when the message is successfully saved.
 * @throws {FirestoreError} If the write operation fails.
 */
export async function saveChatMessage(sessionId: string, message: ChatMessageInput): Promise<void> {
  const sessionMessagesRef = collection(db, COLLECTIONS.CHAT_SESSIONS, sessionId, 'messages');
  await addDoc(sessionMessagesRef, {
    ...message,
    createdAt: serverTimestamp()
  });
}

/**
 * Subscribes to recent zone reports.
 * @param {Function} callback The callback to invoke with updated reports.
 * @param {string} [zoneId] Optional zone ID to filter.
 * @returns {Unsubscribe} Function to cancel the subscription.
 */
export function subscribeToZoneReports(callback: (reports: ZoneReport[]) => void, zoneId?: string): Unsubscribe {
  const reportsRef = collection(db, COLLECTIONS.ZONE_REPORTS);
  let q;
  if (zoneId) {
    q = query(reportsRef, where('zoneId', '==', zoneId), orderBy('createdAt', 'desc'), limit(50));
  } else {
    q = query(reportsRef, orderBy('createdAt', 'desc'), limit(50));
  }

  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        zoneId: data.zoneId,
        crowdLevel: data.crowdLevel,
        incidentType: data.incidentType,
        message: data.message,
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
        reportedBy: data.reportedBy
      } as ZoneReport;
    });
    callback(reports);
  }, (error) => {
    console.error("Subscription error:", error);
  });
}
