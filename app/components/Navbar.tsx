import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex fixed justify-between w-full bg-slate-700 py-1 text-white gap-8 h-10">
      <div className="logo">
        <span className="hidden sm:inline sm:font-semibold sm:text-lg w-[1/3] ml-5 sm:box-border">
            Task Manager
        </span>
      </div>
      <ul className="flex gap-14 mx-10">
        <li
         onClick={() => router.push("/home")}
         className="hover:text-black w-16 hover:cursor-pointer">
          <a href="#todos"></a> My tasks
        </li>
        <li 
         onClick={() => router.push("/profile")}
         className="hover:text-black w-16 hover:cursor-pointer">
          <a href="#todos"></a> Profile
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;