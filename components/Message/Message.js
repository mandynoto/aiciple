import { useUser } from "@auth0/nextjs-auth0/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

export const Message = ({ role, content }) => {
  const { user } = useUser()
  console.log("USER: ", user)
  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "assistant" ? "normal-aiciple-bg" : "normal-bg normal-text"
      }`}
    >
      <div>
        {role === "user" && !!user && (
          <Image
            src={user.picture}
            width={30}
            height={30}
            alt="user picture "
            className="rounded-sm"
          />
        )}
        {role === "assistant" && (
          <div className="normal-aiciple-bg flex h-[30px] w-[30px] items-center justify-center rounded-s ">
            <FontAwesomeIcon icon={faBookOpenReader} className="aiciple-icon" />
          </div>
        )}
      </div>
      <div
        className={`prose ${
          role === "assistant" ? "prose-assistant" : "normal-bg normal-text"
        }`}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
