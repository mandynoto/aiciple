import { useUser } from "@auth0/nextjs-auth0/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

export const Message = ({ role, content }) => {
  const { user } = useUser()
  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "assistant" ? "normal-aiciple-bg" : ""
      }`}
    >
      <div>
        {role === "user" && (
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
      <div>{content}</div>
    </div>
  )
}
