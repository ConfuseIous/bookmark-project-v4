import {
  Container,
  Box,
  Button,
  FormGroup,
  Divider,
  TextField,
} from "@mui/material";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { TestEmailRequestBody } from "@/types/TestEmailRequestBody";
import { CreateAPIKeyRequestBody } from "@/types/CreateAPIKeyRequestBody";
import { SIBKey } from "@prisma/client";
import { useState } from "react";

export default function Home() {
  const [apiKeys, setApiKeys] = useState<SIBKey[]>([]);
  const [numKeys, setNumKeys] = useState(1);

  async function getAPIKey() {
    const response = await fetch("/api/notification/api-key/get-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({numEmails: 10}),
    });

    const data = await response.json();
    
    console.log(data);
    alert(data.key.key);
  }

  async function createAPIKey(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const requestBody: CreateAPIKeyRequestBody = apiKeys;

    const response = await fetch("/api/notification/api-key/create-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    console.log(data);
  }

  async function sendNotificationEmail() {
    const requestBody: TestEmailRequestBody = {
      emailID: "karandeepsingh00@icloud.com",
      name: "Karan",
      message: "This is a test message",
    };

    console.log(requestBody);

    const response = await fetch("/api/notification/sendNotificationEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
  }

  async function sendTestNotificationEmails() {
    const response = await fetch("/api/notification/testNotificationEmails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
    const data = await response.json();
    console.log(data);
  }

  async function testBulkNotifsV2() {
    const response = await fetch("/api/notification/bulk-notification-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
    const data = await response.json();
    console.log(data);
  }

  async function testSignIn() {
    // api call to test sign in
    const response = await fetch("/api/auth/testSignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }

  async function testSignInNextAuth() {
    signIn("credentials", {
      email: "karandeepsingh00@icloud.com",
      password: "testtesttest",
    });
  }

  return (
    <Container maxWidth="md">
      <Head>
        <title>Bookmark Test</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "3em",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            }}
          >
            Admin Page, Testing Only
          </h1>
          <h5
            style={{
              fontSize: "1em",
              color: "#9e9e9e",
              textAlign: "center",
              fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            DO NOT INCLUDE THIS PAGE IN PRODUCTION
          </h5>
          <h3
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            }}
          >
            NextAuth
          </h3>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={() => signIn()}
          >
            Sign In
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={testSignIn}
          >
            Test Sign In (Hardcoded credentials, Prisma)
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={testSignInNextAuth}
          >
            Test Sign In (Hardcoded credentials, NextAuth)
          </Button>
          <Divider sx={{ width: "100%" }} />
          <h3
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            }}
          >
            Emails
          </h3>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={sendNotificationEmail}
          >
            Send Single Notification Email (Not for Production Use)
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ m: 4, textAlign: "center", width: "60%" }}
            onClick={sendTestNotificationEmails}
          >
            Spam My Inbox (DO NOT CLICK THIS)
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={testBulkNotifsV2}
          >
            Test Bulk Notifications V2
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Divider sx={{ width: "100%" }} />
          <h3
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            }}
          >
            API Keys
          </h3>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2, textAlign: "center", width: "60%" }}
            onClick={getAPIKey}
          >
            Get API Key
          </Button>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.5em", m: 2 }}
              onClick={() => setNumKeys(numKeys + 1)}
            >
              +
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.5em", m: 2 }}
              disabled={numKeys === 1}
              onClick={() => setNumKeys(numKeys - 1)}
            >
              -
            </Button>
          </Box>
          <FormGroup>
            <form onSubmit={createAPIKey}>
              {Array.from(Array(numKeys).keys()).map((key) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="key"
                    label="Key"
                    variant="outlined"
                    sx={{ m: 1 }}
                    onChange={(e) => {
                      const newKeys = [...apiKeys];
                      if (key == apiKeys.length) {
                        newKeys.push({
                          key: "",
                          sibEmail: "",
                          uses: 300,
                        });
                      }
                      newKeys[key].key = e.target.value;
                      setApiKeys(newKeys);
                    }}
                  />
                  <TextField
                    id="sibEmail"
                    label="SIB Email"
                    variant="outlined"
                    sx={{ m: 1 }}
                    onChange={(e) => {
                      const newKeys = [...apiKeys];
                      if (key == apiKeys.length) {
                        newKeys.push({
                          key: "",
                          sibEmail: "",
                          uses: 300,
                        });
                      }
                      newKeys[key].sibEmail = e.target.value;
                      setApiKeys(newKeys);
                    }}
                  />
                  <Divider sx={{ width: "100%", m: 1.5 }} />
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                sx={{ textAlign: "center", width: "100%", marginBottom: "5em" }}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </FormGroup>
        </Box>
      </main>
    </Container>
  );
}
