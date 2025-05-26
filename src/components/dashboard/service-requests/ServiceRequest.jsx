"use client";

import { useState } from "react";
import ServiceRequestTable from "./ServiceRequestTable";
import ServiceRequestEdit from "./ServiceRequestEdit";

export default function ServiceRequest() {
  const [editRequest, setEditRequest] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Requests</h2>
      </div>

      <ServiceRequestTable setEditRequest={setEditRequest} />

      {editRequest && (
        <ServiceRequestEdit
          request={editRequest}
          isOpen={!!editRequest}
          onClose={() => setEditRequest(null)}
          onSuccess={() => setEditRequest(null)}
        />
      )}
    </div>
  );
}