
import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import UserDropdown from '@/Components/UserDropdown';

interface AdminLayoutProps {
    children: ReactNode;
}
export default function AdminLayout({ children }:AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                    
                        <div className="flex">
                        <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            <Link href={route('admin.dashboard')} className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                            <Link href={route('admin.users.index')} className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Utilisateurs</Link>
                            <Link href={route('admin.filieres.index')} className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Filières</Link>
                            <Link href={route('admin.ues.index')} className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">UE</Link>
                            <Link href={route('admin.matieres.index')} className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Matières</Link>
                            
                        </div>
                        <div className="p-4">
                            <UserDropdown /></div>

                    </div>
                </div>
            </nav>
            <main>{children}</main>
           </div>
       
        
    );
}
