import { Link } from "react-router-dom";
import { LOGIN_URL } from "../../common/constants";

const Navbar = ({ children }) => {
  return (
    <header className="p-4 w-full h-20 fixed flex justify-between items-stretch shadow-sm bg-white">
      <Link
        to={LOGIN_URL}
        className="px-4 mr-4 flex items-center cursor-pointer text-slate-500 text-lg font-bold"
      >
        W<span className="text-[#de1a35]">O</span>
        <span className="text-[#d29400]">O</span>
        <span className="text-[#145dc7]">D</span>
        <span className="text-[#227e0f]">O</span>NG
      </Link>
      <section className="flex">{children}</section>
    </header>
  );
};

export default Navbar;
