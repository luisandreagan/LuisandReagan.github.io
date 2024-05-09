<?php
// Retrieve the encrypted file name from the query string
$encryptedFileName = $_GET['file'];

// Perform decryption of the file name
$decryptedFileName = decryptFileName($encryptedFileName);

// Serve the corresponding HTML file
header('Content-Type: text/html');

// Check if the decrypted file name exists
if (file_exists($decryptedFileName)) {
    // Read and output the content of the HTML file
    readfile($decryptedFileName);
} else {
    // If the file doesn't exist, output an error message
    echo 'Error: File not found.';
}

// Decryption function (modify this function according to your encryption mechanism)
function decryptFileName($encryptedFileName) {
    // Example: simple reverse substitution cipher
    // In this example, we simply reverse the characters of the encrypted file name
    // You should replace this with your actual decryption mechanism
    return strrev($encryptedFileName);
}
?>