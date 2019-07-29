// My places informations 
var model = [{
    name: 'Riyadh Gallery',
    category: 'Mall',
    location: {
      lat: 24.743661,
      lng: 46.657835
    }
  },

  {
    name: 'panorama Mall',
    category: 'Mall',
    location: {
      lat: 24.692826,
      lng: 46.669914
    }

  },
  {
    name: 'Kingdome hospital',
    category: 'hospital',
    location: {
      lat: 24.801187,
      lng: 46.654272
    } , 
    
  },

  {
    name: 'King Fahad Medical Hopspital',
    category: 'hospital',
    location: {
      lat: 24.686928,
      lng: 46.705381
    }
  },

  {
    name: 'Lavender',
    category: 'Restaurant',
    location: {
      lat: 24.783536,
      lng: 46.661180
    },
    
  },
  {
    name: 'Prince Faisal bin Fahd Fine Arts Hall',
    category: 'Gallery',
    location: { 
      lat: 24.6638274,
      lng: 46.6901833
    }
  },
  {
    name: 'King Khalid International Airport',
    category: 'airport',
    location: { 
      lat: 24.9420324,
      lng: 46.7117278
    }
  }, 
  {
    name: 'Bateel Cafe',
    category: 'Restaurant',
    location: { 
      lat: 24.6975191,
      lng: 46.6828716
    }
  },
  {
    name: 'Angolo Alforno',
    category: 'Restaurant',
    location: { 
      lat:	24.6865756,
      lng: 46.7472845
    }
  },
  {
    name: 'Charleys Philly Steaks',
    category: 'Restaurant',
    location: { 
      lat: 24.685355,
      lng: 46.775555
    }
  },
  {
    name: 'Centria Mall',
    category: 'mall',
    location: { 
      lat: 	24.6975011,
      lng: 46.6839679
    }
  },
  {
    name: ' Localizer Mall',
    category: 'mall',
    location: { 
      lat: 	24.6987789,
      lng: 46.6908512
    }
  },
  {
    name: 'Garnada Mall',
    category: 'mall',
    location: { 
      lat: 	24.7817896,
      lng: 46.7307607
    }
  },
  
  {
    name: 'King Salman Science Oasis',
    category: 'Museum',
    location: { 
      lat: 	24.6786104,
      lng: 46.630878
    }
  },
  
    
  {
    name: 'King Salman Science Oasis Taawun',
    category: 'Museum',
    location: { 
      lat: 	24.6786104,
      lng: 46.630878
    }
  }


];


var infoWindow;
var map;
var marker;

/* Initialize Google Map */

function initMap() {
  var options = {
    lat: 24.713552,
    lng: 46.675296
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: options
  });

  for (var i = 0; i < model.length; i++) {
    var Position = model[i].location;
    var name = model[i].name;
    var category = model[i].category;


    var marker = new google.maps.Marker({
      position: Position,
      map: map,
      title: name,
      animation: google.maps.Animation.DROP,

    });

    vm.locationList()[i].marker = marker;

    infowindow = new google.maps.InfoWindow({
      maxwidth: 250
    });

    // show details info about location when user clicks on a marker
 google.maps.event.addListener(marker, 'click', populateInfoWindow);

  google.maps.event.addListener(marker, 'click', markerBounce);

  }

  function markerBounce() {
    var marker = this;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 2000);
  }




  // Foursquare API request




  function populateInfoWindow() {
    var marker =this;
    var query = marker.title;

    var ll = marker.position.lat() + ',' + marker.position.lng();

    var foursqUrl = "https://api.foursquare.com/v2/venues/search?q=" + query + '&ll=' + ll + '&v=20172510'+
        "&client_id=ESSJQX2SZUMYCN12PMB2JT3V0DEJQZTAMR1UC2Q5EUVJRCZH&client_secret=VAFUWQB4IDLRWFTYRBCWBGLW0SXR5CHY54PGQFMHCIB0SGOB";
    // AJAX call to Foursquare
    $.ajax({
      url: foursqUrl,
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
        console.log(data);

        var venues = data.response.venues;
        var address = venues[0].location.address;

        infowindow.marker = marker;
        infowindow.setContent('<div>' + '<h4>' + marker.title + '</h4>' + '<p>' + address + '</p>');
        infowindow.open(map, marker);
    
    }).fail(function() {
      infowindow.setContent('<div>' + '<h4>' + marker.title + '</h4>' + '<p>' + 'Sorry couldnot found.' + '</p>' + '</div>');
      infowindow.open(map, marker);

    });
  }

}

//######################MyViewModel################################//

var MyViewModel = function() {

  var self = this;


  var models = function(data) {

    self.name = ko.observable(data.name);
    self.location = ko.observable(data.location);
    self.isVisible = ko.observable(true);

  };
  this.locationList = ko.observableArray(model);

  this.locationList().forEach(function(location) {
    location.isVisible = ko.observable(true);

  });

  this.foursquareApi = function() {



    locations.forEach(function(location) {
      self.locationList.push(new Location(location));
    });


    self.markers().push(marker);

    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
    marker.addListener('click', function() {
      toggleBounce(this);
    });
    self.locationList()[i].marker = marker;


  };

  self.query = ko.observable('');


  self.filteredPlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.locationList(), function(rec) {
      if (self.query().length === 0 || rec.name.toLowerCase().indexOf(self.query().toLowerCase()) > -1) {
        if (rec.marker) rec.marker.setVisible(true);
        return true;
      } else {
        if (rec.marker) rec.marker.setVisible(false);
        return false;
      }
    });
  });

  self.setMarker = function(data) {
    self.locationList().forEach(function(location) {
      location.marker.setVisible(false);
    });

    data.marker.setVisible(true);

    data.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      data.marker.setAnimation(null);
    }, 2000);

  };

 self.showInfo =  function(location){
    google.maps.event.trigger(location.marker,'click');
  };
};

// Apply KO bindings
var vm = new MyViewModel();

ko.applyBindings(vm);

function errorHandling() {
  alert("Google Maps has failed to load. Please check your internet connection and try again.");
}