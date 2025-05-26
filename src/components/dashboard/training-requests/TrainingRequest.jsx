"use client";

import { useState } from "react";
import TrainingRequestTable from "./TrainingRequestTable";
import TrainingRequestEdit from "./TrainingRequestEdit";

export default function TrainingRequest() {
  const [editRequest, setEditRequest] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Requests</h2>
      </div>

      <TrainingRequestTable setEditRequest={setEditRequest} />

      {editRequest && (
        <TrainingRequestEdit
          request={editRequest}
          isOpen={!!editRequest}
          onClose={() => setEditRequest(null)}
          onSuccess={() => setEditRequest(null)}
        />
      )}
    </div>
  );
}