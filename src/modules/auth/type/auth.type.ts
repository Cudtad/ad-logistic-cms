import { Rule } from "@/common/type";

export type User = {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    active: boolean;
    rules: Rule[],
    role: string
}