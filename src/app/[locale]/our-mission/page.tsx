import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

const YOUTUBE_EMBED_ID = 'dszBDeCnLeE'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'missionPage' })

  return {
    title: `${t('ourMission')} - World Clap Day`,
    description: 'Our mission and vision for World Clap Day.',
  }
}

export default async function OurMissionPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'missionPage' })

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Our Mission */}
        <section>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {t('ourMission')}
          </h1>
          <div className="space-y-4 text-foreground">
            <p>{t('missionP1')}</p>
            <div className="border-t border-b border-border py-8 my-8">
              <p className="text-center italic text-muted-foreground">
                {t('missionP2')}
              </p>
            </div>
            <p>{t('missionP3')}</p>
            <p>{t('missionP4')}</p>
            <p>{t('missionP5')}</p>
            <p>{t('missionP6')}</p>
            <p>{t('missionP7')}</p>
          </div>
        </section>

        {/* Our Vision */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {t('ourVision')}
          </h2>
          <div className="space-y-4 text-foreground">
            <p>{t('visionP1')}</p>
            <p>{t('visionP2')}</p>
            <p>{t('visionP3')}</p>
            <p>{t('visionP4')}</p>
            <p>{t('visionP5')}</p>
            <p>{t('visionP6')}</p>
            <p>{t('visionP7')}</p>
            <p>{t('visionP8')}</p>
            <p>{t('visionP9')}</p>
            <p>{t('visionP10')}</p>
          </div>
        </section>

        {/* YouTube embed - full width of text block */}
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            title="World Clap Day"
            src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
