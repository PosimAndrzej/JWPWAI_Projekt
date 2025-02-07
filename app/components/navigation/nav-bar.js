import NavLink from "./nav-link";

export default function NavBar() {

    return (
            <nav className="">
                <ul>
                    <li>
                        <NavLink href="/">Strona główna</NavLink>
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