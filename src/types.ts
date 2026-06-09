export interface Demand {
  id: string;
  title: string;
  client: string;
  status: 'solicitado' | 'producao' | 'aprovacao' | 'publicado';
  briefing: string;
  channel: string;
  date: string;
  whatsappContact: string;
  approvalSign?: string;
  notes?: string;
  imgUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logoText: string;
  contactName: string;
  contactPhone: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'sent' | 'received';
  timestamp: string;
}
