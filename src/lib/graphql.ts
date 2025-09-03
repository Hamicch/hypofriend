export type GQLRequest = {
  query: string
  variables?: Record<string, unknown>
}

/**
 * Minimal GraphQL client using fetch. We keep it tiny so:
 * - The UI/composables call this exactly like they would in prod.
 * - In dev, our mock (MSW or dev middleware) intercepts POST and returns fixtures.
 * - When the real API becomes available, no code changes are needed, we'll disable the mock.
 */
export async function gqlFetch<T>(
  body: GQLRequest,
  signal?: AbortSignal,
  endpoint = '/q',
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: '*/*',
    },
    credentials: 'include',
    body: JSON.stringify(body),
    signal,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message ?? `HTTP ${res.status}`)
  }
  if (json?.errors?.length) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  return json.data as T
}
