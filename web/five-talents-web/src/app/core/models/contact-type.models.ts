export interface ContactTypeDto {
  id: number;
  name: string;
}

export interface ContactTypesDto {
  addressTypes: ContactTypeDto[];
  emailTypes: ContactTypeDto[];
  phoneTypes: ContactTypeDto[];
}
