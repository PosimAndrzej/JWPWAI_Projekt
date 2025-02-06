import NavLink from "./nav-link";
import logoImg from '@/assets/logo.png';

export default function NavBar() {

    return (
            <nav className="flex items-center p-8">
                <NavLink href="/">
                    <img src={logoImg.src} alt="A plate with food on it" />
                </NavLink>
                <ul className="flex g-1"> 
                    <li>
                        <NavLink href="/autorzy">Autorzy</NavLink>
                    </li>
                    <li>
                        <NavLink href="/autorzy">Autorzy</NavLink>
                    </li>
                    <li>
                        <NavLink href="/autorzy">Autorzy</NavLink>
                    </li>
                </ul>
            </nav>
    );
  }