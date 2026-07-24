/**
 * On-device PDF generation and sharing. Builds the biodata document as HTML
 * and renders it to a PDF with expo-print, then hands it to the native share
 * sheet with expo-sharing. No network involved.
 */
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {Platform} from 'react-native';
import type {Biodata} from '../data/biodata';
import {buildHtml} from '../templates/html';

/** Render the biodata to a PDF file and return its local URI. */
export async function generatePdf(
  data: Biodata,
  templateId: string,
): Promise<string> {
  const html = buildHtml(data, templateId, true);
  const {uri} = await Print.printToFileAsync({html, base64: false});
  return uri;
}

/** Generate the PDF and open the native share sheet. */
export async function sharePdf(
  data: Biodata,
  templateId: string,
): Promise<void> {
  const uri = await generatePdf(data, templateId);
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    // Fall back to the OS print dialog if sharing isn't available.
    await Print.printAsync({uri});
    return;
  }
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share biodata PDF',
    UTI: 'com.adobe.pdf',
  });
}

/** Send the document straight to the OS print / save-as-PDF dialog. */
export async function printBiodata(
  data: Biodata,
  templateId: string,
): Promise<void> {
  const html = buildHtml(data, templateId, true);
  if (Platform.OS === 'ios') {
    await Print.printAsync({html});
  } else {
    const uri = await generatePdf(data, templateId);
    await Print.printAsync({uri});
  }
}
