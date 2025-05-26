"use client";

import { useState } from "react";
// Change from named imports to default imports
import CareerTable from "./CareerTable";
import CareerForm from "./CareerForm";
import CareerEdit from "./CareerEdit";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function Career() {
  const [editingCareer, setEditingCareer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career Opportunities</h2>
        <Button onClick={toggleForm} variant={showForm ? "outline" : "default"}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Hide Form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <CareerForm
          onCareerCreated={() => {
            setShowForm(false);
            setEditingCareer(null);
          }}
        />
      )}

      <CareerTable onEdit={setEditingCareer} />

      {editingCareer && (
        <CareerEdit
          career={editingCareer}
          isOpen={!!editingCareer}
          onClose={() => setEditingCareer(null)}
          onSuccess={() => setEditingCareer(null)}
        />
      )}
    </div>
  );
}