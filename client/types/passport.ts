export interface PassportFormData {
    name: string;
    age: string;
    birthdate: string;
    country: string;
  }
  
  export interface PassportData {
    exists: boolean;
    name: string;
    age: number;
    birthdate: string;
    country: string;
    passportId: string;
  }
  
  export interface VerifyResult {
    hasPassport: boolean;
    name: string;
    age: string;
    birthdate: string;
    country: string;
    passportId: string;
  }