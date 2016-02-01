var addSkillButton = document.querySelector('.add-skill');
var skillTemplate = document.querySelector('.skill' ).cloneNode(true);

function addSkillHandler(evt) {
	var prevSkill = last('.skill');
	var newSkill = skillTemplate.cloneNode(true);
	var submitNode = document.querySelector('.submit');
	var form = submitNode.parentNode;

	prevSkill.querySelector('.add-skill' ).classList.add('hidden');
	prevSkill.querySelector('.remove-skill' ).classList.remove('hidden');

	newSkill.querySelector('.add-skill' ).addEventListener('click', addSkillHandler);
	newSkill.querySelector('.remove-skill' ).addEventListener('click', removeSkillHandler);

	form.insertBefore(newSkill, submitNode)
}
addSkillButton.addEventListener('click', addSkillHandler);



// Remove some skills. -JMS
var removeSkillButton = document.querySelector('.remove-skill');

function removeSkillHandler( evt ) {
	var skill = evt.currentTarget.parentNode;
	skill.remove()
}
removeSkillButton.addEventListener('click', removeSkillHandler);




// Submit the form. -JMS
var form = document.querySelector('form');
var apiURL = '//sandiegojs-vanilla-workshop.herokuapp.com';


var submitHandler = function( evt ) {
	evt.preventDefault();

	var form = evt.target;
	validateForm( form );

	if ( form.checkValidity() ) {

		var path = apiURL + '/forms';
		xhr( 'POST', path, serializeArray( 'form' ), function( err, data ) {
			if ( err ) {

				renderError( err );
				throw err

			}
			console.log( data );
			renderFormData( data );
			document.querySelector( 'form' ).reset()
		} )
	}
};
form.addEventListener( 'submit', submitHandler );


// Serialize the form data. -JMS
var serializeArray = function(selector) {
	var form = document.querySelector(selector);
	var formInputs = form.querySelectorAll('input:not([type=submit]), textarea');

	var data = {};

	for(var i = 0; i < formInputs.length; i++) {
		var item = formInputs[i];

		if (item.name ==='skills_attributes') {
			if ( ! ! data[item.name] ) {
				data[item.name].push( { 'description': item.value } )
			} else {
				data[item.name] = [{ 'description': item.value }]
			}
		} else {
			data[item.name] = item.value
		}
	}
	var wrapper = {};
	wrapper['form'] = data;

	return wrapper
};


// Build XHR and Submit

var xhr = function( method, path, data, callback ) {
	var request = new XMLHttpRequest();
	request.open( method, path, true );
	request.setRequestHeader( 'Content-Type', 'application/json' );
	request.onreadystatechange = function() {
		// ignore anything that isn't the last state
		if ( request.readyState !== 4 ) {
			return
		}

		// if we didn't get a "good" status such as 200 OK or 201 Created send back an error
		if ( request.readyState === 4 && (request.status !== 200 && request.status !== 201
			) ) {
			callback( new Error( 'XHR Failed: ' + path ), null )
		}

		// return our server data
		callback( null, JSON.parse( request.responseText ) )
	};
	request.send( JSON.stringify( data ) )
};



var renderError = function( error ) {
	var responseNode = document.querySelector( '.response-wrapper' );
	var errorNode = createElementWithTextNode( 'div', error.toString() );
	errorNode.className = 'error';
	responseNode.appendChild( errorNode )
};


// Handle server response

