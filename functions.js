import { Client, Account } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);

export async function main(params) {
  const { action, email, secret } = params;

  if (!action) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing action parameter' }),
    };
  }

  try {
    if (action === 'send') {
      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing email parameter for send action' }),
        };
      }
      await account.createEmailSession(email);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `OTP sent to ${email}` }),
      };
    } 
    
    else if (action === 'verify') {
      if (!email || !secret) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing email or secret parameter for verify action' }),
        };
      }
      const session = await account.createSession(email, secret);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OTP verified, login successful', session }),
      };
    } 
    
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action parameter' }),
      };
    }
  } catch (error) {
    return {
      statusCode: error.code || 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
}
