import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "lib/mongodb"

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res)
    const { message } = req.body

    // Limit message data
    if (!message || typeof message !== "string" || message.length > 200) {
      res.status(422).json({
        message:
          "info: please write a non-empty message less than 200 characters",
      })
      return
    }

    const newUserMessage = {
      role: "user",
      content: message,
    }
    const client = await clientPromise
    const db = client.db("aiciple")
    const chat = await db.collection("chats").insertOne({
      userId: user.sub,
      messages: [newUserMessage],
      title: message,
    })
    res.status(200).json({
      _id: chat.insertedId.toString(),
      messages: [newUserMessage],
      title: message,
    })
  } catch (error) {
    res.status(500).json({ messagee: "error: creating new chat" }),
      console.log("error: create new chat")
  }
}
