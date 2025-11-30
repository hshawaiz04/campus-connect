import { Logo } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
          <p className="text-sm text-muted-foreground text-center md:text-left mt-4 md:mt-0">
            © {new Date().getFullYear()} CampusConnect. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">CampusConnect</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
