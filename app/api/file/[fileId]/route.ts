import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    if (!fileId || typeof fileId !== 'string') {
      return Response.json(
        { error: 'Invalid file ID' },
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

    const { data, error } = await supabase
      .from('lua_files')
      .select('code')
      .eq('file_id', fileId)
      .single()

    if (error || !data) {
      return Response.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      code: data.code,
    })
  } catch (error) {
    console.error('Retrieval error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
