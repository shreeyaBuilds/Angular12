import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user'
import { environment } from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class UserService {


    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    resetPwd(id: number, password: String) {
        return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { "password": password });
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    promote(id: string, action: string) {
        return this.http.post(`${environment.apiUrl}/users/promote`, { id, action });
    }

    getUserByUserNameAndPassword(email: string, password: string) {
        return this.http.get<User[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`);
    }

    getUserByUserName(email: string) {
        return this.http.get<User[]>(`${environment.apiUrl}/users?email=${email}`);
    }


    updateProfile(id: number, fname: string, lname: string, email: string, password: string) {
        return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { "fname": fname, "lname": lname, "email": email, "password": password });

    }
    getUserByUserId(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    updateAddress(id: number, address: Array<{}>) {
        return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { "address": address });

    }

    updatePaymentDetails(id: number, payments: Array<{}>) {
        return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, { "payment": payments });
    }
}