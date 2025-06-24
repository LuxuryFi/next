import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = "Trang tính1";
    const range = `${sheetName}!A1:D100`;

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges: [range],
      fields:
        "sheets.data.rowData.values(formattedValue,effectiveFormat.textFormat)",
    });

    const rows = response.data.sheets[0].data[0].rowData.map((row) =>
      row.values.map((cell) => {
        const textFormat = cell?.effectiveFormat?.textFormat || {};
        const fg = textFormat.foregroundColor || {};
        const style = {
          fontWeight: textFormat.bold ? "bold" : "normal",
          fontSize: textFormat.fontSize
            ? `${textFormat.fontSize}px`
            : "inherit",
          color:
            fg.red !== undefined ||
            fg.green !== undefined ||
            fg.blue !== undefined
              ? `rgb(${Math.floor((fg.red || 0) * 255)},${Math.floor(
                  (fg.green || 0) * 255
                )},${Math.floor((fg.blue || 0) * 255)})`
              : "#000",
        };

        return {
          value: cell.formattedValue || "",
          style,
        };
      })
    );

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("Error fetching sheet data:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
