"use client";

type Props = {
  message: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
};

/** Botão de submit que pede confirmação antes de ações destrutivas. */
export function ConfirmButton({ message, className, children, title }: Props) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
