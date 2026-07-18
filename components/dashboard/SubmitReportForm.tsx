import { ZONES } from '@/lib/constants';

type CrowdLevel = 'low' | 'medium' | 'high' | 'critical';

interface SubmitReportFormProps {
  zoneId: string;
  setZoneId: (id: string) => void;
  crowdLevel: CrowdLevel;
  setCrowdLevel: (level: CrowdLevel) => void;
  incidentType: string;
  setIncidentType: (type: string) => void;
  message: string;
  setMessage: (msg: string) => void;
  submitError: string | null;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export function SubmitReportForm({
  zoneId, setZoneId, crowdLevel, setCrowdLevel, incidentType, setIncidentType, message, setMessage, submitError, isSubmitting, handleSubmit
}: SubmitReportFormProps) {
  return (
    <div className="bg-gray-900 shadow rounded-lg p-6 mb-8 border border-gray-800">
      <h2 className="text-lg font-medium mb-4">Submit Zone Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="zone-select" className="block text-base font-medium text-gray-300">Zone</label>
          <select 
            id="zone-select"
            value={zoneId}
            onChange={e => setZoneId(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md p-2 text-base min-h-[44px]"
          >
            {Object.values(ZONES).map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="crowd-select" className="block text-base font-medium text-gray-300">Crowd Level</label>
          <select 
            id="crowd-select"
            value={crowdLevel}
            onChange={e => setCrowdLevel(e.target.value as CrowdLevel)}
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md p-2 text-base min-h-[44px]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label htmlFor="incident-input" className="block text-base font-medium text-gray-300">Incident Type (Optional)</label>
          <input 
            id="incident-input"
            type="text"
            value={incidentType}
            onChange={e => setIncidentType(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md p-2 text-base min-h-[44px] placeholder-gray-500"
            placeholder="e.g. Spill, Broken Gate"
          />
        </div>
        <div>
          <label htmlFor="message-input" className="block text-base font-medium text-gray-300">Message</label>
          <textarea 
            id="message-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white rounded-md p-2 text-base min-h-[44px]"
            rows={3}
          />
        </div>
        {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] min-w-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-base"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
