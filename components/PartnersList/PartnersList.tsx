import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { VerifiedPartner } from '../../interfaces/VerifiedPartner'
import PartnerCard from '../PartnerCard/PartnerCard'

import styles from './PartnersList.module.css'
import Filters from '../Filters/Filters'
import Empty from '../Icons/Empty'
import { trackLink } from '../utils'
import IconFilter from '../Icons/IconFilter'
import IconX from '../Icons/IconX'

interface Props {
  partners: VerifiedPartner[]
}

const isDevelopment = process.env.NODE_ENV === 'development'

function PartnersList({ partners }: Props) {
  const JOIN_REGISTRY_URL = 'https://dclstudios.typeform.com/to/NfzmbzXi'

  const [filteredPartners, setFilteredPartners] = useState(partners)
  const [limit, setLimit] = useState(parseInt(globalThis?.sessionStorage?.studiosListLimit) || 10)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filtersCount, setFiltersCount] = useState(0)

  const sortAlphabeticPartners = (filteredPartners: VerifiedPartner[]) =>
    [...filteredPartners].sort((p1: VerifiedPartner, p2: VerifiedPartner) => p1.slug.localeCompare(p2.slug))

  const randomizePartners = (filteredPartners: VerifiedPartner[]) =>
    [...filteredPartners]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

  const sortByServicesCount = (partners: VerifiedPartner[]) =>
    partners.sort((p1: VerifiedPartner, p2: VerifiedPartner) => (p2.services || []).length - (p1.services || []).length)

  const initPartnerList = sortByServicesCount(sortAlphabeticPartners(filteredPartners))
  const [partnersList, setPartnersList] = useState(initPartnerList)

  useEffect(() => {
    setPartnersList(() => sortByServicesCount(randomizePartners(filteredPartners)))
  }, [filteredPartners.length])

  

  let renderList = partnersList.slice( 0, limit )

  useEffect(() => {
    globalThis.sessionStorage.setItem('studiosListLimit', limit.toString());
  }, [limit])

  if (!isDevelopment){
    //prevent dev studios from showing in production
    const restrictedIds = [353, 358]
    renderList = renderList.filter(partner => !restrictedIds.includes(partner.id))
  }

  return (
    <>
      <div className={styles.container}>
        <Filters partners={partners}
          setFilteredPartners={setFilteredPartners} 
          onClose={() => setShowMobileFilters(false)}
          setFiltersCount={(count: number) => setFiltersCount(count)}
          showMobileFilters={showMobileFilters}/>
        <div className={styles.list_container}>
          <div className={styles.title_container}>
            <div className={styles.title_subcontainer}>
              <h3>
                <FormattedMessage id="title" />
              </h3>
              <span className={styles.results_count}>{partnersList.length} RESULTS</span>
              <span className={styles.filtersButton}><IconFilter onClick={() => setShowMobileFilters(true)} /></span>
              
            </div>
            <a
              className={styles.link_join}
              target={'_blank'}
              href={JOIN_REGISTRY_URL}
              rel="noreferrer"
              onClick={() => trackLink('Open External Link', 'Join Registry', JOIN_REGISTRY_URL)}
            />

          </div>
          {renderList.length ? (
            <>
              {renderList.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
              {partnersList.length >= limit && <div className={styles.load_more_container}><div className={'button_primary'} onClick={() => setLimit(current => current + 10)}>LOAD MORE</div></div>}
            </>
          ) : (
            <div className={styles.empty}>
              <Empty />
              <br />
              <FormattedMessage id="filter.noResults" />
            </div>
          )}
        </div>
      </div>
      {filtersCount ? <div className={styles['clearButton--mobile']} onClick={() => setShowMobileFilters(true)}><IconFilter white />&nbsp;{filtersCount} filter{filtersCount > 1 ? 's' : ''} active</div> : null}
      <div className={styles.footer_text_container}>
        <FormattedMessage
          id="footer_message"
          values={{
            i: (chunks) => <i>{chunks}</i>,
            a1: (chunks) => (
              <a
                className={styles.link}
                target={'_blank'}
                href="https://governance.decentraland.org/"
                rel="noreferrer"
                onClick={() =>
                  trackLink('Open External Link', 'Governance Footer', 'https://governance.decentraland.org/')
                }
              >
                {chunks}
              </a>
            ),
            a2: (chunks) => (
              <a
                className={styles.link}
                target={'_blank'}
                href={JOIN_REGISTRY_URL}
                rel="noreferrer"
                onClick={() => trackLink('Open External Link', 'Join Registry', JOIN_REGISTRY_URL)}
              >
                {chunks}
              </a>
            ),
          }}
        />
      </div>
    </>
  )
}

export default PartnersList
