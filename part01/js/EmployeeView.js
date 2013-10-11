var EmployeeView = function(employee) {

    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.add-location-btn', this.addLocation);
        this.el.on('click', '.add-contact-btn', this.addToContacts);
        this.el.on('click', '.change-pic-btn', this.changePicture);
    };

    this.render = function() {
        this.el.html(EmployeeView.template(employee));
        return this;
    };

	this.addLocation = function(event) {
	    event.preventDefault();
	    console.log('addLocation');
	    //navigator.geolocation.getCurrentPosition(
	    navigator.geolocation.watchPosition(
	        function(position) {
	            $('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
	        },
	        function() {
	            alert('Error getting location');
	        },
	        { maximumAge: 30000, timeout: 30000, enableHighAccuracy: true });
	    return false;
	};

	this.addToContacts = function(event) {
	    event.preventDefault();
	    console.log('addToContacts');
	    if (!navigator.contacts) {
	        app.showAlert("Contacts API not supported", "Error");
	        return;
	    }
	    var contact = navigator.contacts.create();
	    var name = new ContactName();
	    name.givenName = employee.firstName;
	    name.familyName = employee.lastName;

	    contact.name = name;

//	    contact.name = {givenName: employee.firstName, familyName: employee.lastName};
	    var phoneNumbers = [];
	    phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
	    phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
	    contact.phoneNumbers = phoneNumbers;
	    contact.save(function(){
	    	alert('Saved!');
	    }, function(contactError){
	    	alert('Error= ' + contactError.code);
	    });
	    //return false;
	    return;
	};

	this.changePicture = function(event) {
	    event.preventDefault();
	    if (!navigator.camera) {
	        app.showAlert("Camera API not supported", "Error");
	        return;
	    }
	    var options =   {   quality: 50,
	                        destinationType: Camera.DestinationType.DATA_URL,
	                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
	                        encodingType: 0     // 0=JPG 1=PNG
	                    };
	 
	    navigator.camera.getPicture(
	        function(imageData) {
	            $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
	        },
	        function() {
	            app.showAlert('Error taking picture', 'Error');
	        },
	        options);
	 
	    return false;
	};

    this.initialize();

 }

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());