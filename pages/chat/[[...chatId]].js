import { ChatSidebar } from "components/ChatSidebar"
import Head from "next/head"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

export default function ChatPage() {
  const [messageText, setMessageText] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("MESSAGE TEXT: ", messageText)
  }

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="normal-bg normal-text flex flex-col ">
          <div className="flex-1">chat window</div>
          <footer className="normal-footer-bg normal-text p-0.5">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Send a message"
                  className="normal-footer-bg normal-text w-full resize-none rounded-md p-2 outline-none focus:border-hangin-100  dark:bg-black dark:focus:border-hangin-100"
                  style={{ paddingTop: "30px" }}
                />
                <button
                  type="submit"
                  className="submit w-1200"
                  style={{ width: "100px" }}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ color: "black" }}
                  />
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  )
}
