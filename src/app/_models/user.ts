import { AddressDetails } from "./addressDetails";

export interface User {
    id?: number;
    fname?: string;
    lname?: string;
    email?: string;
    phone?: number;
    password?: string
    address?: Array<AddressDetails>;
    payment?: Array<{}>
}
