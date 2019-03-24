import app from "./../app.js";

class Songkick {
  constructor() {}
  async getVenue(venueName) {
    // Reference: https://www.songkick.com/developer/venue-search
    return {
      id: 17522,
      displayName: "O2 Academy Brixton",
      city: {
        id: 24426,
        uri: "http://www.songkick.com/metro_areas/24426-uk-london",
        displayName: "London",
        country: { displayName: "UK" },
      },
      metroArea: {
        id: 24426,
        uri: "http://www.songkick.com/metro_areas/24426-uk-london",
        displayName: "London",
        country: { displayName: "UK" },
      },
      uri: "http://www.songkick.com/venues/17522-o2-academy-brixton",
      street: "211 Stockwell Road",
      zip: "SW9 9SL",
      lat: 51.4651268,
      lng: -0.115187,
      phone: "020 7771 3000",
      website: "http://www.brixton-academy.co.uk",
      capacity: 4921,
      description:
        "Brixton Academy is an award winning music venue situated in the heart of Brixton, South London.",
    };
  }
  // <Marker position={[51.5, -0.07]}>
  //           <Popup>
  //             A pretty CSS3 popup. <br /> Easily customizable.
  //           </Popup>
  //         </Marker>
  //         <Marker position={[51.52, -0.08]} />
  async getUpcomingEventsForVenue(venue) {
    // Reference: https://www.songkick.com/developer/upcoming-events-for-venue
    return [
      {
        id: 11129128,
        type: "Concert",
        uri:
          "http://www.songkick.com/concerts/11129128-wild-flag-at-fillmore?utm_source=PARTNER_ID&utm_medium=partner",
        displayName: "Wild Flag at The Fillmore (April 18, 2012)",
        start: {
          time: "20:00:00",
          date: "2012-04-18",
          datetime: "2012-04-18T20:00:00-0800",
        },
        performance: [
          {
            artist: {
              id: 29835,
              uri:
                "http://www.songkick.com/artists/29835-wild-flag?utm_source=PARTNER_ID&utm_medium=partner",
              displayName: "Wild Flag",
              identifier: [],
            },
            id: 21579303,
            displayName: "Wild Flag",
            billingIndex: 1,
            billing: "headline",
          },
        ],
        location: {
          city: "San Francisco, CA, US",
          lat: 51.52,
          lng: -0.1,
        },
        venue: {
          metroArea: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          city: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          zip: "SW9 9SL",
          lat: 51.52,
          lng: -0.1,
          uri:
            "http://www.songkick.com/venues/17522-o2-academy-brixton?utm_source=PARTNER_ID&utm_medium=partner",
          displayName: "O2 Academy Brixton",
          street: "211 Stockwell Road",
          id: 17522,
          website: "http://www.brixton-academy.co.uk/",
          phone: "020 7771 3000",
          capacity: 4921,
          description:
            "Brixton Academy is an award winning music venue situated in the heart of Brixton, South London. The venue has played host to many notable shows and reunions, welcoming a wide variety of artists, from Bob Dylan to Eminem, to the stage. It attracts over half a million visitors per year, accommodating over one hundred events.\n\nBuilt in 1929, the site started life as one of the four state of the art\n Astoria Theaters, screening a variety of motion pictures and shows. In 1972 the venue was transformed into a rock venue and re-branded as The Sundown Centre. With limited success the venue closed it’s doors in 1974 and was not re-opened as a music venue again until 1983, when it became The Brixton Academy.\n\nFeaturing a beautiful Art Deco interior, the venue is now known as the 02 Academy Brixton, and hosts a diverse range of club nights and live performances, as well as seated events. The venue has an upstairs balcony as well as the main floor downstairs. There is disabled access and facilities, a bar and a cloakroom. Club night events are for over 18s, for live music under 14s must be accompanied by an adult.",
        },
        status: "ok",
        popularity: 0.012763,
      },
      {
        id: 11129129,
        type: "Concert",
        uri:
          "http://www.songkick.com/concerts/11129128-wild-flag-at-fillmore?utm_source=PARTNER_ID&utm_medium=partner",
        displayName: "Celtic Woman (April 18, 2012)",
        start: {
          time: "20:00:00",
          date: "2012-04-18",
          datetime: "2012-04-18T20:00:00-0800",
        },
        performance: [
          {
            artist: {
              id: 29835,
              uri:
                "http://www.songkick.com/artists/29835-wild-flag?utm_source=PARTNER_ID&utm_medium=partner",
              displayName: "Celtic Woman",
              identifier: [],
            },
            id: 21579303,
            displayName: "Celtic Woman",
            billingIndex: 1,
            billing: "headline",
          },
        ],
        location: {
          city: "London, UK",
          lat: 51.5,
          lng: -0.07,
        },
        venue: {
          metroArea: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          city: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          zip: "SW9 9SL",
          lat: 51.5,
          lng: -0.07,
          uri:
            "http://www.songkick.com/venues/17522-o2-academy-brixton?utm_source=PARTNER_ID&utm_medium=partner",
          displayName: "Cheshire Arena",
          street: "211 Stockwell Road",
          id: 17522,
          website: "http://www.brixton-academy.co.uk/",
          phone: "020 7771 3000",
          capacity: 4921,
          description:
            "Brixton Academy is an award winning music venue situated in the heart of Brixton, South London. The venue has played host to many notable shows and reunions, welcoming a wide variety of artists, from Bob Dylan to Eminem, to the stage. It attracts over half a million visitors per year, accommodating over one hundred events.\n\nBuilt in 1929, the site started life as one of the four state of the art\n Astoria Theaters, screening a variety of motion pictures and shows. In 1972 the venue was transformed into a rock venue and re-branded as The Sundown Centre. With limited success the venue closed it’s doors in 1974 and was not re-opened as a music venue again until 1983, when it became The Brixton Academy.\n\nFeaturing a beautiful Art Deco interior, the venue is now known as the 02 Academy Brixton, and hosts a diverse range of club nights and live performances, as well as seated events. The venue has an upstairs balcony as well as the main floor downstairs. There is disabled access and facilities, a bar and a cloakroom. Club night events are for over 18s, for live music under 14s must be accompanied by an adult.",
        },
        status: "ok",
        popularity: 0.012763,
      },
      {
        id: 11129130,
        type: "Concert",
        uri:
          "http://www.songkick.com/concerts/11129128-wild-flag-at-fillmore?utm_source=PARTNER_ID&utm_medium=partner",
        displayName: "John Snowfield at The Rusty Bucket (April 19, 2012)",
        start: {
          time: "20:00:00",
          date: "2012-04-19",
          datetime: "2012-04-19T20:00:00-0800",
        },
        performance: [
          {
            artist: {
              id: 29836,
              uri:
                "http://www.songkick.com/artists/29835-wild-flag?utm_source=PARTNER_ID&utm_medium=partner",
              displayName: "John Snowfield",
              identifier: [],
            },
            id: 21579303,
            displayName: "John Snowfield",
            billingIndex: 1,
            billing: "headline",
          },
        ],
        location: {
          city: "London, UK",
          lat: 51.52,
          lng: -0.08,
        },
        venue: {
          metroArea: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          city: {
            uri:
              "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "London",
            country: { displayName: "UK" },
            id: 24426,
          },
          zip: "SW9 9SL",
          lat: 51.52,
          lng: -0.08,
          uri:
            "http://www.songkick.com/venues/17522-o2-academy-brixton?utm_source=PARTNER_ID&utm_medium=partner",
          displayName: "The Rusty Bucket",
          street: "211 Stockwell Road",
          id: 17522,
          website: "http://www.brixton-academy.co.uk/",
          phone: "020 7771 3000",
          capacity: 4921,
          description:
            "Brixton Academy is an award winning music venue situated in the heart of Brixton, South London. The venue has played host to many notable shows and reunions, welcoming a wide variety of artists, from Bob Dylan to Eminem, to the stage. It attracts over half a million visitors per year, accommodating over one hundred events.\n\nBuilt in 1929, the site started life as one of the four state of the art\n Astoria Theaters, screening a variety of motion pictures and shows. In 1972 the venue was transformed into a rock venue and re-branded as The Sundown Centre. With limited success the venue closed it’s doors in 1974 and was not re-opened as a music venue again until 1983, when it became The Brixton Academy.\n\nFeaturing a beautiful Art Deco interior, the venue is now known as the 02 Academy Brixton, and hosts a diverse range of club nights and live performances, as well as seated events. The venue has an upstairs balcony as well as the main floor downstairs. There is disabled access and facilities, a bar and a cloakroom. Club night events are for over 18s, for live music under 14s must be accompanied by an adult.",
        },
        status: "ok",
        popularity: 0.012763,
      },
    ];
  }

