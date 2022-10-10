import React, { useState, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { PaymentMethod, Region, Service, TeamSize, VerifiedPartner } from '../../interfaces/VerifiedPartner'
import PartnerCard from '../PartnerCard/PartnerCard'
import { Dropdown, AccordionTitleProps, Accordion, Form, Menu, CheckboxProps, Button } from 'semantic-ui-react'
interface Props {
  partners: VerifiedPartner[]
}

enum FilterType {
  Services = 'services',
  Region = 'region',
  TeamSize = 'team_size',
  PaymentMethod = 'payment_methods',
  Language = 'languages',
}

type Filters = Record<FilterType, string[]>
const EMPTY_FILTER = {} as Filters

const dropdownContent = [
  {
    key: FilterType.Services,
    title: <FormattedMessage id={FilterType.Services} />,
    options: Service,
  },
  {
    key: FilterType.Region,
    title: <FormattedMessage id={FilterType.Region} />,
    options: Region,
  },
  {
    key: FilterType.TeamSize,
    title: <FormattedMessage id={FilterType.TeamSize} />,
    options: TeamSize,
  },
  {
    key: FilterType.PaymentMethod,
    title: <FormattedMessage id={FilterType.PaymentMethod} />,
    options: PaymentMethod,
  },
]

function PartnersList({ partners }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTER)
  const [filteredPartners, setFilteredPartners] = useState(partners)

  const handleTitleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, titleProps: AccordionTitleProps) => {
    e.stopPropagation()
    const { index } = titleProps
    const idxNumber = Number(index)
    if (currentIdx === idxNumber) {
      setCurrentIdx(-1)
    } else {
      setCurrentIdx(idxNumber)
    }
  }

  const handleItemClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>, itemData: CheckboxProps) => {
    event.stopPropagation()
    const { checked, name, value } = itemData
    const filterType = name as FilterType

    if (checked) {
      setFilters((prev) => ({ ...prev, [filterType]: [...(prev[filterType] || []), value] }))
    } else {
      const newFilters = filters[filterType].filter((item) => item !== value)
      if (newFilters.length === 0) {
        setFilters((prev) => {
          const filterRemoved = { ...prev }
          delete filterRemoved[filterType]
          return filterRemoved
        })
      } else {
        setFilters((prev) => ({ ...prev, [filterType]: newFilters }))
      }
    }
  }

  const languages = useMemo(() => {
    let uniqueLanguages = new Set<string>()
    partners.map((partner) => (uniqueLanguages = new Set([...uniqueLanguages, ...partner.languages])))
    return Array.from(uniqueLanguages).sort((a, b) => a.localeCompare(b))
  }, [partners])

  const applyFilters = () => {
    const selectedPartners = partners.filter((partner) =>
      Object.entries(filters).every(([type, filters]) => {
        const filterKey = type as `${FilterType}`
        return filters.some((filter) => partner[filterKey] === filter || partner[filterKey].includes(filter as never))
      })
    )

    if (Object.keys(selectedPartners).length === 0 && Object.keys(filters).length === 0) {
      setFilteredPartners(partners)
    } else {
      setFilteredPartners(selectedPartners)
    }
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTER)
    setFilteredPartners(partners)
  }

  useEffect(() => {
    console.log(filters)
  }, [filters])

  return (
    <>
      <h3>
        <FormattedMessage id="verified_partners" />
      </h3>
      <Dropdown text="Filter" closeOnBlur={false}>
        <Dropdown.Menu>
          <Accordion>
            {dropdownContent.map((item, index) => {
              return (
                <Menu.Item key={item.key}>
                  <Accordion.Title
                    active={currentIdx === index}
                    content={item.title}
                    index={index}
                    onClick={handleTitleClick}
                  />
                  <Accordion.Content
                    active={currentIdx === index}
                    content={
                      <Form>
                        <Form.Group grouped>
                          {Object.entries(item.options).map(([key, value]) => (
                            <Form.Checkbox
                              label={value}
                              name={item.key}
                              value={value}
                              key={key}
                              onClick={handleItemClick}
                            />
                          ))}
                        </Form.Group>
                      </Form>
                    }
                  />
                </Menu.Item>
              )
            })}
            <Menu.Item>
              <Accordion.Title
                active={currentIdx === dropdownContent.length + 1}
                content={<FormattedMessage id="languages" />}
                index={dropdownContent.length + 1}
                onClick={handleTitleClick}
              />
              <Accordion.Content
                active={currentIdx === dropdownContent.length + 1}
                content={
                  <Form>
                    <Form.Group grouped>
                      {languages.map((language) => (
                        <Form.Checkbox
                          label={language}
                          name={FilterType.Language}
                          value={language}
                          key={language}
                          onClick={handleItemClick}
                        />
                      ))}
                    </Form.Group>
                  </Form>
                }
              />
            </Menu.Item>
          </Accordion>
          <div>
            <Button onClick={clearFilters}>
              <FormattedMessage id="clear" />
            </Button>
            <Button onClick={applyFilters}>
              <FormattedMessage id="apply" />
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      {filteredPartners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </>
  )
}

export default PartnersList
