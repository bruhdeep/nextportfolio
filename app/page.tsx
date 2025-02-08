"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import LanyardStatus from "@/components/lanyard";
import { useTheme } from "next-themes";
import "./globals.css";

import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";

export default function Home() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Header />
      <main>
        <SpotifyNowPlaying />
        <Hero />
        <Projects />
        <LanyardStatus />
        <Contact />
      </main>
    </div>
  );
}
