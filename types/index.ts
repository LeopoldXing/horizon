declare interface User {
  $id: string;
  id?: string;
  userId: string;
  email: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  name: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
}

declare type Account = {
  id: string;
  $id?: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
}

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare interface SignInProps {
  email: string;
  password: string;
}

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type AccountTypes = "depository" | "credit" | "loan " | "investment" | "other";

declare interface ResponseDto {
  statusCode: string;
  message: string;
  data: any;
}
