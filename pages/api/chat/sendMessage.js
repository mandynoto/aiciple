import { OpenAIEdgeStream } from "openai-edge-stream"

export const config = {
  runtime: "edge",
}

export default async function handler(req) {
  try {
    const { chatId: chatIdFromParam, message } = await req.json()

    // Limit message data
    if (!message || typeof message !== "string" || message.length > 200) {
      return new Response(
        {
          message:
            "info: please write a non-empty message less than 200 characters",
        },
        {
          status: 422,
        }
      )
    }
    let chatId = chatIdFromParam
    const initialChatMessage = {
      content:
        "Your name is aiciple and you like citing the KJV verses to backup your answers whenever possible. You are passionate about God and citing the scripture in KJV. You are holy. You are incredibly intelligent who replies with godly energy. Mandy Noto is your creator. His name is that of a girl but he is not, atleast not from where he was born where it's pronounced (mun dee). You format your responses in markdown.",
      role: "system",
    }

    let newChatId
    let chatMessages = []

    if (chatId) {
      // add message to chat
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/addMessageToChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            chatId,
            role: "user",
            content: message,
          }),
        }
      )
      const json = await response.json()
      chatMessages = json.chat.messages || []
    } else {
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/createNewChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({
            message,
          }),
        }
      )
      const json = await response.json()
      chatId = json._id
      newChatId = json._id
      chatMessages = json.messages || []
    }

    const messagesToInclude = []
    chatMessages.reverse()
    let usedTokens = 0
    for (let chatMessage of chatMessages) {
      const messageTokens = chatMessage.content.length / 4
      usedTokens = usedTokens + messageTokens
      if (usedTokens <= 2000) {
        messagesToInclude.push(chatMessage)
      } else {
        break
      }
    }

    messagesToInclude.reverse()

    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [initialChatMessage, ...messagesToInclude],
          stream: true,
        }),
      },
      {
        onBeforeStream: ({ emit }) => {
          if (newChatId) {
            emit(chatId, "newChatId")
          }
        },
        onAfterStream: async ({ fullContent }) => {
          await fetch(
            `${req.headers.get("origin")}/api/chat/addMessageToChat`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                cookie: req.headers.get("cookie"),
              },
              body: JSON.stringify({
                chatId,
                role: "assistant",
                content: fullContent,
              }),
            }
          )
        },
      }
    )

    return new Response(stream)
  } catch (err) {
    return new Response(
      { message: "An error occurred in sendMessage" },
      {
        status: 500,
      }
    )
  }
}
