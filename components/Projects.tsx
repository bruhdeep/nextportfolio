"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Project 1",
    description: "This is a description of Project 1.",
    imageUrl: "/balls.gif?height=300&width=400",
  },
  {
    id: 2,
    title: "Project 2",
    description: "This is a description of Project 2.",
    imageUrl: "/balls.gif?height=300&width=400",
  },
  {
    id: 3,
    title: "Project 3",
    description: "This is a description of Project 3.",
    imageUrl: "/balls.gif?height=300&width=400",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      id="projects"
      className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Projects
        </h2>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 dark:border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="group relative">
                <img
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  onClick={() => setSelectedProject(project)}
                />
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {selectedProject?.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {selectedProject?.description}
            </Dialog.Description>
            <img
              src={selectedProject?.imageUrl || "/placeholder.svg"}
              alt={selectedProject?.title}
              className="mt-4 w-full rounded-lg"
            />
            <button
              className="mt-4 rounded-full bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:ring-offset-2"
              onClick={() => setSelectedProject(null)}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
