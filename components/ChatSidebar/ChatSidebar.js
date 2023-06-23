import Link from "next/link";

export const ChatSidebar = () => {
  return (
    <div className="sidebar">
      <Link href="/api/auth/logout">Logout</Link>
    </div>
  );
};
