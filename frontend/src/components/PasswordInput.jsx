import { useState } from "react";

export default function PasswordInput({ value, onChange, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-password">
      <input
        {...rest}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
