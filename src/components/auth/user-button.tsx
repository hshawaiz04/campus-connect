'use client';

import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { doc } from 'firebase/firestore';

export function UserButton() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  // Check if the user is an admin
  const adminRoleRef = useMemoFirebase(
    () => (user ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user]
  );
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef);
  const isAdmin = !!adminRole;

  if (isUserLoading || (user && isAdminLoading)) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <nav className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
          Login
        </Button>
        <Button size="sm" onClick={() => router.push('/signup')}>
          Sign Up
        </Button>
      </nav>
    );
  }

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  const getInitials = (email: string | null) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName ?? 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <UserIcon className="mr-2" />
          Profile
        </DropdownMenuItem>
        {isAdmin && (
           <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
            <Shield className="mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
