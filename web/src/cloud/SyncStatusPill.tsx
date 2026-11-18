// Small pill that shows the current cloud-sync state.

import { useEffect, useState } from 'react';
import { getSyncStatus, onSyncStatusChange, type SyncStatus } from './sync';
import './cloud.css';

const LABELS: Record<SyncStatus, string> = {
  synced: 'Saved to cloud ✓',
  syncing: 'Syncing…',
  'offline-dirty': "Offline — will sync when you're back",
  'local-only': 'Saved on this device',
  error: "Couldn't sync — will retry",
};

const CLASSES: Record<SyncStatus, string> = {
  synced: 'is-synced',
  syncing: 'is-syncing',
  'offline-dirty': 'is-offline',
  'local-only': 'is-local',
  error: 'is-error',
};

export default function SyncStatusPill() {
  const [status, setStatus] = useState<SyncStatus>(() => getSyncStatus());

  useEffect(() => onSyncStatusChange(setStatus), []);

  return (
    <span className={`cloud-pill ${CLASSES[status]}`} role="status">
      {LABELS[status]}
    </span>
  );
}
