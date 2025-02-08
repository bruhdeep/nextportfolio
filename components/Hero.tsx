"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { smoothScroll } from "../utils/smoothScroll";

export default function Hero() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Pradip Shrestha
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Developer & Designer
            </p>
            <div className="mt-10 flex items-center justify-center bounce-animation">
              <a
                href="#projects"
                className="rounded-full bg-gray-900 dark:bg-gray-100 p-2 text-white dark:text-gray-900 shadow-sm hover:bg-gray-700 dark:hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
                onClick={(e) => smoothScroll(e, "projects")}
              >
                <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">View Projects</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
