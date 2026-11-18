type FormMessageProps = {
  tone: "error" | "success";
  children: React.ReactNode;
};

export function FormMessage({ tone, children }: FormMessageProps) {
  const color =
    tone === "error"
      ? "border-danger/60 text-danger"
      : "border-success/60 text-success";

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm ${color}`}
    >
      {children}
    </p>
  );
}
