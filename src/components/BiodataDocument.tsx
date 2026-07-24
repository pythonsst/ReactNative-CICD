import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {C, serif} from '../theme';
import {
  renderedSections,
  displayName,
  type Biodata,
  type RenderedSection,
} from '../data/biodata';

interface Props {
  data: Biodata;
  templateId: string;
}

/**
 * Native, on-device rendering of the biodata document — no WebView. This is
 * what the user previews on screen; the exported PDF is produced separately by
 * expo-print from matching HTML. Rendering natively keeps the preview crisp and
 * reliable and means the app ships zero web views.
 */
export default function BiodataDocument({
  data,
  templateId,
}: Props): React.JSX.Element {
  const sections = renderedSections(data);
  if (templateId === 'elegant') {
    return <Elegant data={data} sections={sections} />;
  }
  if (templateId === 'modern') {
    return <Modern data={data} sections={sections} />;
  }
  return <Traditional data={data} sections={sections} />;
}

interface InnerProps {
  data: Biodata;
  sections: RenderedSection[];
}

function Rows({
  sections,
  labelColor,
  valueColor,
  sepColor,
  titleColor,
}: {
  sections: RenderedSection[];
  labelColor: string;
  valueColor: string;
  sepColor: string;
  titleColor: string;
}): React.JSX.Element {
  return (
    <>
      {sections.map(section => (
        <View key={section.id} style={docStyles.section}>
          <View style={docStyles.sectionTitleRow}>
            <Text style={[docStyles.sectionTitle, {color: titleColor}]}>
              {section.title}
            </Text>
            <View style={[docStyles.sectionRule, {backgroundColor: sepColor}]} />
          </View>
          {section.rows.map(row => (
            <View key={row.label} style={docStyles.row}>
              <Text style={[docStyles.rowLabel, {color: labelColor}]}>
                {row.label}
              </Text>
              <Text style={[docStyles.rowColon, {color: labelColor}]}>:</Text>
              <Text style={[docStyles.rowValue, {color: valueColor}]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </>
  );
}

// ── Traditional ──────────────────────────────────────────────────────────────
function Traditional({data, sections}: InnerProps): React.JSX.Element {
  return (
    <View style={docStyles.page}>
      <View style={docStyles.tradFrameOuter}>
        <View style={docStyles.tradFrameInner}>
          {!!data.header && (
            <Text style={docStyles.tradHeader}>
              <Text style={docStyles.gold}>❁ </Text>
              <Text style={docStyles.tradHeaderText}>{data.header}</Text>
              <Text style={docStyles.gold}> ❁</Text>
            </Text>
          )}
          <View style={docStyles.tradNameRow}>
            <View style={docStyles.flex1}>
              <Text style={docStyles.tradName}>{displayName(data)}</Text>
              <View style={docStyles.tradNameUnderline} />
            </View>
            {!!data.photo && (
              <View style={docStyles.tradPhotoFrame}>
                <Image source={{uri: data.photo}} style={docStyles.tradPhoto} />
              </View>
            )}
          </View>
          <Rows
            sections={sections}
            titleColor={C.maroon}
            labelColor={C.ink}
            valueColor={C.ink}
            sepColor={C.gold}
          />
        </View>
      </View>
    </View>
  );
}

// ── Elegant ──────────────────────────────────────────────────────────────────
function Elegant({data, sections}: InnerProps): React.JSX.Element {
  return (
    <View style={docStyles.page}>
      <View style={docStyles.elegantPad}>
        <View style={docStyles.center}>
          {!!data.header && (
            <Text style={docStyles.elegantHeader}>{data.header.toUpperCase()}</Text>
          )}
          {!!data.photo && (
            <View style={docStyles.elegantPhotoWrap}>
              <Image source={{uri: data.photo}} style={docStyles.elegantPhoto} />
            </View>
          )}
          <Text style={docStyles.elegantName}>{displayName(data)}</Text>
          <View style={docStyles.elegantDivider}>
            <View style={docStyles.elegantRule} />
            <Text style={docStyles.gold}>❖</Text>
            <View style={docStyles.elegantRule} />
          </View>
        </View>
        {sections.map(section => (
          <View key={section.id} style={docStyles.section}>
            <Text style={docStyles.elegantSectionTitle}>
              {section.title.toUpperCase()}
            </Text>
            {section.rows.map(row => (
              <View key={row.label} style={docStyles.elegantRow}>
                <Text style={docStyles.elegantRowLabel}>{row.label}</Text>
                <Text style={docStyles.elegantRowValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Modern ───────────────────────────────────────────────────────────────────
function Modern({data, sections}: InnerProps): React.JSX.Element {
  const sidebar = sections.filter(s => s.id === 'contact');
  const main = sections.filter(s => s.id !== 'contact');
  return (
    <View style={docStyles.page}>
      <View style={docStyles.modernRow}>
        <View style={docStyles.modernSidebar}>
          {!!data.photo && (
            <View style={docStyles.modernPhotoWrap}>
              <Image source={{uri: data.photo}} style={docStyles.modernPhoto} />
            </View>
          )}
          {sidebar.map(section => (
            <View key={section.id} style={docStyles.modernSideSection}>
              <Text style={docStyles.modernSideTitle}>
                {section.title.toUpperCase()}
              </Text>
              {section.rows.map(row => (
                <View key={row.label} style={docStyles.modernSideItem}>
                  <Text style={docStyles.modernSideLabel}>{row.label}</Text>
                  <Text style={docStyles.modernSideValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={docStyles.modernMain}>
          {!!data.header && (
            <Text style={docStyles.modernHeader}>{data.header.toUpperCase()}</Text>
          )}
          <Text style={docStyles.modernName}>{displayName(data)}</Text>
          <View style={docStyles.modernNameUnderline} />
          <Rows
            sections={main}
            titleColor={C.maroon}
            labelColor={C.ink}
            valueColor={C.ink}
            sepColor={C.gold}
          />
        </View>
      </View>
    </View>
  );
}

const docStyles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  flex1: {flex: 1},
  center: {alignItems: 'center'},
  gold: {color: C.gold},
  section: {marginTop: 20},
  sectionTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10},
  sectionTitle: {
    fontFamily: serif,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionRule: {flex: 1, height: 1, opacity: 0.5},
  row: {flexDirection: 'row', marginBottom: 7, alignItems: 'flex-start'},
  rowLabel: {width: '36%', fontSize: 13, fontWeight: '600', lineHeight: 19},
  rowColon: {width: 12, fontSize: 13, lineHeight: 19},
  rowValue: {flex: 1, fontSize: 13, lineHeight: 19},

  // Traditional
  tradFrameOuter: {
    borderWidth: 2,
    borderColor: C.maroon,
    padding: 4,
  },
  tradFrameInner: {
    borderWidth: 1,
    borderColor: C.gold,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  tradHeader: {textAlign: 'center', marginBottom: 6},
  tradHeaderText: {
    fontFamily: serif,
    fontSize: 14,
    color: C.maroon,
    letterSpacing: 0.5,
  },
  tradNameRow: {flexDirection: 'row', alignItems: 'flex-start', marginTop: 12},
  tradName: {
    fontFamily: serif,
    fontSize: 27,
    fontWeight: '700',
    color: C.maroon,
    lineHeight: 32,
  },
  tradNameUnderline: {
    height: 2,
    width: 84,
    backgroundColor: C.gold,
    marginTop: 8,
  },
  tradPhotoFrame: {
    borderWidth: 2,
    borderColor: C.gold,
    padding: 3,
    marginLeft: 14,
  },
  tradPhoto: {width: 92, height: 116},

  // Elegant
  elegantPad: {paddingHorizontal: 26, paddingVertical: 28},
  elegantHeader: {
    fontSize: 11,
    letterSpacing: 3,
    color: C.gold,
    marginBottom: 16,
  },
  elegantPhotoWrap: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: C.gold,
    overflow: 'hidden',
    marginBottom: 16,
  },
  elegantPhoto: {width: '100%', height: '100%'},
  elegantName: {
    fontFamily: serif,
    fontSize: 28,
    fontWeight: '600',
    color: C.ink,
    letterSpacing: 0.5,
  },
  elegantDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  elegantRule: {width: 48, height: 1, backgroundColor: C.gold, opacity: 0.5},
  elegantSectionTitle: {
    fontFamily: serif,
    fontSize: 12,
    fontWeight: '700',
    color: C.maroon,
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  elegantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
    paddingBottom: 6,
    marginBottom: 8,
    gap: 16,
  },
  elegantRowLabel: {fontSize: 13, color: C.muted},
  elegantRowValue: {fontSize: 13, color: C.ink, fontWeight: '500', flexShrink: 1, textAlign: 'right'},

  // Modern
  modernRow: {flexDirection: 'row'},
  modernSidebar: {
    width: '38%',
    backgroundColor: C.maroon,
    paddingHorizontal: 14,
    paddingVertical: 22,
  },
  modernPhotoWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: C.gold,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 18,
  },
  modernPhoto: {width: '100%', height: '100%'},
  modernSideSection: {marginBottom: 20},
  modernSideTitle: {
    fontFamily: serif,
    fontSize: 12,
    fontWeight: '700',
    color: C.gold,
    letterSpacing: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    paddingBottom: 5,
    marginBottom: 10,
  },
  modernSideItem: {marginBottom: 10},
  modernSideLabel: {fontSize: 11, color: 'rgba(255,255,255,0.6)'},
  modernSideValue: {fontSize: 12.5, color: '#fff', fontWeight: '500', marginTop: 1},
  modernMain: {flex: 1, paddingHorizontal: 16, paddingVertical: 22},
  modernHeader: {fontSize: 10.5, letterSpacing: 2.5, color: C.gold, marginBottom: 6},
  modernName: {
    fontFamily: serif,
    fontSize: 25,
    fontWeight: '700',
    color: C.maroon,
    lineHeight: 30,
  },
  modernNameUnderline: {height: 3, width: 64, backgroundColor: C.gold, marginTop: 8},
});
