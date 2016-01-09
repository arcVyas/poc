---
  currentOptions:
    - Schedule Help @ Store
    - Schedule Appliance/TV Help @ Home
    - Schedule AutoTech @ Store
    - Schedule Computer Repair @ Home
  newOptions:
    - 
      Services:
        -  
          In-Home Services:
            - Appliance
            - TV
            - Computer
        - 
          InStore Services:
            - Everything
        - 
          Online Services:
            - Computer
            - Mobile
            - Home Automation
    -
      Agents:
        -
          name: "John"
          company : "BBY"
          location : MN
          skill:
            - Computer
            - Mobile
            - Home Automation
          canServiceAt:
            - InHome
            - Online
            - OnPhone
        -
          availability:
            - 
              twoWeeksAvailability : 
                - "1/6/15 11:00-12:00"
                - "1/6/15 14:00-15:00"
                - "1/7/15 08:00-06:00"
        -
          favourability:
            - 
              rating : "5"
              
              
    -
      Customer:
          -
            location : 55317
            patience : "low"
            favourites :
              - John
              - Mary
            complainedAbout:
              - Tom
              
    -
      searchOptions:
        -
          issue: Connect my nest / Remote locks for the house
          // underWarranty: false
          serviceLocation: "NoPreference/In Home/Remote/Dropin"
          customerLocation: 55317
          expectedTime: "Now / Better Rate / after 1/7/15 or before 1/10/15 or 2:00pm today"
          myFavs: true
          // priceRange: 50-200 (Dont use this in demo)
          
    -
      api
        -
          uri: /poc/agents?service=""&deviceId=""&underWarranty=""&serviceLocation=""&customerLocation=""&expectedTime=""&myFavs=""&priceRange=""
          
          
