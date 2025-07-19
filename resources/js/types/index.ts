import { Page } from '@inertiajs/core';

export interface User {
    id: number;
    name: string;
    email: string;
    prenom?: string;
    sexe?: string;
    tel?: string;
}

export interface ExtendedUser extends User {
    prenom: string;
    sexe: string;
    tel: string;
}

export interface FileObject {
    name: string;
    content: string;
    type: string;
    file: string;
    imageUrl: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    laravelVersion?: string;
    phpVersion?: string;
    [key: string]: any;
}

declare module '@inertiajs/core' {
    interface PageProps extends PageProps {}
} 