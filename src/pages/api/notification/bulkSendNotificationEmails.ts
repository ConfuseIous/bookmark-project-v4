import client from "@/utils/prisma";
import sibClient from "src/utils/sib.js";
import { Response } from "@/types/Response";
import { BulkEmailRequestBody } from "@/types/BulkEmailRequestBody";
import getAPIKey from "./api-key/getAPIKey";

/* This function sends email notifications to multiple recipients.
It is called by the bulk-notification-v2 endpoint.
*/

export default async function sendNotificationEmail(
  parameters: BulkEmailRequestBody
): Promise<Response> {
  const data: BulkEmailRequestBody = parameters;

  console.log(data);

  console.log("Sending email to:");
  data.messageVersions.forEach((body) => {
    console.log(body.to[0].email);
  });

  const apiInstance = new sibClient.TransactionalEmailsApi();

  const apiKey = (await getAPIKey(data.messageVersions.length)).key;

  if (!apiKey) {
    return {
      success: false,
      message: "No API key found.",
    };
  }

  sibClient.authentications["api-key"].apiKey = apiKey.key;

  // console.log(sibClient.authentications);

  const email = {
    sender: {
      email: process.env.SIB_SENDER_EMAIL,
      name: process.env.SIB_SENDER_NAME,
    },
    subject: "SIWMA Listing Alerts",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Listing Alerts</h1>
        <p>Hi,</p>
        <p>Here are your latest alerts:</p>
        {{params.message}}
        <p><a href="http://localhost:3000/unsubscribe">Manage your Alert Preferences</a></p>
      </body>
      </html>
      `,
    messageVersions: data.messageVersions,
  };

  try {
    await apiInstance.sendTransacEmail(email);

    // Update the API Key usage count
    await client.sIBKey.update({
      where: {
        key: apiKey.key,
      },
      data: {
        uses: {
          decrement: data.messageVersions.length,
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: "An unexpected error occurred while sending the email.",
    };
  }
}
