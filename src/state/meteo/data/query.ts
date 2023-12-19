import { GoogleRequest, GoogleScopeData } from "@/graphql/google/google";
import { WeatherSerie } from "@/graphql/weather/weather";
import gql from "graphql-tag";

export type MeteoRequestType = GoogleRequest;

export type MeteoQueryResponseType = {
  range: GoogleScopeData,
  weatherRange: WeatherSerie[]
}

export const METEO_DATA_QUERY = gql`
query Entries($from: Float, $to: Float, $scope: String ) {
  weatherRange(from: $from, to: $to, scope: $scope) {
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
    source {
      name
      color
      stroke
      slug
      props
    }
    statistics {
      time {
        min
        max
        avg
        count
      }
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
  range(from: $from, to: $to, scope: $scope) {
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
    }
  }
}
`;

export const METEO_RANGE_QUERY = gql`

query Entries($from: Float, $to: Float, $scope: String ) {
  weatherRange(from: $from, to: $to, scope: $scope) {
    source {
      name
      color
      stroke
      slug
      props
    }
    statistics {
      time {
        min
        max
        avg
        count
      }
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
  range(from: $from, to: $to, scope: $scope) {
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
      }
      min
      max
      avg
      count
    }
  }
}

`;

