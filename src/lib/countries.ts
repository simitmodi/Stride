
import data from './countries.json';

export type Country = {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
};

export const countries: Country[] = data;
