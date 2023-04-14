import client from "@/utils/prisma";
import { Response } from "@/types/Response";
import { UserNotification } from "@prisma/client";

type NotificationScheduleRequestBody = {
  postID: string;
  originalPostStatus: string;
  newPostStatus: string;
};

// This function is called when the status of a sell post changes.

export default async function scheduleNotificationEmails(
  parameters: NotificationScheduleRequestBody
): Promise<Response> {
  const request: NotificationScheduleRequestBody = parameters;

  // Retrieve all the users who have this post in their SellPostUserBookmark
  const users = await client.user.findMany({
    where: {
      SellPostUserBookmark: {
        some: {
          sellPostId: request.postID,
        },
      },
    },
  });

  // Create an array of notifications
  const newNotifications: UserNotification[] = users.map((user) => {
    return {
      id: "", // This will be generated by the database
      userId: user.id,
      updatedAt: null,
      originalPostStatus: request.originalPostStatus,
      sellPostId: request.postID,
    };
  });

  /* Adds all the notifications to the database.
   * If the status of the post changes back to the original, then remove the notification from the database.
   * If the status of the post changes to a different status, just update the notification in the database.
   * If notifications were queued 5 minutes or more ago, send emails with SIB and then remove the notifications from the database.
   * If notifications were queued less than 5 minutes ago and there have been no changes to the post, do nothing.
   */

  // Fetch all the notifications from the database
  const existingNotifications = await client.userNotification.findMany({
    include: {
      User: true,
      SellPost: true,
    },
  });

  if (newNotifications.length > 0) {
    // Create array of notifications without the id
    const notificationsWithoutId = newNotifications.map((notification) => {
      return {
        userId: notification.userId,
        originalPostStatus: notification.originalPostStatus,
        sellPostId: notification.sellPostId,
      };
    });

    // Add all the notifications to the database, skipping duplicates
    await client.userNotification.createMany({
      data: notificationsWithoutId,
      skipDuplicates: true, // Uniqueness is determined by the userId
    });

    // Find all the notifications that exist in both arrays
    const notificationsToBeUpdated = existingNotifications.filter(
      (existingNotification) => {
        return newNotifications.some(
          (notification) => notification.userId === existingNotification.userId
        );
      }
    );

    // Update the notifications in the database
    if (notificationsToBeUpdated.length > 0) {
      let updates = notificationsToBeUpdated.map(async (notification) => {
        // Find the notification in the array of notifications to be added
        const notificationToBeAdded = newNotifications.find(
          (notification) => notification.userId === notification.userId
        );

        if (notificationToBeAdded === undefined) {
          return;
        }

        /* For the purposes of this demo project, we assume there are only two statuses: available and sold_out.
        If the status of the post changes at all, it logically means that the post is now back to the original status.
        This means the user does not need to be notified of the change, so we remove the notification from the database.
        
        In an actual production application, there would likely be more statuses, and the user would need to be notified of the change.
        In this case, we would require two db columns: originalPostStatus and currentPostStatus.
        */

        if (
          notificationToBeAdded.originalPostStatus !==
          notification.originalPostStatus
        ) {
          // Remove the notifications from the database
          await client.userNotification.delete({
            where: {
              id: notification.id,
            },
          });
        }

        /* In a production app with more statuses, we would update the currentPostStatus column with something like this:
        await client.userNotification.update({
          where: {
            id: notification.id,
          },
          data: {
            updatedAt: new Date(),
            originalPostStatus: notification.originalPostStatus,
          },
        });
        */
      });

      await Promise.all(updates);

      return {
        success: true,
      };
    } else {
      return {
        success: true,
      };
    }
  }

  return {
    success: true,
  };
}
