"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-data-format");
      const json = await res.json();
      setData(json.data || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = { name, email, phone, message };

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const content = await response.json();
    // if (response.ok) {
    //   alert("Form submitted successfully!");
    // } else {
    //   alert("Failed to submit form. Please try again.");
    // }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
            />
          </div>
          <div>
            <label>email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              name="email"
              id="email"
            />
          </div>
          <div>
            <label>phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              name="phone"
              id="phone"
            />
          </div>
          <div>
            <label>message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="message"
              id="message"
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        <div>
          <h2>📋 Dữ liệu từ Google Sheets:</h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Tin nhắn</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 1 &&
                data.slice(1).map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, i) => {
                      const isImage =
                        typeof cell.value === "string" &&
                        cell.value.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                      return (
                        <td key={i} style={cell.style}>
                          {isImage ? (
                            <img
                              src={cell.value}
                              alt="img"
                              style={{ maxWidth: "100px" }}
                            />
                          ) : (
                            cell.value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
