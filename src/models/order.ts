export interface Order {
  id: any;
  name: string;
  amount: string;
  quantity: number;
  image: any;
  status: string,
  createdAt: string;
  requesterName?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  message?: string;
  rawStatus?: string;
  emailDeliveryStatus?: string;
}