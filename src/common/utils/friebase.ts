import * as admin from 'firebase-admin';

export const firebase = async ({ tokens, notification, data }) => {
  return await admin.messaging().sendToDevice(
    tokens,
    {
      notification,
      data,
    },
    {
      // Required for background/quit data-only messages on iOS
      contentAvailable: true,
      // Required for background/quit data-only messages on Android
      priority: 'high',
    },
  );
};
