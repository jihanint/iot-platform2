import React from "react";

import { Box, Flex, Heading } from "@chakra-ui/react";
import GoogleMapReact from "google-map-react";

// const AnyReactComponent = ({ text }: { text: string; lat?: number; lng?: number }) => <div>{text}</div>;
const MapViewBox = () => {
  return (
    <Box as="section">
      <Flex justify="space-between" align="center" mb="12px">
        <Heading size="sm">Tampilan Peta</Heading>
      </Flex>
      <Box w="full" h="45vh" bg="green">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={{
            lat: -8.657382,
            lng: 121.079369,
          }}
          zoom={8}
          yesIWantToUseGoogleMapApiInternals
          // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)},
        >
          {/* <AnyReactComponent lat={-8.551999462523023} lng={120.51112728386155} text="Koeowe" /> */}
        </GoogleMapReact>
      </Box>
    </Box>
  );
};

export default MapViewBox;
