import type { KeyboardEvent } from 'react'
import type { GeoJsonObject } from 'geojson'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps/core'
import worldGeography from '../../assets/maps/world-110m.json'
import {
  manufacturingClients,
  type ManufacturingClientRegionId,
} from '../../data/manufacturing/content'

interface ManufacturingClientsMapProps {
  activeRegionId: ManufacturingClientRegionId
  onRegionSelect: (regionId: ManufacturingClientRegionId) => void
}

const MAP_WIDTH = 980
const MAP_HEIGHT = 460
const EXCLUDED_COUNTRY_CODES = new Set(['010'])
const regions = manufacturingClients.regions
// react-simple-maps accepts TopoJSON at runtime, though its public prop type is narrowed to GeoJSON.
const worldMap = worldGeography as unknown as GeoJsonObject

const explicitCountryRegion = new Map<string, ManufacturingClientRegionId>()

for (const region of regions) {
  for (const countryCode of region.map.countryCodes) {
    if (import.meta.env.DEV && explicitCountryRegion.has(countryCode)) {
      throw new Error(`Map country ${countryCode} is assigned to more than one client region.`)
    }
    explicitCountryRegion.set(countryCode, region.id)
  }
}

const fallbackRegion = regions.find((region) => region.map.includeUnassignedCountries)

function getCountryCode(id: string | number | undefined) {
  return id === undefined ? undefined : String(id).padStart(3, '0')
}

function getCountryRegion(countryCode: string) {
  return explicitCountryRegion.get(countryCode) ?? fallbackRegion?.id
}

export function ManufacturingClientsMap({
  activeRegionId,
  onRegionSelect,
}: ManufacturingClientsMapProps) {
  const handleRegionKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    regionId: ManufacturingClientRegionId,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRegionSelect(regionId)
  }

  const activeRegion = regions.find((region) => region.id === activeRegionId) ?? regions[0]

  return (
    <div className="mfg-clients-map-wrap">
      <ComposableMap
        className="mfg-clients-map"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        projection="geoEqualEarth"
        projectionConfig={{ center: [0, 3], scale: 171 }}
        role="group"
        aria-labelledby="mfg-clients-map-title mfg-clients-map-description"
      >
        <title id="mfg-clients-map-title">Global client markets</title>
        <desc id="mfg-clients-map-description">
          Select North America or Europe to view clients in that region.
        </desc>

        <Geographies geography={worldMap}>
          {({ geographies }) => regions.map((region) => {
            const isInteractive = region.id !== 'international'
            const regionGeographies = geographies.filter((geography) => {
              const countryCode = getCountryCode(geography.id)
              if (!countryCode) return region.map.includeUnassignedCountries
              return !EXCLUDED_COUNTRY_CODES.has(countryCode)
                && getCountryRegion(countryCode) === region.id
            })

            return (
              <g
                key={region.id}
                className="mfg-map-region"
                data-region={region.id}
                data-active={activeRegionId === region.id}
                data-interactive={isInteractive}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : -1}
                aria-label={isInteractive ? `Select ${region.title}` : undefined}
                aria-pressed={isInteractive ? activeRegionId === region.id : undefined}
                style={{ outline: 'none' }}
                onMouseDown={isInteractive ? (event) => event.preventDefault() : undefined}
                onClick={isInteractive ? () => onRegionSelect(region.id) : undefined}
                onKeyDown={isInteractive
                  ? (event) => handleRegionKeyDown(event, region.id)
                  : undefined}
              >
                {regionGeographies.map((geography) => (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    className="mfg-map-country"
                    style={{ outline: 'none' }}
                    tabIndex={-1}
                    focusable="false"
                    aria-hidden="true"
                  />
                ))}
              </g>
            )
          })}
        </Geographies>

        <Marker
          coordinates={activeRegion.map.marker.coordinates}
          className="mfg-map-active-marker"
          aria-hidden="true"
        >
          <circle className="mfg-map-pin-ring" r="17" />
          <circle className="mfg-map-pin-dot" r="6" />
          <g
            className="mfg-map-active-label"
            transform={`translate(${activeRegion.map.marker.labelOffset.join(',')})`}
          >
            <rect width={activeRegion.map.marker.labelWidth} height="34" rx="17" />
            <circle cx="17" cy="17" r="4" />
            <text x="29" y="21.5">{activeRegion.title}</text>
          </g>
        </Marker>
      </ComposableMap>
    </div>
  )
}
