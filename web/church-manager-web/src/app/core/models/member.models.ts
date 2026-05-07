export enum MemberStatus { Active = 0, Inactive = 1, Visitor = 2, Deceased = 3 }
export enum Gender { Male = 0, Female = 1, Other = 2, PreferNotToSay = 3 }
export enum MaritalStatus { Single = 0, Married = 1, Divorced = 2, Widowed = 3 }

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  status: MemberStatus;
  joinDate?: string;
  profilePhotoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  organizationId: number;
}

export interface MemberSummary {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  status: MemberStatus;
}

export interface CreateMemberRequest {
  organizationId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  joinDate?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
