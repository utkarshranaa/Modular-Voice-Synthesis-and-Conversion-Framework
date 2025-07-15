"use client";

import { ReactNode, useEffect } from "react";
import { ServiceType } from "~/types/services";
import Sidebar from "./sidebar";
import { useUIStore } from "~/stores/ui-store";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpeechSidebar } from "./speech-synthesis/right-sidebar";
import { HistoryItem } from "~/lib/history";
import Playbar from "./playbar";
import { useAudioStore } from "~/stores/audio-store";
import { MobileSettingsButton } from "./speech-synthesis/mobile-settings-button";

interface TabItem {
  name: string;
  path: string;
}

export function PageLayout({
  title,
  children,
  service,
  tabs,
  showSidebar = true,
  historyItems,
}: {
  title: string;
  children: ReactNode;
  service: ServiceType;
  tabs?: TabItem[];
  showSidebar: boolean;
  historyItems?: HistoryItem[];
}) {
  const pathname = usePathname();
  const {
    isMobileDrawerOpen,
    isMobileScreen,
    isMobileMenuOpen,
    toggleMobileDrawer,
    setMobileScreen,
    toggleMobileMenu,
  } = useUIStore();
  const { currentAudio } = useAudioStore();

  useEffect(() => {
    const checkScreenSize = () => {
      setMobileScreen(window.innerWidth < 1024);
    };
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setMobileScreen]);

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isMobileScreen && isMobileDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="shadow-log relative h-full w-64 bg-white">
          <button
            onClick={toggleMobileDrawer}
            className="absolute right-2 top-2 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <IoClose />
          </button>
          <Sidebar isMobile={true} />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex h-16 items-center px-4">
            {isMobileScreen && (
              <button
                onClick={toggleMobileDrawer}
                className="mr-3 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <IoMenu className="h-6 w-6" />
              </button>
            )}
            <h1 className="text-md font-semibold">{title}</h1>

            {tabs && tabs.length > 0 && (
              <div className="ml-4 flex items-center">
                {tabs.map((tab) => (
                  <Link
                    className={`mr-2 rounded-full px-3 py-1 text-sm transition-colors duration-200 ${pathname === tab.path ? "bg-black text-white" : "text-gray-500 hover:text-gray-700"}`}
                    key={tab.path}
                    href={tab.path}
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div className="flex-1 px-6 py-5">
              <div className="flex h-full flex-col">{children}</div>
            </div>

            {showSidebar && service && (
              <SpeechSidebar historyItems={historyItems} service={service} />
            )}
          </div>
        </div>

        {isMobileScreen && !pathname.includes("/app/sound-effects") && (
          <MobileSettingsButton toggleMobileMenu={toggleMobileMenu} />
        )}

        {currentAudio && <Playbar />}
      </div>
    </div>
  );
}
