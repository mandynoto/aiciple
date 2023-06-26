import { faMessage } from "@fortawesome/free-regular-svg-icons"
import {
  faPlus,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useEffect, useState } from "react"

export const ChatSidebar = () => {
  const [chatList, setChatList] = useState([])

  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch(`/api/chat/getChatList`, {
        method: "POST",
      })
      const json = await response.json()
      console.log("CHAT LIST ", json)
      setChatList(json?.chats || [])
    }
    loadChatList()
  }, [])

  return (
    <div className="sidebar flex flex-col overflow-hidden">
      <Link
        href="/chat"
        className="sidebar-item sidebar-item-newchat normal-text"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1 text-xs" />
        New Chat
      </Link>
      <div className="flex-1">
        {chatList.map((chat) => (
          <Link
            key={chat._id}
            href={`/chat/${chat._id}`}
            className="normal-text sidebar-item"
          >
            <FontAwesomeIcon icon={faMessage} className="mr-1 text-xs" />

            {chat.title}
          </Link>
        ))}
      </div>
      <Link
        href="/api/auth/logout"
        className="normal-text sidebar-item sidebar-item-logout"
      >
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="mr-1 text-xs"
        />
        Logout
      </Link>
    </div>
  )
}
