"use client";

import { useState } from "react";
import ServiceTable from "./ServiceTable";
import ServiceForm from "./ServiceForm";
import ServiceEdit from "./ServiceEdit";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react"; // Make sure to import lucide-react icons

export default function Service() {
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={toggleForm} variant={showForm ? "outline" : "default"}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Hide Form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <ServiceForm 
          onServiceCreated={() => {
            setShowForm(false);
            setEditingService(null);
          }} 
        />
      )}
      
      <ServiceTable onEdit={setEditingService} />

      {editingService && (
        <ServiceEdit
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => setEditingService(null)}
        />
      )}
    </div>
  );
}