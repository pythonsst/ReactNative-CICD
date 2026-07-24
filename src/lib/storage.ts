/**
 * Local persistence for biodata drafts. Everything lives on the device via
 * AsyncStorage — the app is fully functional offline and stores no data
 * remotely.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {BiodataRecord} from '../data/biodata';

const KEY = 'snapbiodata:records:v1';

export async function listRecords(): Promise<BiodataRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as BiodataRecord[];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

async function writeAll(records: BiodataRecord[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(records));
}

/** Insert or update a record (matched by id). */
export async function saveRecord(record: BiodataRecord): Promise<void> {
  const all = await listRecords();
  const idx = all.findIndex(r => r.id === record.id);
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.push(record);
  }
  await writeAll(all);
}

export async function deleteRecord(id: string): Promise<void> {
  const all = await listRecords();
  await writeAll(all.filter(r => r.id !== id));
}

/** A stable-enough unique id without pulling in a uuid dependency. */
export function makeId(): string {
  return `bd_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}
