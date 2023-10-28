import { ICustomerSignUpBody } from "./customer.dto";
import { Ivendor } from "./vendor.dto";

export type AuthPayload = Ivendor | ICustomerSignUpBody;