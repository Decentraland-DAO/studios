import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Partners from '../../clients/Partners'
import { VerifiedPartner } from '../../interfaces/VerifiedPartner'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import React from 'react'
import PartnerProfile from '../../components/PartnerProfile/PartnerProfile'
import { PartnerProject } from '../../interfaces/PartnerProject'
import Projects from '../../clients/Projects'
import { PartnerReview } from '../../interfaces/PartnerReview'

const DATA_URL = process.env.NEXT_PUBLIC_PARTNERS_DATA_URL

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params && params.slug) {
    const partner = await Partners.getPartnerData(`?filter[slug]=${params.slug}`)
    const projects = await Projects.getProject(`?filter[profile]=${partner.id}&sort[]=-date_created`)
    const reviews = await Partners.getReviews(partner.id)

    return {
      props: {
        partner,
        projects,
        reviews,
      }
    }
  }

  return {
    props: { error: true },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await Partners.getAllSlugs()

  return {
    paths,
    fallback: false,
  }
}

interface Props {
  partner: VerifiedPartner
  projects: PartnerProject[]
  reviews: PartnerReview[]
}

function Partner({ partner, projects, reviews }: Props) {
  
  return (
    <Container>
      <Head>
        <meta property="og:title" content="Let’s build the metaverse together. Find the Right Team for Your Project" />
        <meta property="og:description" content={`Profile of ${partner.name} studio`} />
        <meta property="og:image" content={`${DATA_URL}/assets/${partner.logo}?key=meta-link`} />

        <meta property="og:url" content={`https://studios.decentraland.org/profile/${partner.slug}`} />

        <meta property="twitter:url" content={`https://studios.decentraland.org/profile/${partner.slug}`} />
        <meta name="twitter:title" content="Let’s build the metaverse together. Find the Right Team for Your Project" />
        <meta name="twitter:description" content={`Profile of ${partner.name} studio`} />
        <meta name="twitter:image" content={`${DATA_URL}/assets/${partner.logo}?key=meta-link`}/>

        <link rel="canonical" href={`https://studios.decentraland.org/profile/${partner.slug}`} />
      </Head>

      <main>
        <PartnerProfile partner={partner} projects={projects} reviews={reviews}/>
      </main>
    </Container>
  )
}

export default Partner
