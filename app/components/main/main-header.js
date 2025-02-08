
import Link from "next/link";
import NavBar from "../navigation/nav-bar";
import Background from "./main-background";


export default function MainHeader() {

    return (
        <header className="">
            <Background />
            <NavBar />
        </header>
    );
  }