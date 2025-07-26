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
        <div className="w-1/4 overflow-hidden flex-shrink-0">
          <Navbar />
        </div>

        <div className="flex flex-1 h-full gap-4 overflow-y-auto  pr-2 min-w-0">
          <div className={`min-w-0 ${shouldHideRightSidebar ? 'w-full' : 'w-2/3'}`}>
            <div className={`min-h-full p-4 ${shouldHideRightSidebar ? 'pl-5 pr-5' : 'pl-20 pr-20'}`}>
              <Outlet />
            </div>
          </div>

          {!shouldHideRightSidebar && (
            <div className="w-1/3 flex-shrink-0 sticky top-0 h-full">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
