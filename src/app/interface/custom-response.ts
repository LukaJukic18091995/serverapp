import { Server } from './server';

export interface CustomResponse {
  timeStamp: Date;
  statusCode: number;
  status: string;
  errorReasonMessage: string;
  successMessage: string;
  developerMessage: string;
  data: { servers?: Server[], server?: Server };
}
