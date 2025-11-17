import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { URL_SERVICIOS } from '../config/config';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public loggedIn = new BehaviorSubject<boolean>(false);
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token_cliente');
    if (token) {
      this.token = token;
      this.loggedIn.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${URL_SERVICIOS}/login`, { email, password }).pipe(
      map((resp: any) => {
        if (resp?.access_token && resp?.user) {
          localStorage.setItem('token_cliente', resp.access_token);
          this.token = resp.access_token;
          localStorage.setItem('user', JSON.stringify(resp.user));
          localStorage.setItem('role', resp.role);
          this.loggedIn.next(true);
          return resp;
        }
        return null;
      }),
      catchError((err: any) => {
        console.error("Error en login:", err);
        throw err;
      })
    );
  }

  register(data: any) {
    return this.http.post(`${URL_SERVICIOS}/register`, data)
      .pipe(catchError(err => {
        console.error("❌ Error en el registro:", err);
        throw err;
      }));
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isLoggedInValue(): boolean {
    return this.loggedIn.getValue();
  }

  isAuthenticated(): boolean {
    return this.loggedIn.getValue();
  }

  logout() {
    localStorage.removeItem('token_cliente');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.token = null;
    this.loggedIn.next(false);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem('token_cliente');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${URL_SERVICIOS}/reset-password`, { email });
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return of(null);
    }
    
    return this.http.post<any>(`${URL_SERVICIOS}/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap(response => {
          if (response?.access_token) {
            localStorage.setItem('token_cliente', response.access_token);
            this.token = response.access_token;
          }
          if (response?.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }
        }),
        catchError(err => {
          console.error("❌ Error al refrescar token:", err);
          this.logout();
          return of(null);
        })
      );
  }
}