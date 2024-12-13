import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { fetchPlan } from "@/lib/strapi";

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug } = await context.params;
    const planData = await fetchPlan(slug);

    if (!planData) {
      return new NextResponse("Plan not found", { status: 404 });
    }

    return NextResponse.json(planData);
  } catch (error) {
    console.error("[PLAN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
