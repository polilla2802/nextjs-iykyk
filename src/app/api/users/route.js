import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request) {
  try {
    const usersValue = await prisma.user.findMany({
      include: {
        membership: true
      },
    });

    console.log(usersValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(usersValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const users = JSON.parse(serializedData);
    return NextResponse.json({ users }, { status: 200 }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal Error", error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();

    const user = await prisma.user.create({
      data: {
        membershipId: parseInt(data.get("membershipId")),
        name: data.get("name"),
        email: data.get("email"),
        birthDay: data.get("birthday")
      },
    });
    // return NextResponse.json({ message: "ok" }, { status: 200 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    console.log(error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 }
    );
  }
}
