import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Upload } from 'lucide-react';
import { UserButton } from '@/components/auth/user-button';

export default function Header() {
  const navLinks = [
    { href: "/#recommendation-tool", label: "Recommendations" },
    { href: "/colleges", label: "Colleges" },
    { href: "/aptitude-test", label: "Aptitude Test" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block font-headline">
                CampusConnect
              </span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Desktop Logo and Nav */}
        <div className="mr-auto flex items-center">
           <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold md:inline-block font-headline">
              CampusConnect
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="transition-colors text-foreground/60 hover:text-foreground/80">
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center justify-end space-x-2">
          {process.env.NODE_ENV === 'development' && (
              <Link href="/admin/seed">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Seed Data
                </Button>
              </Link>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
