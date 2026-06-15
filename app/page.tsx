import { fetchLandingContent } from '@/lib/storyblok'
import Header      from '@/components/Header'
import Hero        from '@/components/Hero'
import DetailStrip from '@/components/DetailStrip'
import FormSection from '@/components/FormSection'
import Footer      from '@/components/Footer'

export const revalidate = 3600

export default async function LandingPage() {
  const content = await fetchLandingContent()

  return (
    <main style={{ background: '#F1F1EE', minHeight: '100vh' }}>
      <Header />
      <Hero
        title={content.hero_title}
        description={content.hero_description}
        eyebrowLabel={content.eyebrow_label}
      />
      <DetailStrip
        date={content.event_date}
        location={content.event_location}
        duration={content.event_duration}
        spots={content.event_spots}
      />
      <FormSection />
      <Footer />
    </main>
  )
}
