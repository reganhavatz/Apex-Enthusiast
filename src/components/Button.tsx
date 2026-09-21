"use client"; 

export default function Button({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="my-button-style">
      {children}
    </button>
  );
}