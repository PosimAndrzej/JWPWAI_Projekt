import NavLink from "./nav-link";
import logoImg from '@/assets/logo.png';

export default function NavBar() {

    return (
            <nav className="flex p-8 pl-20 pr-20 items-stretch">
                <ul className="flex justify-between w-full items-center"> 
                    <li>
                        <NavLink href="/">
                            <img src={logoImg.src} alt="A plate with food on it" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href="/autorzy">Autorzy</NavLink>
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
    );
  }