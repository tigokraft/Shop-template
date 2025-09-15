import * as React from "react";

export function EmailOTP({
  otp,
  user,
}: {
  otp: string;
  user: { email: string };
}) {
  return (
    <html>
      <body
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial",
          backgroundColor: "#fff",
          color: "#000",
          padding: "40px",
        }}
      >
        <table
          role="presentation"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            border: "1px solid #000",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <tr>
            <td
              style={{
                fontSize: "28px",
                fontWeight: "700",
                paddingBottom: "20px",
              }}
            >
              Vexo Shop
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingBottom: "30px",
              }}
            >
              Hi <b>{user.email}</b>, use the code below to complete your
              sign-in:
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "6px",
                padding: "20px 0",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              {otp}
            </td>
          </tr>
          <tr>
            <td
              style={{
                paddingTop: "30px",
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              This code will expire in 10 minutes. If you didn’t request this
              sign-in, you can safely ignore this email.
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "40px", fontSize: "12px", color: "#999" }}>
              &copy; {new Date().getFullYear()} Vexo Shop. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

export function EmailAuth({
  url,
  user,
}: {
  url: string;
  user: { email: string };
}) {
  return (
    <html>
      <body
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial",
          backgroundColor: "#fff",
          color: "#000",
          padding: "40px",
        }}
      >
        <table
          role="presentation"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            border: "1px solid #000",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <tr>
            <td
              style={{
                fontSize: "28px",
                fontWeight: "700",
                paddingBottom: "20px",
              }}
            >
              Vexo Shop
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingBottom: "30px",
              }}
            >
              Hi <b>{user.email}</b>, click below to verify your email and
              activate your account.
            </td>
          </tr>
          <tr>
            <td>
              <a
                href={url}
                style={{
                  display: "inline-block",
                  background: "#000",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "600",
                  padding: "14px 28px",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
              >
                Verify Email
              </a>
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "30px", fontSize: "14px", color: "#666" }}>
              Or copy & paste this link into your browser:
              <br />
              <span style={{ wordBreak: "break-all", color: "#000" }}>
                {url}
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "40px", fontSize: "12px", color: "#999" }}>
              &copy; {new Date().getFullYear()} Vexo Shop. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
