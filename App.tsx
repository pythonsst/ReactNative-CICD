import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import {
  SafeAreaInsetsContext,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

// Static safe-area insets read once from the native window metrics.
//
// We intentionally do NOT mount <SafeAreaProvider>: under the React Native
// new architecture (bridgeless), its native view emits inset changes through
// the legacy RCTEventEmitter path, which isn't registered as callable and
// throws an uncaught error on every launch. Feeding the context statically
// gives every screen correct insets via useSafeAreaInsets() with no native
// event emitter — the app is portrait, so insets never need to change at
// runtime anyway.
const INSETS = initialWindowMetrics?.insets ?? {
  top: Platform.OS === 'ios' ? 47 : 0,
  right: 0,
  bottom: Platform.OS === 'ios' ? 34 : 0,
  left: 0,
};
import {C} from './src/theme';
import {sampleBiodata, type BiodataRecord} from './src/data/biodata';
import {defaultTemplateId} from './src/templates';
import {listRecords, saveRecord, deleteRecord, makeId} from './src/lib/storage';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';
import PreviewScreen from './src/screens/PreviewScreen';

type Screen = 'home' | 'editor' | 'preview';

function newRecord(): BiodataRecord {
  const now = Date.now();
  return {
    id: makeId(),
    templateId: defaultTemplateId,
    // Start from the sample so the preview is never blank and users see how a
    // finished biodata looks; they overwrite the fields with their own details.
    data: {...sampleBiodata, values: {...sampleBiodata.values}},
    createdAt: now,
    updatedAt: now,
  };
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('home');
  const [records, setRecords] = useState<BiodataRecord[]>([]);
  const [active, setActive] = useState<BiodataRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const activeRef = useRef<BiodataRecord | null>(null);

  const setActiveRecord = useCallback((record: BiodataRecord | null) => {
    activeRef.current = record;
    setActive(record);
  }, []);

  const refresh = useCallback(async () => {
    const all = await listRecords();
    setRecords(all);
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const persist = useCallback(
    async (record: BiodataRecord) => {
      await saveRecord(record);
      await refresh();
    },
    [refresh],
  );

  const goHome = useCallback(async () => {
    setScreen('home');
    setActiveRecord(null);
    await refresh();
  }, [refresh, setActiveRecord]);

  const onCreate = useCallback(() => {
    setActiveRecord(newRecord());
    setScreen('editor');
  }, [setActiveRecord]);

  // Open a filled sample straight into the preview so first-time users can see
  // what a finished biodata looks like. It isn't saved unless they edit it.
  const onPreviewSample = useCallback(() => {
    setActiveRecord(newRecord());
    setScreen('preview');
  }, [setActiveRecord]);

  const onOpen = useCallback(
    (record: BiodataRecord) => {
      setActiveRecord(record);
      setScreen('editor');
    },
    [setActiveRecord],
  );

  const onDelete = useCallback(
    async (id: string) => {
      await deleteRecord(id);
      await refresh();
    },
    [refresh],
  );

  // Keep the working copy live in memory as the user edits. We deliberately do
  // NOT write to storage on every keystroke: each save is a full
  // read-modify-write of the records list, so concurrent writes during fast
  // typing could race and drop edits. Persistence happens on navigation
  // (Back / Preview) instead, which is race-free.
  const onEditorChange = useCallback(
    (record: BiodataRecord) => {
      setActiveRecord(record);
    },
    [setActiveRecord],
  );

  const onEditorBack = useCallback(
    (record: BiodataRecord) => {
      persist(record).then(goHome);
    },
    [persist, goHome],
  );

  const onPreview = useCallback(
    (record: BiodataRecord) => {
      setActiveRecord(record);
      persist(record);
      setScreen('preview');
    },
    [persist, setActiveRecord],
  );

  // Android hardware back navigation between screens.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'preview') {
        setScreen('editor');
        return true;
      }
      if (screen === 'editor') {
        const current = activeRef.current;
        if (current) {
          persist(current).then(goHome);
        } else {
          goHome();
        }
        return true;
      }
      return false; // home: let the OS handle (exit).
    });
    return () => sub.remove();
  }, [screen, persist, goHome]);

  let body: React.JSX.Element;
  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.maroon} />
      </View>
    );
  } else if (screen === 'editor' && active) {
    body = (
      <EditorScreen
        record={active}
        onChange={onEditorChange}
        onPreview={onPreview}
        onBack={onEditorBack}
      />
    );
  } else if (screen === 'preview' && active) {
    body = (
      <PreviewScreen
        record={active}
        onEdit={() => setScreen('editor')}
        onBack={goHome}
      />
    );
  } else {
    body = (
      <HomeScreen
        records={records}
        onCreate={onCreate}
        onOpen={onOpen}
        onDelete={onDelete}
        onPreviewSample={onPreviewSample}
      />
    );
  }

  return (
    <SafeAreaInsetsContext.Provider value={INSETS}>
      <View style={styles.root}>{body}</View>
    </SafeAreaInsetsContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.canvas},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default App;
