/**
 * Illustration Pipeline
 *
 * Production flow (backend-side, not implemented here):
 *   1. Parent uploads 2-3 reference photos → uploaded to S3/object storage
 *   2. Backend runs DreamBooth fine-tuning on a base SD 1.5 / SDXL checkpoint
 *      with ~15 training steps per photo (fast-dreambooth / LoRA adapter)
 *   3. Per story page, the backend calls SD inference with:
 *        - The per-child LoRA adapter weights
 *        - illustrationPrompt from the story page
 *        - Watercolour children's book ControlNet / style LoRA overlay
 *   4. Generated image is stored and URL returned here
 *
 * This file exports the client-side API interface.
 * In development we return placeholder pastel illustration images.
 */

import { StoryPage } from '../types'

// ─── Stable Diffusion API types ───────────────────────────────────────────────

export interface SDGenerateRequest {
  childLoraUrl: string       // URL to the fine-tuned child LoRA adapter
  prompt: string             // scene prompt from story page
  negativePrompt?: string
  width: number
  height: number
  steps: number
  cfgScale: number
  seed?: number
}

export interface SDGenerateResponse {
  imageUrl: string
  seed: number
}

// ─── Fine-tune request ───────────────────────────────────────────────────────

export interface FineTuneRequest {
  childId: string
  photoUrls: string[]        // 2-3 uploaded reference photos
}

export interface FineTuneResponse {
  loraUrl: string            // ready-to-use LoRA weights URL
  status: 'queued' | 'training' | 'ready'
}

// ─── API stub (replace base URL with real backend) ───────────────────────────

const API_BASE = import.meta.env.VITE_ILLUSTRATION_API ?? ''

export async function submitFineTuneJob(req: FineTuneRequest): Promise<FineTuneResponse> {
  if (!API_BASE) {
    // Dev stub — pretend training takes 2 seconds
    await delay(2000)
    return { loraUrl: 'stub://lora/child-lora.safetensors', status: 'ready' }
  }
  const res = await fetch(`${API_BASE}/fine-tune`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return res.json()
}

export async function generateIllustration(
  req: SDGenerateRequest,
): Promise<SDGenerateResponse> {
  if (!API_BASE) {
    // Dev stub — return a deterministic placeholder based on prompt length
    await delay(800)
    const seed = req.prompt.length * 7
    return {
      imageUrl: getPlaceholderImage(req.prompt),
      seed,
    }
  }
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return res.json()
}

// ─── Generate all pages for a story ─────────────────────────────────────────

export async function generateAllIllustrations(
  pages: StoryPage[],
  loraUrl: string,
  onPageDone: (pageId: number, url: string) => void,
): Promise<void> {
  for (const p of pages) {
    const { imageUrl } = await generateIllustration({
      childLoraUrl: loraUrl,
      prompt: p.illustrationPrompt,
      negativePrompt: 'ugly, blurry, dark, scary, realistic photo, adult, violence',
      width: 768,
      height: 512,
      steps: 30,
      cfgScale: 7,
    })
    onPageDone(p.id, imageUrl)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// Pastel placeholder images from picsum (deterministic by seed)
const PASTEL_PALETTES = [
  'ffd6e7', 'c8e6c9', 'b3e5fc', 'fff9c4', 'e1bee7', 'ffe0b2', 'd1c4e9',
]
function getPlaceholderImage(prompt: string): string {
  const idx = prompt.length % PASTEL_PALETTES.length
  void idx // palette index reserved for future tinting overlay
  // Use picsum with a seed derived from prompt for variety
  const seed = prompt.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 1000
  return `https://picsum.photos/seed/${seed}/768/512`
}
