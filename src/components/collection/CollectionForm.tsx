"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FILE_ACCEPT, MAX_VIDEO_MB, VIDEO_TYPES } from "@/lib/collection/config";
import { addCollectionItem } from "@/lib/collection/mutations";

type ErrorKey = "fileType" | "videoTooBig" | "saveError";

/** Перевірка файлу до завантаження: фото або відео дозволеного формату й розміру. */
function checkFile(file: File): ErrorKey | null {
  if (file.type.startsWith("image/")) return null;
  if (!VIDEO_TYPES[file.type]) return "fileType";
  return file.size > MAX_VIDEO_MB * 1024 * 1024 ? "videoTooBig" : null;
}

// Форма нового запису колекції: файл і назва обов'язкові, опис — ні.
export function CollectionForm({ onAdded }: { onAdded: () => void }) {
  const t = useTranslations("collection.form");
  const id = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // Зміна ключа очищає поле вибору файлу.
  const [fileKey, setFileKey] = useState(0);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await addCollectionItem({ title, description, file });
      setTitle("");
      setDescription("");
      setFile(null);
      setFileKey((k) => k + 1);
      onAdded();
    } catch (reason) {
      console.error(reason);
      setError("saveError");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("file", { size: MAX_VIDEO_MB })}</span>
        <input
          key={fileKey}
          type="file"
          accept={FILE_ACCEPT}
          required
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            const problem = next ? checkFile(next) : null;
            setError(problem);
            setFile(problem ? null : next);
            // Непридатний файл прибираємо з поля.
            if (problem) e.target.value = "";
          }}
          className="w-full min-w-0 rounded-md border border-line bg-black px-3 py-2 text-sm text-muted file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-background hover:border-foreground"
        />
      </label>

      <Input
        id={`${id}-title`}
        label={t("title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        pattern=".*\S.*"
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">{t("description")}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="min-h-24 resize-y rounded-md border border-line bg-black px-3 py-2.5 text-base text-foreground focus:border-foreground focus:outline-none"
        />
      </label>

      {error && <FormMessage tone="error">{t(error, { size: MAX_VIDEO_MB })}</FormMessage>}

      <Button type="submit" variant="solid" disabled={busy} className="justify-self-start">
        {busy ? t("saving") : t("submit")}
      </Button>
    </form>
  );
}
