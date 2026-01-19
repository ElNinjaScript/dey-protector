import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return Response.json(
        { error: 'Code cannot be empty' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Cookie setting in Server Actions is not supported
            }
          },
        },
      }
    )

    const fileId = nanoid(12)

    const { error } = await supabase
      .from('lua_files')
      .insert([
        {
          file_id: fileId,
          code: code,
          created_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { error: 'Failed to save code' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const fileUrl = `https://${baseUrl}/file/${fileId}`
    const loadstringUrl = `loadstring(game:HttpGet("${fileUrl}"))()`

    return Response.json({
      success: true,
      fileId,
      fileUrl,
      loadstringUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
