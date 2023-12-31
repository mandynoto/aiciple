import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons"
import { ChatSidebar } from "components/ChatSidebar"
import { Message } from "components/Message"
import Head from "next/head"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useRouter } from "next/router"
import { streamReader } from "openai-edge-stream"
import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "lib/mongodb"
import { ObjectId } from "mongodb"
config.autoAddCss = false

export default function ChatPage({ chatId, title, messages = [] }) {
  const [apiKey, setApiKey] = useState(null)
  useEffect(() => {
    const userApiKey = window.prompt("Please enter your OpenAI API key")
    setApiKey(userApiKey)
  }, [])
  console.log("props: ", title, messages)
  const [newChatId, setNewChatId] = useState(null)
  const [incomingMessage, setIncomingMessage] = useState("")
  const [messageText, setMessageText] = useState("")
  const [newChatMessages, setNewChatMessages] = useState([])
  const [generatingResponse, setGeneratingResponse] = useState(false)
  const [fullMessage, setFullMessage] = useState("")
  const [originalChatId, setOriginalChatId] = useState(chatId)
  const router = useRouter()

  const routeHasChanged = chatId !== originalChatId

  // Reset state items when route changes
  useEffect(() => {
    setNewChatMessages([])
    setNewChatId(null)
  }, [chatId])

  // Save newly streamed message to new chat messages
  useEffect(() => {
    if (!routeHasChanged && !generatingResponse && fullMessage) {
      setNewChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ])
      setFullMessage("")
    }
  }, [generatingResponse, fullMessage, routeHasChanged])

  // Navigate to new chat page whenever a new one is created
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null)
      router.push(`/chat/${newChatId}`)
    }
  }, [newChatId, generatingResponse, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneratingResponse(true)
    setOriginalChatId(chatId)
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
    // console.log("NEW CHAT", json)
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ chatId, message: messageText, apiKey }),
    })
    const data = response.body
    if (!data) {
      return
    }
    const reader = data.getReader()
    let content = ""
    await streamReader(reader, (message) => {
      console.log("MESSAGE: ", message)
      if (message.event === "newChatId") {
        setNewChatId(message.content)
      } else {
        setIncomingMessage((s) => `${s}${message.content}`)
        content = content + message.content
      }
    })
    setFullMessage(content)
    setIncomingMessage("")
    setGeneratingResponse(false)
  }

  const allMessages = [...messages, ...newChatMessages]

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />
        <div className="normal-bg normal-text flex flex-col overflow-hidden">
          <div className="flex flex-1 flex-col-reverse overflow-auto">
            {!allMessages.length && !incomingMessage && (
              <div className="m-auto flex items-center justify-center text-center">
                <div>
                  <FontAwesomeIcon
                    icon={faBookOpenReader}
                    className="text-6xl text-aiciple-icon-light"
                  />
                  <h1 className="mt-2 text-5xl opacity-30">aiciple</h1>
                </div>
              </div>
            )}
            {!!allMessages.length && (
              <div className="mb-auto">
                {allMessages.map((message) => (
                  <Message
                    key={message._id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {!!incomingMessage && !routeHasChanged && (
                  <Message role="assistant" content={incomingMessage} />
                )}
                {!!incomingMessage && !!routeHasChanged && (
                  <Message
                    role="notice"
                    content="Sorry, aiciple will be with you shortly."
                  />
                )}
              </div>
            )}
          </div>
          <footer className="normal-bg normal-text p-0.5">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
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

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null
  if (chatId) {
    let objectId
    try {
      objectId = new ObjectId(chatId)
    } catch (e) {
      return {
        redirect: {
          destination: "/chat",
        },
      }
    }
    const { user } = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = client.db("aiciple")
    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: objectId,
    })
    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      }
    }
    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          _id: uuid(),
        })),
      },
    }
  }
  return {
    props: {},
  }
}
