import { z } from 'zod'

export const LeadSchema = z.object({
  nombre:               z.string().min(1).max(100).trim(),
  apellido:             z.string().min(1).max(100).trim(),
  email_empresa:        z.string().trim().toLowerCase().email().max(200),
  empresa:              z.string().min(1).max(200).trim(),
  cargo:                z.string().max(100).trim().optional(),
  tamano_equipo:        z.string().max(50).trim().optional(),
  acepta_comunicaciones: z.boolean(),
  utm_source:           z.string().max(100).trim().optional(),
  utm_medium:           z.string().max(100).trim().optional(),
  utm_campaign:         z.string().max(100).trim().optional(),
  session_id:           z.string().max(100).trim().optional(),
})

export type Lead = z.infer<typeof LeadSchema>
