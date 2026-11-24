"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { ContactList } from "@/components/contacts/ContactList";

type ContactsModalProps = {
  className?: string;
};

// Кнопка «Контакти» + вікно з адресою, телефонами, поштою, графіком і картою.
export function ContactsModal({ className }: ContactsModalProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {t("nav.contacts")}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("contacts.title")}
        closeLabel={t("common.close")}
        maxWidthClass="max-w-xl"
      >
        <ContactList />
      </Modal>
    </>
  );
}
