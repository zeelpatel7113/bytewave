"use client";

import { useState } from "react";
import CareerRequestTable from "./CareerRequestTable";
import CareerRequestEdit from "./CareerRequestEdit";

export default function CareerRequest() {
  const [editRequest, setEditRequest] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career Applications</h2>
      </div>

      <CareerRequestTable setEditRequest={setEditRequest} />

      {editRequest && (
        <CareerRequestEdit
          request={editRequest}
          isOpen={!!editRequest}
          onClose={() => setEditRequest(null)}
          onSuccess={() => setEditRequest(null)}
        />
      )}
    </div>
  );
}