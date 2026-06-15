'use client'

import { useEffect } from 'react'
import { sendGAEvent } from '@next/third-parties/google'

interface PageAnalyticsProps {
  eventName:     string
  eventDate:     string
  eventLocation: string
}

export default function PageAnalytics({ eventName, eventDate, eventLocation }: PageAnalyticsProps) {
  useEffect(() => {
    // view_item: qué contenido está viendo el usuario en esta sesión
    sendGAEvent('event', 'view_item', {
      item_name:     eventName,
      item_category: 'evento_presencial',
      item_variant:  eventDate,
      item_brand:    'Garaje de Ideas',
      location_id:   eventLocation,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
