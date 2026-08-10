export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  business?: string;
}

export interface LeadResponse {
  status: string;
  id: string;
}
