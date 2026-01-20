<?php
/*
 *  CONFIGURE EVERYTHING HERE
 */



// an email address that will receive the email with the output of the form
$sendTo = 'jonnathanp@weblifetech.com';






// message that will be displayed when everything is OK :)
$okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';

// If something goes wrong, we will display this message.
$errorMessage = 'There was an error while submitting the form. Please try again later';


/*
 *  LET'S DO THE SENDING
 */

// if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
error_reporting( E_ALL & ~E_NOTICE );

try {

	if ( count( $_POST ) == 0 && ! isset($_POST['nombre'])&& ! isset($_POST['email'])&& ! isset($_POST['mensaje'])) {
		throw new \Exception( 'El formulario está vacío' );
	}

	// an email address that will be in the From field of the email.
	$from = $_POST['email'] ;
	// The message send in email
	$message = "Nombre: " . $_POST['nombre'] . "\r\n";
    $message .= "Email: " . $_POST['email'] . "\r\n";
    $message .= "Asunto: " . $_POST['asunto'] . "\r\n";
    $message .= "Mensaje: \r\n" . $_POST['mensaje'] . "\r\n";
    
	// subject of the email
    $subject = "Contacto Web: " . ($_POST['asunto'] ? $_POST['asunto'] : 'Nuevo Mensaje');

	$headers = 'From: ' . $from . "\r\n" .
	           'Reply-To: ' . $sendTo . "\r\n" .
	           'X-Mailer: PHP/' . phpversion();

	// Send email
	if(mail( $sendTo, $subject, $message, $headers )) {
        $responseArray = array('type' => 'success', 'message' => $okMessage);
    } else {
        throw new \Exception('Error sending email');
    }

} catch ( \Exception $e ) {
	 $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}


// if requested by AJAX request return JSON response
if ( ! empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) == 'xmlhttprequest' ) {
	$encoded = json_encode( array( 'status' => true, 'message' => $okMessage ) );

	header( 'Content-Type: application/json' );

	echo $encoded;
} // else just display the message
else {
	$encoded = json_encode( array( 'status' => false, 'message' => $errorMessage ) );

	header( 'Content-Type: application/json' );

	echo $encoded;
}
