import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChatSidebar } from "components/ChatSidebar"
import { Message } from "components/Message"
import Head from "next/head"
import { useState } from "react"
import { v4 as uuid } from "uuid"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { streamReader } from "openai-edge-stream"
config.autoAddCss = false

export default function ChatPage() {
  const [incomingMessage, setIncomingMessage] = useState("")
  const [messageText, setMessageText] = useState("")
  const [newChatMessages, setNewChatMessages] = useState([])
  const [generatingResponse, setGeneratingResponse] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneratingResponse(true)
    setNewChatMessages((prev) => {
      const newChatMessages = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ]
      return newChatMessages
    }),
      setMessageText("")
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    })
    const data = response.body
    if (!data) {
      return
    }
    const reader = data.getReader()
    await streamReader(reader, (message) => {
      console.log("MESSAGE: ", message)
      setIncomingMessage((s) => `${s}${message.content}`)
    })
    setGeneratingResponse(false)
  }

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="normal-bg normal-text flex flex-col ">
          <div className="flex-1">
            {newChatMessages.map((message) => (
              <Message
                key={message._id}
                role={message.role}
                content={message.content}
              />
            ))}
            {!!incomingMessage && (
              <Message role="assistant" content={incomingMessage} />
            )}
          </div>
          <footer className="normal-footer-bg normal-text p-0.5">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message"}
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
