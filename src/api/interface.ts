export interface IOptions {
  onSuccess?: (r: any) => void;
  onError?: (e: any) => void;
  manual?: boolean;
  pollingInterval?: number;
}
export enum ENumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}
