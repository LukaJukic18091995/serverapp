import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from '../interface/custom-response';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  servers$ = this.http
    .get<CustomResponse>(`${this.apiUrl}/server/server-list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    ) as Observable<CustomResponse>;

  save$ = (server: Server) =>
    this.http
      .post<CustomResponse>(`${this.apiUrl}/server/save-server`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      ) as Observable<CustomResponse>;

  ping$ = (ipAddress: string) =>
    this.http
      .get<CustomResponse>(`${this.apiUrl}/server/ping-server/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      ) as Observable<CustomResponse>;

  filter$ = (status: Status, response: CustomResponse) =>
    new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      subscriber.next(
        status === Status.ALL
          ? {
              ...response,
              successMessage: `Servers filtered by ${status} status`,
            }
          : {
              ...response,
              successMessage:
                response.data.servers.filter(
                  (server) => server.status === status
                ).length > 0
                  ? `Servers filtered by
          ${status === Status.SERVER_UP ? 'Server Up' : 'Server Down'} status`
                  : `No servers of ${status} found!`,
              data: {
                servers: response.data.servers.filter(
                  (server) => server.status === status
                ),
              },
            }
      );
      subscriber.complete();
    }).pipe(
      tap(console.log),
      catchError(this.handleError)
    ) as Observable<CustomResponse>;

  delete$ = (serverId: number) =>
    this.http
      .delete<CustomResponse>(`${this.apiUrl}/server/delete-server/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      ) as Observable<CustomResponse>;

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`Error - ${error.status}`);
  }
}
