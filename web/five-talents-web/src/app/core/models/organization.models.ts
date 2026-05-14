export interface Organization {
  id: number;
  name: string;
  level: number;
  parentOrganizationId?: number;
  parentName?: string;
  isActive: boolean;
  memberCount: number;
  description?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
}

export interface OrganizationTree {
  id: number;
  name: string;
  level: number;
  isActive: boolean;
  children: OrganizationTree[];
}

export interface OrganizationLevel {
  id: number;
  level: number;
  displayName: string;
  pluralDisplayName: string;
  isEnabled: boolean;
}

export interface OrganizationSettings {
  organizationId: number;
  primaryColor?: string;
  secondaryColor?: string;
  currency: string;
  fiscalYearStart: string;
  enableOnlineGiving: boolean;
  enableMemberPortal: boolean;
  enableAttendanceTracking: boolean;
  googleWorkspaceDomain?: string;
  googleWorkspaceEnabled: boolean;
}

export interface CreateOrganizationRequest {
  name: string;
  level: number;
  parentOrganizationId?: number;
  description?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timeZone?: string;
}

export interface UpdateOrganizationRequest {
  id: number;
  name: string;
  level: number;
  parentOrganizationId?: number;
  description?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timeZone?: string;
  isActive: boolean;
}
