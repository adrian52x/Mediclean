"use client";
import dynamic from "next/dynamic";

const MapsClient = dynamic(() => import("./Maps"), {
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Se încarcă harta...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default MapsClient;
