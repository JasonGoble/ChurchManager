export enum MemberStatus { Active = 0, Inactive = 1, Visitor = 2, Deceased = 3 }
export enum Gender { Male = 0, Female = 1, Other = 2, PreferNotToSay = 3 }
export enum MaritalStatus { Single = 0, Married = 1, Divorced = 2, Widowed = 3 }

export interface MemberAddress {
  id: number;
  contactTypeId: number;
  contactTypeName: string;
  isPrimary: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface MemberEmail {
  id: number;
  contactTypeId: number;
  contactTypeName: string;
  isPrimary: boolean;
  email: string;
}

export interface MemberPhone {
  id: number;
  contactTypeId: number;
  contactTypeName: string;
  isPrimary: boolean;
  phoneNumber: string;
  isMobile: boolean;
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  status: MemberStatus;
  joinDate?: string;
  profilePhotoUrl?: string;
  notes?: string;
  organizationId: number;
  orgName?: string;
  userId?: string;
  isLinkedToUser: boolean;
  sharePhoneWithNetwork: boolean;
  shareEmailWithNetwork: boolean;
  shareAddressWithNetwork: boolean;
  addresses: MemberAddress[];
  emails: MemberEmail[];
  phones: MemberPhone[];
}

export interface MemberSummary {
  id: number;
  fullName: string;
  primaryEmail?: string;
  primaryPhone?: string;
  status: MemberStatus;
  organizationId: number;
  orgName?: string;
}

export interface MemberAddressInput {
  id?: number;
  contactTypeId: number;
  isPrimary: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface MemberEmailInput {
  id?: number;
  contactTypeId: number;
  isPrimary: boolean;
  email: string;
}

export interface MemberPhoneInput {
  id?: number;
  contactTypeId: number;
  isPrimary: boolean;
  phoneNumber: string;
  isMobile: boolean;
}

export interface CreateMemberRequest {
  organizationId: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  joinDate?: string;
  addresses?: MemberAddressInput[];
  emails?: MemberEmailInput[];
  phones?: MemberPhoneInput[];
}

export interface UpdateMemberRequest {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  joinDate?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  status: MemberStatus;
  notes?: string;
  addresses?: MemberAddressInput[];
  emails?: MemberEmailInput[];
  phones?: MemberPhoneInput[];
}
