import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { name, email, password } = body;

    // Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists in the database
    let existingUsers;
    try {
      [existingUsers] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: "An error occurred while checking email availability" },
        { status: 500 }
      );
    }

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password using bcrypt
    let hashedPassword, salt;
    try {
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { error: "An error occurred while processing your password" },
        { status: 500 }
      );
    }

    // Insert the new user into the database
    const userId = uuidv4();
    try {
      await db.query(
        "INSERT INTO users (id, name, email, password_hash, password_salt, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId, 
          name, 
          email, 
          hashedPassword, 
          salt, 
          new Date(), 
          new Date(), 
          true
        ]
      );

      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } catch (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    // Catch-all error handling
    console.error("Unexpected signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
