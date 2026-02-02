import React from "react";
import { Link, useResolvedPath } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useProductStore } from "../store/useProductStore";

const Navbar = () => {
  const {pathname} = useResolvedPath();
  const isHomepage = pathname === "/";
 const {products} = useProductStore()

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-4 justify-between ">
          {/* logo */}
          <div className="flex-1 lg:flex-none">
            <Link to={"/"} className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span className="font-semibold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  POSTGRESTORE
                </span>
              </div>
            </Link>
          </div>

          {/* Right section logos */}
         <div className="flex items-center gap-4">
         <ThemeSelector/>

{isHomepage && (
          <div className="indicator">
            <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
             <ShoppingBagIcon className="size-5"/>
             <span className="badge badge-sm badge-primary indicator-item mt-1 rounded-full">
              {products.length}
             </span>
            </div>
          </div>
)}
         </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navbar);
