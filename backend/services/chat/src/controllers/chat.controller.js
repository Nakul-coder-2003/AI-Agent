import { conversationModel } from "../models/conversation.model.js";
import { messageModel } from "../models/message.model.js";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto"
// 1. User ki saari conversations (chats) fetch karna
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Latest chat sabse upar aayegi (updatedAt: -1)
    const conversations = await conversationModel
      .find({ userId })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// 2. Ek specific conversation ke saare messages fetch karna
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Purane messages upar, naye niche (createdAt: 1)
    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// 3. Core Logic: Message bhejna aur AI se reply lana
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, conversationId,agentType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      console.log("💳 Checking wallet balance...");
      const paymentRes = await fetch(
        process.env.PAYMENT_SERVICE_DEDUCT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        },
      );
      // console.log(paymentRes);
      
      //  Agar URL galat hai ya 404 aaya hai, toh HTML parse karne se pehle roko
      if (!paymentRes.ok) {
        const errorText = await paymentRes.text();
        console.error("❌ Payment Service Error:", errorText);
        // return zaroori hai taaki 'Headers sent' wala error na aaye
        return res
          .status(paymentRes.status)
          .json({ error: "Failed to reach Payment service." });
      }

      const paymentData = await paymentRes.json();
      // console.log(paymentData);
      if (!paymentData.success) {
        return res.status(403).json({
          error: "Insufficient credits. Please recharge your wallet.",
        });

        console.log(
          `✅ Credit deducted! Remaining Balance: ${paymentData.remainingBalance}`,
        );
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "error in payment services" });
    }

    let currentConvId = conversationId;

    if (!currentConvId) {
      const newConv = await conversationModel.create({
        userId,
        title: prompt.substring(0, 30) + "...",
      });
      currentConvId = newConv._id;
    }

    // 1. User ka message DB mein save karo
    const userMessage = await messageModel.create({
      conversationId: currentConvId,
      role: "user",
      content: prompt,
    });

    //Database se is conversation ke purane messages nikalo
    const chatHistory = await messageModel
      .find({ conversationId: currentConvId })
      .sort({ createdAt: 1 });

    //Data ko us format mein badlo jo AI aasaani se samajh sake
    const history = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model", // Gemini 'ai' ko 'model' bolta hai
      parts: msg.content,
    }));
    // console.log(history);

    // 2. Agar PDF file aayi hai, toh pehle usko Agent Service par upload karo
    if (req.file) {
      console.log(
        "📄 File received in Chat Service, forwarding to Agent Service...",
      );

      // Node.js ka native FormData banayenge dusri service ko file bhejne ke liye
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);

      const uploadRes = await fetch(
        process.env.AGENT_SERVICE_UPLOAD_PDF,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        return res
          .status(500)
          .json({ error: "Agent failed to process the PDF document" });
      }
      console.log("✅ PDF successfully forwarded and processed by Agent!");
    }

    // 3. File process hone ke baad (ya agar file nahi thi), Prompt Agent ko bhejo
    const agentResponse = await fetch(process.env.AGENT_SERVICE_CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        history: history,
        agentType: agentType || "chat"
      }),
    });

    const agentData = await agentResponse.json();
    if (!agentData.success) {
      return res
        .status(500)
        .json({ error: "Agent service failed to generate a response" });
    }

    // 4. AI (Agent) ka response DB mein save karo
    const aiMessage = await messageModel.create({
      conversationId: currentConvId,
      role: "ai",
      content: agentData.reply,
    });

    // 5. Conversation ka updatedAt time refresh karo taaki woh sidebar mein top par aa jaye
    await conversationModel.findByIdAndUpdate(currentConvId, {
      updatedAt: new Date(),
    });

    // 6. Frontend ko final data bhejo
    res.status(200).json({
      success: true,
      conversationId: currentConvId,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    // req.user GATEWAY se headers ke through ya local middleware se aayega
    const userId = req.headers['x-user-id'] || req.user?.id || req.user?._id;

    // 1. Verify user owns this chat
    const conversation = await conversationModel.findOne({ _id: conversationId, userId });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // 2. Delete all messages inside this conversation
    await messageModel.deleteMany({ conversationId });

    // 3. Delete the conversation itself
    await conversationModel.findByIdAndDelete(conversationId);

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};