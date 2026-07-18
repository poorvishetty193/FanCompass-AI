import {
  collection, addDoc, getDocs, query, where,
  orderBy, limit, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import type { FirestoreError, Unsubscribe } from 'firebase/firestore';
import { db } from './client';
import { COLLECTIONS, ERROR_MESSAGES, STAFF_PLACEHOLDER } from '../constants';
import type { ZoneReportInput, ZoneReportResult, ZoneReport, ChatMessageInput } from '../../types';

/**
 * Creates a new zone report document in the `zoneReports` Firestore collection.
 * @param {ZoneReportInput} report - Zone report details (zoneId, crowdLevel, message)
 * @returns {Promise<ZoneReportResult>} Discriminated union: `{ success: true, reportId }` or `{ success: false, error }`
 * @throws {FirestoreError} If the write fails due to permission denial or network issues
 */
export async function createZoneReport(report: ZoneReportInput): Promise<ZoneReportResult> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ZONE_REPORTS), {
      ...report,
      createdAt: serverTimestamp(),
      reportedBy: STAFF_PLACEHOLDER,
    });
    return { success: true, reportId: docRef.id };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw error as FirestoreError;
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.REPORT_FAILED,
    };
  }
}

/**
 * Fetches the 50 most recent zone reports, optionally filtered by zone.
 * @param {string} [zoneId] - Optional zone ID to filter reports by
 * @returns {Promise<ZoneReport[]>} Array of zone reports sorted by creation time descending
 * @throws {FirestoreError} If the read operation fails
 */
export async function getRecentZoneReports(zoneId?: string): Promise<ZoneReport[]> {
  const reportsRef = collection(db, COLLECTIONS.ZONE_REPORTS);

  const q = zoneId
    ? query(reportsRef, where('zoneId', '==', zoneId), orderBy('createdAt', 'desc'), limit(50))
    : query(reportsRef, orderBy('createdAt', 'desc'), limit(50));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      zoneId: data.zoneId as string,
      crowdLevel: data.crowdLevel as ZoneReport['crowdLevel'],
      incidentType: data.incidentType as string | undefined,
      message: data.message as string,
      createdAt: (data.createdAt?.toMillis?.() as number) || Date.now(),
      reportedBy: data.reportedBy as string,
    };
  });
}

/**
 * Saves a single chat message to a chat session subcollection in Firestore.
 * Path: `chatSessions/{sessionId}/messages/{auto-id}`
 * @param {string} sessionId - The ID of the parent chat session document
 * @param {ChatMessageInput} message - The message object (role + content)
 * @returns {Promise<void>} Resolves when the write completes successfully
 * @throws {FirestoreError} If the write operation fails
 */
export async function saveChatMessage(sessionId: string, message: ChatMessageInput): Promise<void> {
  const sessionMessagesRef = collection(db, COLLECTIONS.CHAT_SESSIONS, sessionId, 'messages');
  await addDoc(sessionMessagesRef, {
    ...message,
    createdAt: serverTimestamp(),
  });
}

/**
 * Subscribes to a real-time stream of zone reports from Firestore.
 * @param {(reports: ZoneReport[]) => void} callback - Invoked with the latest reports on every change
 * @param {string} [zoneId] - Optional zone ID to filter the subscription
 * @returns {Unsubscribe} Function to cancel the Firestore snapshot listener
 */
export function subscribeToZoneReports(
  callback: (reports: ZoneReport[]) => void,
  zoneId?: string,
): Unsubscribe {
  const reportsRef = collection(db, COLLECTIONS.ZONE_REPORTS);

  const q = zoneId
    ? query(reportsRef, where('zoneId', '==', zoneId), orderBy('createdAt', 'desc'), limit(50))
    : query(reportsRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports: ZoneReport[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          zoneId: data.zoneId as string,
          crowdLevel: data.crowdLevel as ZoneReport['crowdLevel'],
          incidentType: data.incidentType as string | undefined,
          message: data.message as string,
          createdAt: (data.createdAt?.toMillis?.() as number) || Date.now(),
          reportedBy: data.reportedBy as string,
        };
      });
      callback(reports);
    },
    (error: FirestoreError) => {
      console.error(error.message);
    },
  );
}
