import { GoogleRequest, GoogleScopeData } from "@/graphql/google";
import { WeatherSerie } from "@/graphql/weather";
import gql from "graphql-tag";

export type MeteoRequestType = GoogleRequest;

export type MeteoQueryResponseType = {
  range: GoogleScopeData,
  weatherRange: WeatherSerie[]
}

export const METEO_DATA_QUERY = gql`
query Query($scope: String, $from: String, $to: String ) {
    range(scope: $scope, from: $from, to: $to) {
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
          note
          time
          value
        }
        max
        min
        count
        avg
      }
    }
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
      }
      source {
        name
        color
        stroke
        slug
        props
      }
    }
  }
`;

