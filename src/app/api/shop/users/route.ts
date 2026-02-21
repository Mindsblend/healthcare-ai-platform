import { fetchAllUsers } from "@/features/auth/services/databaseService"

export async function GET() {
  try {
    const users = await fetchAllUsers()
    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    })
  }
}
