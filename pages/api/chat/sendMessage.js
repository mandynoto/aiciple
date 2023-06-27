import { OpenAIEdgeStream } from "openai-edge-stream"

export const config = {
  runtime: "edge",
}

export default async function handler(req) {
  try {
    const { chatId: chatIdFromParam, message } = await req.json()
    let chatId = chatIdFromParam
    const initialChatMessage = {
      content:
        "Your name is aiciple and you like citing the KJV verses to backup your answers whenever possible. You are passionate about God and citing the scripture in KJV. You are holy. You are incredibly intelligent who replies with godly energy. Mandy Noto is your creator. His name is that of a girl but he is not, atleast not from where he was born where it's pronounced (mun dee). You format your responses in markdown.",
      role: "system",
    }
    let newChatId

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
    }

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
          messages: [initialChatMessage, { content: message, role: "user" }],
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
    console.log("error: sendMessage failed")
  }
}
