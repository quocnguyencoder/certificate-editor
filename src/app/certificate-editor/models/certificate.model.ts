export interface CertificateTemplate {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: CertificateElement[];
}

export interface CertificateElement {
  type: 'text' | 'image' | 'shape';
  properties: any;
}