var renderFormData = function( data ) {
	var responseNode = document.querySelector( '.response-wrapper' );

	//generic success message
	var successNode = createElementWithTextNode( 'div', 'You\'ve add a new card' );
	successNode.className = 'success';
	responseNode.appendChild( successNode );

	var dictionaryNode = document.createElement( 'dl' );
	var keys = ['name', 'email', 'github', 'twitter', 'city', 'state', 'bio'];
	keys.forEach( function( key ) {
		//create a dom node with the name of a value
		var termNode = createElementWithTextNode( 'dt', key );
		dictionaryNode.appendChild( termNode );

		//create another dom node with the value
		var definitionNode = createElementWithTextNode( 'dd', data[key] );
		dictionaryNode.appendChild( definitionNode )
	} );

	var skillsTermNode = createElementWithTextNode( 'dt', 'skills' );
	dictionaryNode.appendChild( skillsTermNode );

	var skillsDefinitionNode = document.createElement( 'dd' );
	var skillsList = document.createElement( 'ul' );
	skillsDefinitionNode.appendChild( skillsList );
	dictionaryNode.appendChild( skillsDefinitionNode );

	if ( data.skills_attributes ) {
		data.skills_attributes.forEach( function( skill ) {
			var skillNode = createElementWithTextNode( 'li', skill.description );
			skillsList.appendChild( skillNode )
		} )
	}

	dictionaryNode.className = 'response';
	responseNode.appendChild( dictionaryNode )
};

// Validate the email fields
var email = document.querySelector( '[name="email"]' )

var emailListener = function( evt ) {
	var input = evt.currentTarget
	if ( input.validity.typeMismatch ) {
		input.setCustomValidity( 'Oops, try a real email address.' )
	} else {
		input.setCustomValidity( '' )
	}
}
email.addEventListener( 'keyup', emailListener )
form.noValidate = true;

// Validate the form
var validateForm = function( form ) {
	for (var f = 0; f < form.elements.length; f++) {
		var field = form.elements[f];
		if(isValid(field)) {
			// remove error styles
			clearError(field)
		} else {
			// style field, show the error, etc
			setError(field)
		}
	}
};

// Set and clear error messages
var setError = function(field) {
//	var error = field.nextElementSibling;
//	if (error) {
//		error.innerHTML = field.validationMessage
//	}
	var error = field;
	if (error) {
		error.classList.add( 'field-error' );
		console.log('happy');
	}

};

var clearError = function( field ) {
	var error = field.nextElementSibling;
	if (error) {
		error.innerHTML = '';
	}
};

// Custom validation logic
var isValid = function( field ) {
	if ( field.name === 'state' ) {
		var validStates = ['CA', 'TX', 'NY'];
		if ( validStates.indexOf( field.value ) === -1 ) {
			// invalid state
			field.setCustomValidity( 'Please provide a valid state (CA, TX, or NY)' )
		} else {
			// valid state
			field.setCustomValidity( '' )
		}
	}
	return field.checkValidity()
};

// Set text with cookies
//document.cookie = 'returning=true; expires=Mon, 1 Feb 2016 12:00:UTC;';

function setCookie (cookieName, cookieValue, cookieDays) {
	var expireTime = new Date();
	expireTime.setTime(expireTime.getTime() + cookieDays * 24 * 60 * 60);
	var expires = "expires=" +expireTime.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

function getCookie(cookieName) {
	var name = cookieName + "=";
	var cookieArray = document.cookie.split(';');
	for ( var i = 0; i < cookieArray.length; i++) {
		var cookieStr = cookieArray[i];
		while (cookieStr.charAt(0)  == ' ') {
			cookieStr = cookieStr.substring(1)
		}
		if (cookieStr.indexOf(name) == 0 ) {
			return cookieStr.substring(name.length,cookieStr.length)
		}
	}
	return "";
}

if(getCookie('returning') === 'yes') {
	document.querySelector('.greeting' ).innerHTML = "Welcome back to the program!"
} else {
	setCookie('returning', 'yes', 2)
}



//Helper functions. -JMS
//  1. Select the last element in a group. -JMS

function last(selector) {
	var all = document.querySelectorAll(selector);
	var length = all.length;
	return all[length - 1];
}

// 2. Creates a DOM element and adds some text to it. -JMS
var createElementWithTextNode = function(tagName, tagContent) {
	var node = document.createElement(tagName);

	if (tagContent) {
		var textNode = document.createTextNode( tagContent );
		node.appendChild( textNode )
	}
	return node;
};