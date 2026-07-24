/**
 * Biodata data model — the single source of truth for the form AND the
 * templates. Add or reorder fields here and both update automatically.
 *
 * Field `key`s are unique across all sections so a flat `values` map is enough.
 * Ported from the SnapBiodata web app so the native app produces identical
 * documents fully offline.
 */

export type FieldType =
  | 'text'
  | 'date'
  | 'time'
  | 'tel'
  | 'email'
  | 'select'
  | 'textarea';

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  /** Options for a `select` field. */
  options?: string[];
}

export interface SectionDef {
  id: string;
  title: string;
  fields: FieldDef[];
}

export const biodataSections: SectionDef[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    fields: [
      {key: 'fullName', label: 'Full Name', placeholder: 'e.g. Aarav Sharma'},
      {key: 'dob', label: 'Date of Birth', type: 'date'},
      {key: 'tob', label: 'Time of Birth', type: 'time'},
      {key: 'pob', label: 'Place of Birth', placeholder: 'City, State'},
      {key: 'height', label: 'Height', placeholder: `e.g. 5'10" (178 cm)`},
      {
        key: 'complexion',
        label: 'Complexion',
        type: 'select',
        options: ['Fair', 'Wheatish', 'Medium', 'Dusky'],
      },
      {key: 'bloodGroup', label: 'Blood Group', placeholder: 'e.g. B+'},
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',
        options: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'],
      },
      {
        key: 'diet',
        label: 'Diet',
        type: 'select',
        options: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'],
      },
      {key: 'religion', label: 'Religion', placeholder: 'e.g. Hindu'},
      {key: 'caste', label: 'Caste / Community', placeholder: 'e.g. Brahmin'},
      {key: 'gotra', label: 'Gotra', placeholder: 'e.g. Kashyap'},
      {key: 'rashi', label: 'Rashi (Moon Sign)', placeholder: 'e.g. Vrishabha'},
      {key: 'nakshatra', label: 'Nakshatra (Star)', placeholder: 'e.g. Rohini'},
      {
        key: 'manglik',
        label: 'Manglik',
        type: 'select',
        options: ['No', 'Yes', 'Anshik (Partial)', "Don't Know"],
      },
      {
        key: 'education',
        label: 'Education',
        placeholder: 'e.g. B.Tech, Computer Science',
      },
      {
        key: 'occupation',
        label: 'Occupation',
        placeholder: 'e.g. Software Engineer',
      },
      {key: 'income', label: 'Annual Income', placeholder: 'e.g. ₹12 LPA'},
      {
        key: 'hobbies',
        label: 'Hobbies',
        type: 'textarea',
        placeholder: 'e.g. Reading, Travel, Music',
      },
    ],
  },
  {
    id: 'family',
    title: 'Family Details',
    fields: [
      {
        key: 'fatherName',
        label: "Father's Name",
        placeholder: 'e.g. Rajesh Sharma',
      },
      {
        key: 'fatherOccupation',
        label: "Father's Occupation",
        placeholder: 'e.g. Businessman',
      },
      {
        key: 'motherName',
        label: "Mother's Name",
        placeholder: 'e.g. Sunita Sharma',
      },
      {
        key: 'motherOccupation',
        label: "Mother's Occupation",
        placeholder: 'e.g. Homemaker',
      },
      {
        key: 'siblings',
        label: 'Siblings',
        placeholder: 'e.g. 1 Brother, 1 Sister (married)',
      },
      {
        key: 'familyType',
        label: 'Family Type',
        type: 'select',
        options: ['Nuclear Family', 'Joint Family'],
      },
      {
        key: 'familyValues',
        label: 'Family Values',
        type: 'select',
        options: ['Traditional', 'Moderate', 'Liberal'],
      },
      {key: 'nativePlace', label: 'Native Place', placeholder: 'City, State'},
    ],
  },
  {
    id: 'contact',
    title: 'Contact Details',
    fields: [
      {
        key: 'contactPerson',
        label: 'Contact Person',
        placeholder: 'e.g. Rajesh Sharma (Father)',
      },
      {key: 'phone', label: 'Phone', type: 'tel', placeholder: 'e.g. +91 98765 43210'},
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'e.g. family@email.com',
      },
      {
        key: 'address',
        label: 'Address',
        type: 'textarea',
        placeholder: 'Full address for correspondence',
      },
    ],
  },
];

export interface Biodata {
  /** Heading line at the top, e.g. an invocation. Empty to hide. */
  header: string;
  /** Field values keyed by FieldDef.key. */
  values: Record<string, string>;
  /** Profile photo as a local file URI (or data URL). */
  photo?: string;
}

/** A saved biodata draft, persisted locally on device. */
export interface BiodataRecord {
  id: string;
  templateId: string;
  data: Biodata;
  createdAt: number;
  updatedAt: number;
}

/** A short list of common header invocations users can pick from. */
export const headerPresets: string[] = [
  '|| Shri Ganeshaya Namaha ||',
  '॥ श्री गणेशाय नमः ॥',
  '|| Om ||',
  'Marriage Biodata',
  '',
];

export const emptyBiodata: Biodata = {
  header: headerPresets[0],
  values: {},
};

/** Pre-filled example so a new draft's preview is never blank. */
export const sampleBiodata: Biodata = {
  header: headerPresets[0],
  values: {
    fullName: 'Aarav Sharma',
    dob: '1996-04-12',
    tob: '08:45',
    pob: 'Pune, Maharashtra',
    height: `5'10" (178 cm)`,
    complexion: 'Fair',
    bloodGroup: 'B+',
    maritalStatus: 'Never Married',
    diet: 'Vegetarian',
    religion: 'Hindu',
    caste: 'Brahmin',
    gotra: 'Kashyap',
    rashi: 'Vrishabha',
    nakshatra: 'Rohini',
    manglik: 'No',
    education: 'B.Tech, Computer Science',
    occupation: 'Software Engineer at a product company',
    income: '₹18 LPA',
    hobbies: 'Reading, Travelling, Cricket, Cooking',
    fatherName: 'Rajesh Sharma',
    fatherOccupation: 'Business',
    motherName: 'Sunita Sharma',
    motherOccupation: 'Homemaker',
    siblings: '1 elder sister (married)',
    familyType: 'Nuclear Family',
    familyValues: 'Moderate',
    nativePlace: 'Pune, Maharashtra',
    contactPerson: 'Rajesh Sharma (Father)',
    phone: '+91 98765 43210',
    email: 'sharma.family@email.com',
    address: '12, Shivaji Nagar, Pune, Maharashtra 411005',
  },
};

/** Format a value for display (e.g. nice date). Empty stays empty. */
export function formatValue(field: FieldDef, value: string | undefined): string {
  if (!value) {
    return '';
  }
  if (field.type === 'date') {
    const d = new Date(value + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return value;
}

export interface RenderedRow {
  label: string;
  value: string;
}

export interface RenderedSection {
  id: string;
  title: string;
  rows: RenderedRow[];
}

/** Build the list of non-empty rows per section, ready to render. */
export function renderedSections(data: Biodata): RenderedSection[] {
  return biodataSections
    .map(section => ({
      id: section.id,
      title: section.title,
      rows: section.fields
        .map(field => ({
          label: field.label,
          value: formatValue(field, data.values[field.key]),
        }))
        .filter(row => row.value.trim().length > 0),
    }))
    .filter(section => section.rows.length > 0);
}

/** The full name, with a sensible fallback for the preview. */
export function displayName(data: Biodata): string {
  return data.values.fullName?.trim() || 'Your Name';
}
