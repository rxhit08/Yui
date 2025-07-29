import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import RightSidebar from "./RightSidebar";

function AppLayout() {
  const location = useLocation();

  const hideRightSidebarRoutes = ["/messages"];
  const shouldHideRightSidebar = hideRightSidebarRoutes.includes(location.pathname);

  return (
    <div className="h-screen w-full bg-cover bg-center bg-no-repeat bg-black">
      <div className="flex h-full w-full overflow-hidden">
        {/* Navbar - responsive width */}
        <div className="flex-shrink-0 sticky top-0 h-screen z-20 bg-black border-r border-gray-800 
                        w-16 sm:w-20 lg:w-1/4">
          <Navbar />
        </div>

        {/* Main content and RightSidebar wrapper */}
        <div className="flex flex-1 h-full gap-4 overflow-y-auto pr-2 min-w-0">
          {/* Main Content */}
          <div className={`min-w-0 ${shouldHideRightSidebar ? 'w-full' : 'w-2/3'}`}>
            <div className={`min-h-full p-4 ${shouldHideRightSidebar ? 'pl-5 pr-5' : 'pl-4 pr-4 md:pl-10 md:pr-10 lg:pl-20 lg:pr-20'}`}>
              <Outlet />
            </div>
          </div>

          {/* RightSidebar - responsive hide and width */}
          {!shouldHideRightSidebar && (
            <div className="hidden sm:block flex-shrink-0 sticky top-0 h-screen 
                            w-1/4 lg:w-1/3 bg-black border-l border-gray-800 z-20">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;



/*
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import RightSidebar from "./RightSidebar";

function AppLayout() {
  const location = useLocation();
  const hideRightSidebarRoutes = ["/messages"];
  const shouldHideRightSidebar = hideRightSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-black">
      <div className="flex h-full w-full overflow-hidden">
        <div className="w-16 md:w-20 lg:w-1/4 overflow-hidden flex-shrink-0 border-r border-gray-800">
          <Navbar />
        </div>

        <div className="flex flex-1 h-full gap-4 overflow-y-auto pr-2 min-w-0">

          <div className={`min-w-0 ${shouldHideRightSidebar ? 'w-full' : 'w-full lg:w-2/3'}`}>
            <div className={`min-h-full p-4 ${shouldHideRightSidebar ? 'pl-5 pr-5' : 'pl-5 md:pl-10 pr-5 md:pr-10'}`}>
              <Outlet />
            </div>
          </div>

          {!shouldHideRightSidebar && (
            <div className="hidden sm:block flex-shrink-0 h-full sticky top-0 w-0 md:w-1/4 lg:w-1/3">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
*/