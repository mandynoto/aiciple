import { ChatSidebar } from "components/ChatSidebar";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="normal-bg normal-text flex flex-col ">
          <div className="flex-1">chat window</div>
          <footer className="normal-footer-bg normal-text p-10">footer</footer>
        </div>
      </div>
    </>
  );
}
