import { PartnerReview } from '../interfaces/PartnerReview'
import { VerifiedPartner } from '../interfaces/VerifiedPartner'

const VERIFIED_PARTNERS_URL = `${process.env.NEXT_PUBLIC_PARTNERS_DATA_URL}/items/profile`
const REVIEWS_URL = `${process.env.NEXT_PUBLIC_PARTNERS_DATA_URL}/items/reviews`

export default class Partners {
  static Url = process.env.NEXT_PUBLIC_PARTNERS_DATA_URL || ''


  static async get({slugs, basicData}: {slugs?: boolean, basicData?: boolean}) {
    let isFinished = false
    let offset = 0
    const querySlugs = slugs ? '&fields=slug' : ''
    const queryBasicData = basicData ? '&fields=name,services,region,slug,country,languages,logo,id,description,team_size,payment_methods' : ''

    const partners: VerifiedPartner[] = []
    while (!isFinished) {
      try {
        const response = await fetch(`${VERIFIED_PARTNERS_URL}?offset=${offset}${querySlugs}${queryBasicData}`)
        const data = (await response.json()).data as VerifiedPartner[]
        if (data.length === 0) {
          isFinished = true
        } else {
          offset += data.length
        }
        partners.push(...data)
      } catch (error) {
        console.log('error', error)
      }
    }
    
    let responsePartnerts = partners
    if (basicData){
      responsePartnerts = partners.map(partner => ({... partner, description: partner.description.substring(0,300)}))
    }
    
    return responsePartnerts
  }

  static async getPartnerData(searchParams: string) {
    let partners: VerifiedPartner[] = []

    try {
      const response = await fetch(`${VERIFIED_PARTNERS_URL}${searchParams}`)

      partners = (await response.json()).data as VerifiedPartner[]
    } catch (error) {
      console.log('error getting partners', error)
    }

    return partners[0]
  }

  static async getAllSlugs() {
    const partners = await this.get({slugs: true})

    return partners.map((partner) => {
      return {
        params: {
          slug: partner.slug,
        },
      }
    })
  }

  static async getAllIds() {
    const partners = await this.get({})

    return partners.map((partner) => {
      return {
        params: {
          id: partner.id,
        },
      }
    })
  }

  static async getReviews (partnerId: number){
    let isFinished = false
    let offset = 0
    const query = `&filter[profile]=${partnerId}`

    const reviews: PartnerReview[] = []
    while (!isFinished) {
      try {
        const response = await fetch(`${REVIEWS_URL}?offset=${offset}${query}`)
        const data = (await response.json()).data as PartnerReview[]
        if (data.length === 0) {
          isFinished = true
        } else {
          offset += data.length
        }
        reviews.push(...data)
      } catch (error) {
        console.log('error', error)
      }
    }

    return reviews
  }
}
