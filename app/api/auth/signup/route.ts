import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const name = String(
      body?.name ?? ""
    ).trim();

    const email = String(
      body?.email ?? ""
    )
      .trim()
      .toLowerCase();

    // DO NOT trim or modify password.
    const password = String(
      body?.password ?? ""
    );

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error(
        "[SIGNUP]",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          error:
            "Account could not be created.",
        },
        { status: 400 }
      );
    }

    /*
     * Supabase may require email confirmation.
     */
    if (!data.session) {
      return NextResponse.json(
        {
          user: null,
          requiresEmailConfirmation: true,
          message:
            "Account created. Please confirm your email before signing in.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: data.user.id,
          email:
            data.user.email ?? email,
          name,
          role: "user",
        },
        requiresEmailConfirmation: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "[SIGNUP SERVER ERROR]",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create account.",
      },
      { status: 500 }
    );
  }
}