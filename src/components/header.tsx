import Image from "next/image";
import Link from "next/link";
import { NavItems } from "./nav-items";
import { UserDropDown } from "./user-dropdown";

export function Header() {
  return (
    <div className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>

        <nav className="hidden sm:block">
          {/* nav items */}
          <NavItems />
        </nav>

        {/* user dropdown */}
        <UserDropDown />
      </div>
    </div>
  );
}
