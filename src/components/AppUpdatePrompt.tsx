import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppUpdates} from '../hooks/useAppUpdates';
import {resolvePrompt, type UpdatePrompt} from '../hooks/updateState';
import {C, serif, MAX_CONTENT_WIDTH} from '../theme';

type Copy = {
  title: string;
  body: (latestStoreVersion?: string) => string;
  primary: string;
};

// Time for the outgoing sheet to finish sliding down before the next one.
const SWAP_DELAY_MS = 450;

const COPY: Record<UpdatePrompt, Copy> = {
  // A newer native build is live on the App Store / Play Store.
  store: {
    title: 'New version available',
    body: v =>
      `${
        v ? `SnapBiodata v${v}` : 'A new version of SnapBiodata'
      } is available with the latest features and fixes. Update now for the best experience.`,
    primary: 'Update now',
  },
  // An OTA bundle has finished downloading; it applies on restart.
  ota: {
    title: 'Update ready',
    body: () =>
      'We’ve downloaded the latest improvements. Restart the app to see the new changes.',
    primary: 'Restart now',
  },
};

/**
 * App-wide update prompt (bottom sheet), mounted once at the root so it shows
 * on whichever screen the user is on — Home, Editor or Preview.
 *
 * - Store update → "Update now" opens the App Store / Play in-app update.
 * - OTA ready    → "Restart now" reloads into the downloaded bundle.
 *
 * With both pending, the store prompt shows first; "Later" on it reveals the
 * OTA prompt. "Later" hides a prompt until the next cold start. A downloaded
 * OTA is applied automatically on the next cold start anyway, so dismissing it never
 * strands the user on old code.
 */
type Props = {
  // Temporarily hide (e.g. on Settings, which shows the update inline).
  hidden?: boolean;
};

export const AppUpdatePrompt: React.FC<Props> = ({hidden = false}) => {
  const insets = useSafeAreaInsets();
  const {
    storeUpdateAvailable,
    otaReady,
    latestStoreVersion,
    applyOta,
    goToStore,
    devPreviewKey,
  } = useAppUpdates();
  const [dismissed, setDismissed] = useState<Record<UpdatePrompt, boolean>>({
    store: false,
    ota: false,
  });

  // Dev menu preview: re-show a prompt even if "Later" was tapped before.
  useEffect(() => {
    if (devPreviewKey > 0) {
      setDismissed({store: false, ota: false});
    }
  }, [devPreviewKey]);

  // Store first; after "Later" on it, the OTA prompt (if any) follows. An OTA
  // that is still downloading stays silent until it is ready to apply.
  const kind = resolvePrompt({storeUpdateAvailable, otaReady, dismissed});

  // When the prompt switches (store → OTA) the sheet slides down first and the
  // next one slides up, instead of swapping text inside an open sheet. The
  // switch is detected during render so the new copy never flashes.
  const [prevKind, setPrevKind] = useState(kind);
  const [swapping, setSwapping] = useState(false);
  if (kind !== prevKind) {
    setPrevKind(kind);
    if (prevKind !== null && kind !== null) {
      setSwapping(true);
    }
  }
  useEffect(() => {
    if (!swapping) {return;}
    const t = setTimeout(() => setSwapping(false), SWAP_DELAY_MS);
    return () => clearTimeout(t);
  }, [swapping]);
  const shown = swapping ? null : kind;

  // Keep rendering the last copy while the sheet animates out.
  const [lastShown, setLastShown] = useState<UpdatePrompt>('store');
  if (shown && shown !== lastShown) {
    setLastShown(shown);
  }
  const copy = COPY[shown ?? lastShown];

  const dismiss = () => {
    if (shown) {
      setDismissed(d => ({...d, [shown]: true}));
    }
  };

  const onPrimary = () => {
    if (shown === 'store') {
      // Leave the sheet up: if the user comes back without updating, it is
      // still there. Play's immediate flow returns here only on cancel.
      goToStore();
    } else if (shown === 'ota') {
      applyOta();
    }
  };

  return (
    <Modal
      visible={shown !== null && !hidden}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss update prompt"
        />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + 20}]}>
          <View style={styles.handle} />
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>↻</Text>
          </View>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.body}>{copy.body(latestStoreVersion)}</Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={onPrimary}
            accessibilityRole="button"
            accessibilityLabel={copy.primary}>
            <Text style={styles.primaryText}>{copy.primary}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.7}
            onPress={dismiss}
            accessibilityRole="button"
            accessibilityLabel="Later">
            <Text style={styles.secondaryText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    backgroundColor: C.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 10,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.line,
    marginBottom: 18,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {fontSize: 28, color: C.maroon, fontWeight: '700'},
  title: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 22,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    backgroundColor: C.maroon,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  secondaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryText: {color: C.muted, fontSize: 15, fontWeight: '600'},
});
