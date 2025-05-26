"use client";

import { useState } from "react";
import TrainingTable from "./TrainingTable";
import TrainingForm from "./TrainingForm";
import TrainingEdit from "./TrainingEdit";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function Training() {
  const [editingTraining, setEditingTraining] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Courses</h2>
        <Button onClick={toggleForm} variant={showForm ? "outline" : "default"}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Hide Form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <TrainingForm
          onTrainingCreated={() => {
            setShowForm(false);
            setEditingTraining(null);
          }}
        />
      )}

      <TrainingTable onEdit={setEditingTraining} />

      {editingTraining && (
        <TrainingEdit
          training={editingTraining}
          isOpen={!!editingTraining}
          onClose={() => setEditingTraining(null)}
          onSuccess={() => setEditingTraining(null)}
        />
      )}
    </div>
  );
}