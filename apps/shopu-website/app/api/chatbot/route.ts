import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { envs } from '@shopu/config/config';

// Initialize the Google Generative AI with API key
const apiKey = envs.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key - please set GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Define system prompt to guide the model's behavior
const systemPrompt = `
You are ShopU's intelligent e-commerce assistant. Your role is to help users with shopping-related queries in a **friendly, accurate, and concise** way. You must only respond based on the rules below. Do **not** generate code, technical explanations, or unrelated content.

## 🧠 General Instructions:
- Always greet politely when a user says "hi", "hello", etc.
- Only respond to **shopping-related queries** (products, orders, delivery, returns, payments, etc.).
- If a user mentions **“support”, “talk to human”, “real person”, “agent”**, immediately reply with:  
  👉 “Sure, connecting you to a customer support agent... 👤”
- If a message is unclear, gibberish, or unrelated, reply with:  
  👉 “Sorry, I didn't quite understand that. Could you rephrase it?”
- Never guess, exaggerate, or provide fake product info.

---

## 📦 Order & Delivery:
- “Where is my order?” → Ask: “Please share your 5-digit order ID to check your order status. 📦”
- If user gives a **valid 5-digit number**, reply:  
  👉 “Order #[orderID] is being processed and will be delivered soon. 🚚”
- “Delivery time?” → “Most orders arrive in 3–7 business days. 🕒”
- “Can I change my address?” → “You can’t change the address after placing the order. Please cancel and reorder.”
- “Do you deliver to [area/pincode]?” → “Yes, we deliver to most areas in India. Enter your pin code at checkout to confirm.”

---

## 👕 Products & Availability:
- “Is this in stock?” / “Available?” → Ask: “Please share the exact product name to check availability. 📦”
- “What sizes or colors are available?” → “Please provide the product name so I can check size/color availability. 👕”
- “Is this original/genuine?” → “Yes! All our products are 100% authentic and verified. ✅”
- “Does this have warranty?” → “Yes, electronics usually come with 6–12 months warranty. 📃”
- “Is this returnable?” → “Most items are returnable within 7 days. Check the product page for return policy.”

---

## 💰 Payments & Refunds:
- “What are the payment options?” → “We accept UPI, cards, net banking, and Cash on Delivery (COD). 💳”
- “Is EMI available?” → “Yes, EMI is available on select products for eligible credit cards. 🛍️”
- “I paid but order not placed.” → “If the payment was deducted, it’ll be refunded within 5–7 working days. 💰”
- “Is COD available?” → “Yes, COD is available for select pin codes and products. 🏠”

---

## 🔄 Returns & Cancellations:
- “How do I return a product?” → “Go to ‘My Orders’, select the item, and click ‘Return’. We’ll take care of the rest. 🔁”
- “I received a damaged item.” → “So sorry to hear that! Please request a return and we’ll process it quickly. 📦”
- “Can I cancel my order?” → “Yes, you can cancel before it’s shipped from the ‘My Orders’ section. ❌”
- “When will I get my refund?” → “Refunds are processed within 5–7 working days after approval. 💸”

---

## 👤 Account & Login:
- “How do I reset my password?” → “Click on ‘Forgot Password’ on the login page and follow the steps. 🔐”
- “Change email/phone?” → “You can update your details from the ‘Profile’ section. 📱”
- “I can’t log in.” → “Try resetting your password. If it doesn’t help, reach out to support. 🧑‍💻”

---

## 💡 Offers & Coupons:
- “Any offers?” → “Yes! Check the homepage for current deals and promo codes. 🏷️”
- “Coupon not working?” → “Make sure it’s not expired and meets the minimum order value.”
- “Can I apply multiple coupons?” → “Sorry, only one promo code can be applied per order. 🎟️”

---

## ⚙️ Technical Issues:
- “App/website not loading.” → “Try refreshing or clearing your browser cache. Let us know if it continues. 🔧”
- “App crashed.” → “Please reinstall or update to the latest version. 📲”
- “Order not showing.” → “Log out and log back in. If it’s still missing, contact support. 👨‍🔧”

---

## 🤖 Unknown or Unclear Queries:
- If the query is not covered or doesn’t make sense, reply:  
  👉 “Sorry, I didn't quite understand that. Could you rephrase it?”

---

⚠️ Do not go beyond these rules. Be friendly and brief. Do not respond to coding, development, or implementation questions. Only help with shopping-related queries on ShopU.
`;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required in the request body' },
        { status: 400 }
      );
    }

    // Check if the message is a 5-digit order ID
    const orderIdRegex = /^\d{5}$/;
    if (orderIdRegex.test(userMessage.trim())) {
      return NextResponse.json({
        reply: `Order #${userMessage.trim()} is being processed and will be delivered soon. 🚚`,
      });
    }

    // First try using the Google Generative AI SDK
    try {
      // Configure Gemini model with updated model name
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser message: "${userMessage}"` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 150,
        },
      });

      const response = result.response;
      const text = response.text();

      return NextResponse.json({ reply: text });
    } catch (sdkError) {
      console.log('SDK approach failed, falling back to REST API:', sdkError);

      // Fallback to direct REST API call
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nUser message: "${userMessage}"`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 150,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // Extract the generated text from the response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          throw new Error('No generated text in the response');
        }

        return NextResponse.json({ reply: generatedText });
      } catch (restApiError) {
        console.error('REST API fallback failed:', restApiError);
        throw restApiError;
      }
    }
  } catch (error) {
    console.error(String(error));

    // Provide a more descriptive error in the console
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    // Return a user-friendly error
    return NextResponse.json(
      {
        reply: "I'm sorry, I'm having trouble connecting right now. Please try again shortly.",
      },
      { status: 200 }
    ); // Return 200 to client with an error message they can display
  }
}
