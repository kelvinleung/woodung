import { Link } from "react-router-dom";

const Navbar = ({ children }) => {
  return (
    <header className="p-4 w-full h-20 fixed flex justify-between items-stretch shadow-sm bg-white">
      <Link
        to={"/"}
        className="px-4 mr-4 flex items-center cursor-pointer text-sky-500 text-lg font-bold"
      >
        Woodong
      </Link>
      <section className="flex">{children}</section>
    </header>
  );
};

export default Navbar;
