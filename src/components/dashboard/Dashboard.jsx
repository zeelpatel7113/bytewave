"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Settings, FileSpreadsheet, GraduationCap, BookOpen, Briefcase, UserCheck } from "lucide-react";
import Service from "./services/Service";
import ServiceRequest from "./service-requests/ServiceRequest";
import Training from "./training/Training";
import TrainingRequest from "./training-requests/TrainingRequest";
import Career from "./careers/Career";
import CareerRequest from "./career-requests/CareerRequest";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("services");

  const tabs = [
    {
      id: "services",
      label: "Services",
      icon: Settings,
      component: <Service />,
    },
    {
      id: "service-requests",
      label: "Service Requests",
      icon: FileSpreadsheet,
      component: <ServiceRequest />,
    },
    {
      id: "training",
      label: "Training Courses",
      icon: GraduationCap,
      component: <Training />,
    },
    {
      id: "training-requests",
      label: "Training Requests",
      icon: BookOpen,
      component: <TrainingRequest />,
    },
    {
      id: "careers",
      label: "Career Positions",
      icon: Briefcase,
      component: <Career />,
    },
    {
      id: "career-requests",
      label: "Career Applications",
      icon: UserCheck,
      component: <CareerRequest />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Navigation Buttons */}
      <div className="flex gap-4 border-b overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "px-4 py-2 flex items-center gap-2 font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
    </div>
  );
}