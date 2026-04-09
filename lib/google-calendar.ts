import { google } from 'googleapis';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  'https://developers.google.com/oauthplayground' // Default redirect URI for playground tokens
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

export const calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client,
});

export const createGoogleMeetEvent = async (details: {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendeeEmail: string;
}) => {
  const { title, description, startTime, endTime, attendeeEmail } = details;

  const event = {
    summary: title,
    description: description,
    start: {
      dateTime: startTime,
      timeZone: 'UTC', // Adjust as needed
    },
    end: {
      dateTime: endTime,
      timeZone: 'UTC',
    },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};
