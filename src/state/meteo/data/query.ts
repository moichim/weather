import { GoogleRequest, GoogleScopeData } from "@/graphql/google/google";
import { WeatherResponse, WeatherSerie } from "@/graphql/weather/weather";
import gql from "graphql-tag";

export type MeteoRequestType = GoogleRequest & {
  hasNtc: boolean
};

export type MeteoQueryResponseType = {
  range: GoogleScopeData,
  weatherRange: WeatherResponse
}

export const METEO_DATA_QUERY = gql`
query Source($lat: Float!, $lon: Float!, $hasNtc: Boolean!, $from: Float, $to: Float, $scope: String, $sheetId: String!, $sheetTab: String!) {
  weatherRange(lat: $lat, lon: $lon, hasNtc: $hasNtc, from: $from, to: $to, scope: $scope) {
    data {
      source {
        name
        color
        stroke
        slug
        props
        description
      }
      entries {
        time
        temperature
        wind_dir
        wind_speed
        bar
        rain
        clouds
        humidity
        uv
        radiance
        evapotranspiration
        snow_depth
      }
      statistics {
        temperature {
          min
          max
          avg
          count
        }
        wind_dir {
          min
          max
          avg
          count
        }
        wind_speed {
          min
          max
          avg
          count
        }
        bar {
          min
          max
          avg
          count
        }
        rain {
          min
          max
          avg
          count
        }
        clouds {
          min
          max
          avg
          count
        }
        humidity {
          min
          max
          avg
          count
        }
        uv {
          min
          max
          avg
          count
        }
        radiance {
          min
          max
          avg
          count
        }
        evapotranspiration {
          min
          max
          avg
          count
        }
        snow_depth {
          min
          max
          avg
          count
        }
      }
    }
    request {
      scope
      lat
      lon
      from
      to
    }
  }
  range(lat: $lat, lon: $lon, sheetId: $sheetId, sheetTab: $sheetTab, from: $from, to: $to, scope: $scope) {
    data {
      name
      slug
      color
      in {
        type
        unit
        name
        field
        in
        color
        slug
        min
        max
      }
      values {
        time
        value
        note
      }
      min
      max
      avg
      count
      description
    }
  }
}
`;

export const METEO_RANGE_QUERY = gql`

query Source($lat: Float!, $lon: Float!, $hasNtc: Boolean!, $from: Float, $to: Float, $scope: String, $sheetId: String!, $sheetTab: String!) {
  weatherRange(lat: $lat, lon: $lon, hasNtc: $hasNtc, from: $from, to: $to, scope: $scope) {
    data {
      source {
        name
        color
        stroke
        slug
        props
        description
      }
      entries {
        time
        temperature
        wind_dir
        wind_speed
        bar
        rain
        clouds
        humidity
        uv
        radiance
        evapotranspiration
        snow_depth
      }
      statistics {
        temperature {
          min
          max
          avg
          count
        }
        wind_dir {
          min
          max
          avg
          count
        }
        wind_speed {
          min
          max
          avg
          count
        }
        bar {
          min
          max
          avg
          count
        }
        rain {
          min
          max
          avg
          count
        }
        clouds {
          min
          max
          avg
          count
        }
        humidity {
          min
          max
          avg
          count
        }
        uv {
          min
          max
          avg
          count
        }
        radiance {
          min
          max
          avg
          count
        }
        evapotranspiration {
          min
          max
          avg
          count
        }
        snow_depth {
          min
          max
          avg
          count
        }
      }
    }
    request {
      scope
      lat
      lon
      from
      to
    }
  }
  range(lat: $lat, lon: $lon, sheetId: $sheetId, sheetTab: $sheetTab, from: $from, to: $to, scope: $scope) {
    data {
      name
      slug
      color
      in {
        type
        unit
        name
        field
        in
        color
        slug
        min
        max
      }
      values {
        time
        value
        note
      }
      min
      max
      avg
      count
      description
    }
  }
}

`;

