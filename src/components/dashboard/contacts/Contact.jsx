"use client";

import { useState } from "react";
import ContactTable from "./ContactTable";
import ContactEdit from "./ContactEdit";

export default function Contact() {
  const [editContact, setEditContact] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Forms</h2>
      </div>

      <ContactTable setEditContact={setEditContact} />

      {editContact && (
        <ContactEdit
          contact={editContact}
          isOpen={!!editContact}
          onClose={() => setEditContact(null)}
          onSuccess={() => setEditContact(null)}
        />
      )}
    </div>
  );
}