  async getDetailsForEvent(eventId) {
    // Reference: https://www.songkick.com/developer/events-details
    return {
      location: { city: "London, UK", lng: -0.1150322, lat: 51.4650846 },
      popularity: 0.526304,
      uri:
        "http://www.songkick.com/concerts/3037536-vampire-weekend-at-o2-academy-brixton?utm_source=PARTNER_ID&utm_medium=partner",
      displayName:
        "Vampire Weekend with Fan Death at O2 Academy Brixton (February 16, 2010)",
      id: 3037536,
      type: "Concert",
      start: {
        time: "19:30:00",
        date: "2010-02-16",
        datetime: "2010-02-16T19:30:00+0000",
      },
      ageRestriction: "14+",
      performance: [
        {
          artist: {
            uri:
              "http://www.songkick.com/artists/288696-vampire-weekend?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "Vampire Weekend",
            id: 288696,
            identifier: [
              {
                href:
                  "http://api.songkick.com/api/3.0/artists/mbid:af37c51c-0790-4a29-b995-456f98a6b8c9.json",
                mbid: "af37c51c-0790-4a29-b995-456f98a6b8c9",
              },
            ],
          },
          displayName: "Vampire Weekend",
          billingIndex: 1,
          id: 5380281,
          billing: "headline",
        },
        {
          artist: {
            uri:
              "http://www.songkick.com/artists/2357033-fan-death?utm_source=PARTNER_ID&utm_medium=partner",
            displayName: "Fan Death",
            id: 2357033,
            identifier: [
              {
                href:
                  "http://api.songkick.com/api/3.0/artists/mbid:2ec79a0d-8b5d-4db2-ad6b-e91b90499e87.json",
                mbid: "2ec79a0d-8b5d-4db2-ad6b-e91b90499e87",
              },
            ],
          },
          displayName: "Fan Death",
          billingIndex: 2,
          id: 7863371,
          billing: "support",
        },
      ],
      venue: {
        metroArea: {
          uri:
            "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
          displayName: "London",
          country: { displayName: "UK" },
          id: 24426,
        },
        city: {
          uri:
            "http://www.songkick.com/metro_areas/24426-uk-london?utm_source=PARTNER_ID&utm_medium=partner",
          displayName: "London",
          country: { displayName: "UK" },
          id: 24426,
        },
        zip: "SW9 9SL",
        lat: 51.4650846,
        lng: -0.1150322,
        uri:
          "http://www.songkick.com/venues/17522-o2-academy-brixton?utm_source=PARTNER_ID&utm_medium=partner",
        displayName: "O2 Academy Brixton",
        street: "211 Stockwell Road",
        id: 17522,
        website: "http://www.brixton-academy.co.uk/",
        phone: "020 7771 3000",
        capacity: 4921,
        description:
          "Brixton Academy is an award winning music venue situated in the heart of Brixton, South London. The venue has played host to many notable shows and reunions, welcoming a wide variety of artists, from Bob Dylan to Eminem, to the stage. It attracts over half a million visitors per year, accommodating over one hundred events.\n\nBuilt in 1929, the site started life as one of the four state of the art\n Astoria Theaters, screening a variety of motion pictures and shows. In 1972 the venue was transformed into a rock venue and re-branded as The Sundown Centre. With limited success the venue closed it’s doors in 1974 and was not re-opened as a music venue again until 1983, when it became The Brixton Academy.\n\nFeaturing a beautiful Art Deco interior, the venue is now known as the 02 Academy Brixton, and hosts a diverse range of club nights and live performances, as well as seated events. The venue has an upstairs balcony as well as the main floor downstairs. There is disabled access and facilities, a bar and a cloakroom. Club night events are for over 18s, for live music under 14s must be accompanied by an adult.",
      },
    };
  }
}

export default new Songkick();
