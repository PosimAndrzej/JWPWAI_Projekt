import NavLink from "./nav-link";
import logoImg from '@/assets/logo.png';
import Link from "next/link";

export default function NavBar() {

    return (
        <div className="text-lg font-bold">
            <nav className=" flex p-8 pl-40 pr-40 items-stretch">
                <ul className="flex justify-between w-full items-center"> 
                    <li>
                        <Link href="/">
                            <img src={logoImg.src} alt="Logo z kartami" />
                        </Link>
                    </li>
                    <li>
                        <NavLink href="/autorzy">Autorzy</NavLink>
                    </li>
                    <li>
                        <NavLink href="/gra">Gra</NavLink>
                    </li>
                    <li>
                        <NavLink href="/ranking">Ranking</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
            
    );
  }