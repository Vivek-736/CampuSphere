import { storage } from "@/configs/FirebaseConfig";
import pool from "@/configs/NilePostgresConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

interface Body {
  content: string;
  imageBase64?: string | null;
  visiblein?: string;
  createdby: string;
}

export async function POST(req: Request) {
  let client;

  try {
    const {
      content,
      imageBase64,
      visiblein = "public",
      createdby,
    } = (await req.json()) as Body;

    if (!content?.trim()) {
      return Response.json({ error: "content required" }, { status: 400 });
    }

    let imageurl: string | null = null;

    if (imageBase64) {
      try {
        const bytes = Buffer.from(imageBase64, "base64");
        const filePath = `CampuSphere/posts/${uuidv4()}.jpg`;
        const imageRef = ref(storage, filePath);

        await uploadBytes(imageRef, bytes, { contentType: "image/jpeg" });
        imageurl = await getDownloadURL(imageRef);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        imageurl = null;
      }
    }

    client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id         SERIAL PRIMARY KEY,
        content    TEXT,
        imageurl   VARCHAR,
        createdon  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        visiblein  VARCHAR,
        createdby  VARCHAR
      );
    `);

    const insert =
      "INSERT INTO posts (content,imageurl,visiblein,createdby) " +
      "VALUES ($1,$2,$3,$4) RETURNING *";

    const { rows } = await client.query(insert, [
      content.trim(),
      imageurl,
      visiblein,
      createdby,
    ]);

    return Response.json({
      success: true,
      data: rows[0],
      message: "Post created successfully",
    });
  } catch (e: any) {
    console.error("POST /post error:", e);
    return Response.json(
      {
        error: e.message || "Failed to create post",
        success: false,
      },
      { status: 500 }
    );
  } finally {
    client?.release();
  }
}

export async function GET(req: Request) {
  let client;

  try {
    client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id         SERIAL PRIMARY KEY,
        content    TEXT,
        imageurl   VARCHAR,
        createdon  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        visiblein  VARCHAR,
        createdby  VARCHAR
      );
    `);

    const { rows } = await client.query(
      "SELECT * FROM posts ORDER BY createdon DESC"
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (e: any) {
    console.error("GET /post error:", e);
    return Response.json(
      {
        error: e.message || "Failed to fetch posts",
        success: false,
        data: [],
      },
      { status: 500 }
    );
  } finally {
    client?.release();
  }
}