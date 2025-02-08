'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({href, children}){
    const path = usePathname();

    return (
        <div className="flex">
            <Link
                href={href}
                    className="flex radial-gradient h-20 w-20 rounded-full items-center justify-center"
                >
                    {children}
            </Link>
        </div>
        
    );
}